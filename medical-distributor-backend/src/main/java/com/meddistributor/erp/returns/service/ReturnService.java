package com.meddistributor.erp.returns.service;

import com.meddistributor.erp.audit.service.AuditService;
import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceLine;
import com.meddistributor.erp.billing.entity.InvoiceStatus;
import com.meddistributor.erp.billing.repository.InvoiceLineRepository;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.inventory.service.InventoryBatchService;
import com.meddistributor.erp.returns.dto.CreditNoteResponse;
import com.meddistributor.erp.returns.dto.ReturnLineRequest;
import com.meddistributor.erp.returns.dto.ReturnLineResponse;
import com.meddistributor.erp.returns.dto.ReturnRequest;
import com.meddistributor.erp.returns.dto.ReturnResponse;
import com.meddistributor.erp.returns.entity.CreditNote;
import com.meddistributor.erp.returns.entity.CreditNoteLine;
import com.meddistributor.erp.returns.entity.ReturnLine;
import com.meddistributor.erp.returns.entity.ReturnOrder;
import com.meddistributor.erp.returns.entity.ReturnStatus;
import com.meddistributor.erp.returns.repository.CreditNoteLineRepository;
import com.meddistributor.erp.returns.repository.CreditNoteRepository;
import com.meddistributor.erp.returns.repository.ReturnLineRepository;
import com.meddistributor.erp.returns.repository.ReturnOrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReturnService {
  private final InvoiceRepository invoiceRepository;
  private final InvoiceLineRepository invoiceLineRepository;
  private final InventoryBatchRepository batchRepository;
  private final InventoryBatchService batchService;
  private final ReturnOrderRepository returnOrderRepository;
  private final ReturnLineRepository returnLineRepository;
  private final CreditNoteRepository creditNoteRepository;
  private final CreditNoteLineRepository creditNoteLineRepository;
  private final AuditService auditService;

  public ReturnService(InvoiceRepository invoiceRepository,
                       InvoiceLineRepository invoiceLineRepository,
                       InventoryBatchRepository batchRepository,
                       InventoryBatchService batchService,
                       ReturnOrderRepository returnOrderRepository,
                       ReturnLineRepository returnLineRepository,
                       CreditNoteRepository creditNoteRepository,
                       CreditNoteLineRepository creditNoteLineRepository,
                       AuditService auditService) {
    this.invoiceRepository = invoiceRepository;
    this.invoiceLineRepository = invoiceLineRepository;
    this.batchRepository = batchRepository;
    this.batchService = batchService;
    this.returnOrderRepository = returnOrderRepository;
    this.returnLineRepository = returnLineRepository;
    this.creditNoteRepository = creditNoteRepository;
    this.creditNoteLineRepository = creditNoteLineRepository;
    this.auditService = auditService;
  }

  @Transactional
  public ReturnResponse create(ReturnRequest request) {
    Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
        .orElseThrow(() -> new NotFoundException("Invoice not found"));

    ReturnOrder returnOrder = new ReturnOrder();
    returnOrder.setInvoice(invoice);
    returnOrder.setCustomer(invoice.getCustomer());
    returnOrder.setReturnDate(LocalDate.now());
    returnOrder.setReason(request.getReason());
    returnOrder.setStatus(ReturnStatus.APPROVED);

    List<ReturnLineResponse> lineResponses = new ArrayList<>();
    BigDecimal totalAmount = BigDecimal.ZERO;

    for (ReturnLineRequest lineRequest : request.getLines()) {
      InvoiceLine invoiceLine = invoiceLineRepository.findById(lineRequest.getInvoiceLineId())
          .orElseThrow(() -> new NotFoundException("Invoice line not found"));
      BigDecimal alreadyReturned = returnLineRepository.sumReturnedByInvoiceLine(invoiceLine.getId());
      if (alreadyReturned.add(lineRequest.getQuantity()).compareTo(invoiceLine.getQuantity()) > 0) {
        throw new BusinessException("Return quantity exceeds invoiced quantity", HttpStatus.BAD_REQUEST);
      }
      InventoryBatch batch = batchRepository.findById(lineRequest.getBatchId())
          .orElseThrow(() -> new NotFoundException("Batch not found"));
      BigDecimal unitNet = invoiceLine.getNetAmount().divide(invoiceLine.getQuantity(), 4, RoundingMode.HALF_UP);
      BigDecimal netAmount = unitNet.multiply(lineRequest.getQuantity());

      ReturnLine line = new ReturnLine();
      line.setReturnOrder(returnOrder);
      line.setInvoiceLine(invoiceLine);
      line.setBatch(batch);
      line.setQuantity(lineRequest.getQuantity());
      line.setUnitPrice(invoiceLine.getUnitPrice());
      line.setTaxRate(invoiceLine.getTaxRate());
      line.setNetAmount(netAmount);
      line.setSaleable(lineRequest.isSaleable());
      returnOrder.getLines().add(line);

      if (lineRequest.isSaleable()) {
        batchService.addSaleableReturn(batch, lineRequest.getQuantity());
      } else {
        batchService.addNonSaleableReturn(batch, lineRequest.getQuantity());
      }
      auditService.logChange("InventoryBatch", batch.getId(), "RETURN", null, batch);

      totalAmount = totalAmount.add(netAmount);
      lineResponses.add(ReturnLineResponse.builder()
          .invoiceLineId(invoiceLine.getId())
          .batchId(batch.getId())
          .quantity(lineRequest.getQuantity())
          .netAmount(netAmount)
          .saleable(lineRequest.isSaleable())
          .build());
    }

    returnOrder.setTotalAmount(totalAmount);
    ReturnOrder savedReturn = returnOrderRepository.save(returnOrder);
    lineResponses = savedReturn.getLines().stream().map(line -> ReturnLineResponse.builder()
        .id(line.getId())
        .invoiceLineId(line.getInvoiceLine().getId())
        .batchId(line.getBatch().getId())
        .quantity(line.getQuantity())
        .netAmount(line.getNetAmount())
        .saleable(line.isSaleable())
        .build()).toList();

    CreditNote creditNote = new CreditNote();
    creditNote.setCreditNoteNo(generateCreditNoteNo());
    creditNote.setInvoice(invoice);
    creditNote.setReturnOrder(savedReturn);
    creditNote.setCreditDate(LocalDate.now());
    creditNote.setAmount(totalAmount);
    CreditNote savedCredit = creditNoteRepository.save(creditNote);

    for (ReturnLine line : savedReturn.getLines()) {
      CreditNoteLine cnLine = new CreditNoteLine();
      cnLine.setCreditNote(savedCredit);
      cnLine.setInvoiceLine(line.getInvoiceLine());
      cnLine.setQuantity(line.getQuantity());
      cnLine.setAmount(line.getNetAmount());
      creditNoteLineRepository.save(cnLine);
    }

    invoice.setOutstandingAmount(invoice.getOutstandingAmount().subtract(totalAmount));
    if (invoice.getOutstandingAmount().compareTo(BigDecimal.ZERO) <= 0) {
      invoice.setOutstandingAmount(BigDecimal.ZERO);
      invoice.setStatus(InvoiceStatus.PAID);
    }
    invoiceRepository.save(invoice);
    auditService.logChange("CreditNote", savedCredit.getId(), "CREATED", null, savedCredit);

    savedReturn.setStatus(ReturnStatus.COMPLETED);
    returnOrderRepository.save(savedReturn);

    return ReturnResponse.builder()
        .id(savedReturn.getId())
        .invoiceId(invoice.getId())
        .customerId(invoice.getCustomer().getId())
        .returnDate(savedReturn.getReturnDate())
        .reason(savedReturn.getReason())
        .status(savedReturn.getStatus().name())
        .totalAmount(totalAmount)
        .lines(lineResponses)
        .build();
  }

  public CreditNoteResponse getCreditNote(UUID creditNoteId) {
    CreditNote creditNote = creditNoteRepository.findById(creditNoteId)
        .orElseThrow(() -> new NotFoundException("Credit note not found"));
    return CreditNoteResponse.builder()
        .id(creditNote.getId())
        .creditNoteNo(creditNote.getCreditNoteNo())
        .invoiceId(creditNote.getInvoice().getId())
        .returnId(creditNote.getReturnOrder().getId())
        .creditDate(creditNote.getCreditDate())
        .amount(creditNote.getAmount())
        .build();
  }

  private String generateCreditNoteNo() {
    String date = LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
    String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    return "CN-" + date + "-" + random;
  }
}
