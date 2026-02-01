package com.meddistributor.erp.billing.service;

import com.meddistributor.erp.billing.dto.InvoiceLineResponse;
import com.meddistributor.erp.billing.dto.InvoiceResponse;
import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceLine;
import com.meddistributor.erp.billing.repository.InvoiceLineRepository;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.common.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {
  private final InvoiceRepository invoiceRepository;
  private final InvoiceLineRepository invoiceLineRepository;
  private final InvoicePdfService pdfService;

  public InvoiceService(InvoiceRepository invoiceRepository,
                        InvoiceLineRepository invoiceLineRepository,
                        InvoicePdfService pdfService) {
    this.invoiceRepository = invoiceRepository;
    this.invoiceLineRepository = invoiceLineRepository;
    this.pdfService = pdfService;
  }

  public InvoiceResponse get(UUID id) {
    Invoice invoice = invoiceRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Invoice not found"));
    List<InvoiceLine> lines = invoiceLineRepository.findByInvoiceId(id);
    return toResponse(invoice, lines);
  }

  public byte[] getPdf(UUID id) {
    Invoice invoice = invoiceRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Invoice not found"));
    List<InvoiceLine> lines = invoiceLineRepository.findByInvoiceId(id);
    return pdfService.generate(invoice, lines);
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
