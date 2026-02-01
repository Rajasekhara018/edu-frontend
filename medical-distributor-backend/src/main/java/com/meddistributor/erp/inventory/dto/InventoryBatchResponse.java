package com.meddistributor.erp.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryBatchResponse {
  private UUID id;
  private UUID productId;
  private String productName;
  private String batchNo;
  private LocalDate expiryDate;
  private BigDecimal mrp;
  private BigDecimal purchaseRate;
  private BigDecimal qtyAvailable;
  private BigDecimal qtyReserved;
  private BigDecimal qtyQuarantine;
  private String branchCode;
}
