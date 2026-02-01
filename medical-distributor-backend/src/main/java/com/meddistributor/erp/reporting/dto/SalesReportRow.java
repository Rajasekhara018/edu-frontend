package com.meddistributor.erp.reporting.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SalesReportRow {
  private UUID invoiceId;
  private String invoiceNo;
  private LocalDate invoiceDate;
  private UUID customerId;
  private String customerName;
  private BigDecimal netTotal;
}
