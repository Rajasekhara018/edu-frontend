package com.meddistributor.erp.orders.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class SalesOrderLineRequest {
  @NotNull
  private UUID productId;
  @NotNull
  private BigDecimal quantity;
  @NotNull
  private BigDecimal unitPrice;
  @NotNull
  private BigDecimal discount;
  @NotNull
  private BigDecimal taxRate;
}
