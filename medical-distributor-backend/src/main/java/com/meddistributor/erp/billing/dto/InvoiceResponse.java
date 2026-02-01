package com.meddistributor.erp.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvoiceResponse {
  private UUID id;
  private String invoiceNo;
  private UUID orderId;
  private UUID customerId;
  private String customerName;
  private LocalDate invoiceDate;
  private String branchCode;
  private String financialYear;
  private BigDecimal subtotal;
  private BigDecimal discountTotal;
  private BigDecimal taxTotal;
  private BigDecimal netTotal;
  private BigDecimal paidAmount;
  private BigDecimal outstandingAmount;
  private String status;
  private List<InvoiceLineResponse> lines;
}
