package com.meddistributor.erp.returns.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class ReturnLineRequest {
  @NotNull
  private UUID invoiceLineId;
  @NotNull
  private UUID batchId;
  @NotNull
  private BigDecimal quantity;
  private boolean saleable;
}
