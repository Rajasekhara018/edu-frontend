package com.meddistributor.erp.billing.service;

import com.meddistributor.erp.audit.service.AuditService;
import com.meddistributor.erp.billing.dto.InvoiceLineResponse;
import com.meddistributor.erp.billing.dto.InvoiceResponse;
import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceLine;
import com.meddistributor.erp.billing.entity.InvoiceSequence;
import com.meddistributor.erp.billing.entity.InvoiceSequenceKey;
import com.meddistributor.erp.billing.entity.InvoiceStatus;
import com.meddistributor.erp.billing.repository.InvoiceLineRepository;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.billing.repository.InvoiceSequenceRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.common.util.DateUtil;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.service.InventoryBatchService;
import com.meddistributor.erp.orders.entity.OrderAllocation;
import com.meddistributor.erp.orders.entity.OrderStatus;
import com.meddistributor.erp.orders.entity.SalesOrder;
import com.meddistributor.erp.orders.entity.SalesOrderLine;
import com.meddistributor.erp.orders.repository.OrderAllocationRepository;
import com.meddistributor.erp.orders.repository.SalesOrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {
  private final SalesOrderRepository orderRepository;
  private final OrderAllocationRepository allocationRepository;
  private final InvoiceRepository invoiceRepository;
  private final InvoiceLineRepository invoiceLineRepository;
  private final InvoiceSequenceRepository sequenceRepository;
  private final InventoryBatchService batchService;
  private final AuditService auditService;

  public CheckoutService(SalesOrderRepository orderRepository,
                         OrderAllocationRepository allocationRepository,
                         InvoiceRepository invoiceRepository,
                         InvoiceLineRepository invoiceLineRepository,
                         InvoiceSequenceRepository sequenceRepository,
                         InventoryBatchService batchService,
                         AuditService auditService) {
    this.orderRepository = orderRepository;
    this.allocationRepository = allocationRepository;
    this.invoiceRepository = invoiceRepository;
    this.invoiceLineRepository = invoiceLineRepository;
    this.sequenceRepository = sequenceRepository;
    this.batchService = batchService;
    this.auditService = auditService;
  }

  @Transactional
  public InvoiceResponse checkout(UUID orderId) {
    Invoice existing = invoiceRepository.findByOrderId(orderId).orElse(null);
    if (existing != null) {
      return toResponse(existing, invoiceLineRepository.findByInvoiceId(existing.getId()));
    }
    SalesOrder order = orderRepository.findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found"));
    if (order.getStatus().ordinal() < OrderStatus.ALLOCATED.ordinal()) {
      throw new BusinessException("Order not allocated", HttpStatus.BAD_REQUEST);
    }
    BigDecimal outstanding = invoiceRepository.sumOutstandingByCustomer(order.getCustomer().getId())
        .orElse(BigDecimal.ZERO);
    if (outstanding.add(order.getNetTotal()).compareTo(order.getCustomer().getCreditLimit()) > 0) {
      throw new BusinessException("Credit limit exceeded", HttpStatus.BAD_REQUEST);
    }

    String branchCode = order.getBranchCode() == null ? "HQ" : order.getBranchCode();
    String financialYear = DateUtil.financialYear(LocalDate.now());
    InvoiceSequence sequence = sequenceRepository.lockForUpdate(branchCode, financialYear)
        .orElseGet(() -> {
          InvoiceSequence seq = new InvoiceSequence();
          InvoiceSequenceKey key = new InvoiceSequenceKey();
          key.setBranchCode(branchCode);
          key.setFinancialYear(financialYear);
          seq.setId(key);
          seq.setNextSeq(1L);
          return seq;
        });
    long seqValue = sequence.getNextSeq();
    sequence.setNextSeq(seqValue + 1);
    sequenceRepository.save(sequence);
    String invoiceNo = branchCode + "/" + financialYear + "/" + String.format("%06d", seqValue);

    Invoice invoice = new Invoice();
    invoice.setInvoiceNo(invoiceNo);
    invoice.setOrder(order);
    invoice.setCustomer(order.getCustomer());
    invoice.setInvoiceDate(LocalDate.now());
    invoice.setBranchCode(branchCode);
    invoice.setFinancialYear(financialYear);
    invoice.setSubtotal(order.getSubtotal());
    invoice.setDiscountTotal(order.getDiscountTotal());
    invoice.setTaxTotal(order.getTaxTotal());
    invoice.setNetTotal(order.getNetTotal());
    invoice.setPaidAmount(BigDecimal.ZERO);
    invoice.setOutstandingAmount(order.getNetTotal());
    invoice.setStatus(InvoiceStatus.OPEN);

    Invoice savedInvoice = invoiceRepository.save(invoice);

    List<OrderAllocation> allocations = allocationRepository.findByOrderLineOrderId(orderId);
    for (OrderAllocation allocation : allocations) {
      SalesOrderLine line = allocation.getOrderLine();
      InventoryBatch batch = allocation.getBatch();
      BigDecimal qty = allocation.getQtyAllocated();
      BigDecimal discountPerUnit = line.getDiscount().divide(line.getQuantity(), 4, RoundingMode.HALF_UP);
      BigDecimal discountAllocated = discountPerUnit.multiply(qty);
      BigDecimal base = line.getUnitPrice().multiply(qty).subtract(discountAllocated);
      BigDecimal tax = base.multiply(line.getTaxRate()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
      BigDecimal net = base.add(tax);

      InvoiceLine invoiceLine = new InvoiceLine();
      invoiceLine.setInvoice(savedInvoice);
      invoiceLine.setOrderLine(line);
      invoiceLine.setProduct(line.getProduct());
      invoiceLine.setBatch(batch);
      invoiceLine.setQuantity(qty);
      invoiceLine.setUnitPrice(line.getUnitPrice());
      invoiceLine.setDiscount(discountAllocated);
      invoiceLine.setTaxRate(line.getTaxRate());
      invoiceLine.setNetAmount(net);
      invoiceLineRepository.save(invoiceLine);

      batchService.consumeReserved(batch, qty);
      auditService.logChange("InventoryBatch", batch.getId(), "CONSUME_RESERVED", null, batch);
    }

    order.setStatus(OrderStatus.INVOICED);
    orderRepository.save(order);
    auditService.logChange("Invoice", savedInvoice.getId(), "CREATED", null, savedInvoice);

    return toResponse(savedInvoice, invoiceLineRepository.findByInvoiceId(savedInvoice.getId()));
  }

  private InvoiceResponse toResponse(Invoice invoice, List<InvoiceLine> lines) {
    List<InvoiceLineResponse> lineResponses = lines.stream().map(line -> InvoiceLineResponse.builder()
        .id(line.getId())
        .productId(line.getProduct().getId())
        .productName(line.getProduct().getName())
        .batchId(line.getBatch().getId())
        .batchNo(line.getBatch().getBatchNo())
        .quantity(line.getQuantity())
        .unitPrice(line.getUnitPrice())
        .discount(line.getDiscount())
        .taxRate(line.getTaxRate())
        .netAmount(line.getNetAmount())
        .build()).toList();

    return InvoiceResponse.builder()
        .id(invoice.getId())
        .invoiceNo(invoice.getInvoiceNo())
        .orderId(invoice.getOrder().getId())
        .customerId(invoice.getCustomer().getId())
        .customerName(invoice.getCustomer().getName())
        .invoiceDate(invoice.getInvoiceDate())
        .branchCode(invoice.getBranchCode())
        .financialYear(invoice.getFinancialYear())
        .subtotal(invoice.getSubtotal())
        .discountTotal(invoice.getDiscountTotal())
        .taxTotal(invoice.getTaxTotal())
        .netTotal(invoice.getNetTotal())
        .paidAmount(invoice.getPaidAmount())
        .outstandingAmount(invoice.getOutstandingAmount())
        .status(invoice.getStatus().name())
        .lines(lineResponses)
        .build();
  }
}
