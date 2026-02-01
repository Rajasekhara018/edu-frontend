package com.meddistributor.erp.returns.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReturnLineResponse {
  private UUID id;
  private UUID invoiceLineId;
  private UUID batchId;
  private BigDecimal quantity;
  private BigDecimal netAmount;
  private boolean saleable;
}
