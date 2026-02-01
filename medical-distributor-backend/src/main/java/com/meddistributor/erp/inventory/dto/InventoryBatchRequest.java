package com.meddistributor.erp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
public class InventoryBatchRequest {
  @NotNull
  private UUID productId;
  @NotBlank
  private String batchNo;
  @NotNull
  private LocalDate expiryDate;
  @NotNull
  private BigDecimal mrp;
  @NotNull
  private BigDecimal purchaseRate;
  @NotNull
  private BigDecimal qtyAvailable;
  private BigDecimal qtyReserved = BigDecimal.ZERO;
  private BigDecimal qtyQuarantine = BigDecimal.ZERO;
  private String branchCode;
}
