package com.meddistributor.erp.reporting.service;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceStatus;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.reporting.dto.NearExpiryRow;
import com.meddistributor.erp.reporting.dto.OutstandingAgingRow;
import com.meddistributor.erp.reporting.dto.SalesReportRow;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReportingService {
  private final InvoiceRepository invoiceRepository;
  private final InventoryBatchRepository batchRepository;

  public ReportingService(InvoiceRepository invoiceRepository, InventoryBatchRepository batchRepository) {
    this.invoiceRepository = invoiceRepository;
    this.batchRepository = batchRepository;
  }

  public PageResponse<SalesReportRow> salesReport(LocalDate from, LocalDate to, Pageable pageable) {
    Page<Invoice> page = invoiceRepository.findByDateRange(from, to, pageable);
    return PageResponse.<SalesReportRow>builder()
        .data(page.map(invoice -> SalesReportRow.builder()
            .invoiceId(invoice.getId())
            .invoiceNo(invoice.getInvoiceNo())
            .invoiceDate(invoice.getInvoiceDate())
            .customerId(invoice.getCustomer().getId())
            .customerName(invoice.getCustomer().getName())
            .netTotal(invoice.getNetTotal())
            .build()).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public List<OutstandingAgingRow> outstandingAging() {
    List<Invoice> invoices = invoiceRepository.findByStatus(InvoiceStatus.OPEN);
    Map<UUID, OutstandingAgingRow> map = new HashMap<>();
    LocalDate today = LocalDate.now();

    for (Invoice invoice : invoices) {
      long days = ChronoUnit.DAYS.between(invoice.getInvoiceDate(), today);
      OutstandingAgingRow row = map.computeIfAbsent(invoice.getCustomer().getId(), id -> OutstandingAgingRow.builder()
          .customerId(invoice.getCustomer().getId())
          .customerName(invoice.getCustomer().getName())
          .bucket0to30(BigDecimal.ZERO)
          .bucket31to60(BigDecimal.ZERO)
          .bucket61to90(BigDecimal.ZERO)
          .bucket90plus(BigDecimal.ZERO)
          .totalOutstanding(BigDecimal.ZERO)
          .build());
      BigDecimal amount = invoice.getOutstandingAmount();
      if (days <= 30) {
        row.setBucket0to30(row.getBucket0to30().add(amount));
      } else if (days <= 60) {
        row.setBucket31to60(row.getBucket31to60().add(amount));
      } else if (days <= 90) {
        row.setBucket61to90(row.getBucket61to90().add(amount));
      } else {
        row.setBucket90plus(row.getBucket90plus().add(amount));
      }
      row.setTotalOutstanding(row.getTotalOutstanding().add(amount));
    }
    return new ArrayList<>(map.values());
  }

  public PageResponse<NearExpiryRow> nearExpiry(int days, Pageable pageable) {
    LocalDate threshold = LocalDate.now().plusDays(days);
    Page<InventoryBatch> page = batchRepository.findNearExpiry(threshold, pageable);
    return PageResponse.<NearExpiryRow>builder()
        .data(page.map(batch -> NearExpiryRow.builder()
            .batchId(batch.getId())
            .productId(batch.getProduct().getId())
            .productName(batch.getProduct().getName())
            .batchNo(batch.getBatchNo())
            .expiryDate(batch.getExpiryDate())
            .qtyAvailable(batch.getQtyAvailable())
            .build()).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }
}
