package com.meddistributor.erp.billing.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvoiceLineResponse {
  private UUID id;
  private UUID productId;
  private String productName;
  private UUID batchId;
  private String batchNo;
  private BigDecimal quantity;
  private BigDecimal unitPrice;
  private BigDecimal discount;
  private BigDecimal taxRate;
  private BigDecimal netAmount;
}
