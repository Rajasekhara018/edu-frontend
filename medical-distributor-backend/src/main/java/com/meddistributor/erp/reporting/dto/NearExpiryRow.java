package com.meddistributor.erp.reporting.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NearExpiryRow {
  private UUID batchId;
  private UUID productId;
  private String productName;
  private String batchNo;
  private LocalDate expiryDate;
  private BigDecimal qtyAvailable;
}
