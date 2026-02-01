package com.meddistributor.erp.orders.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderAllocationLineResponse {
  private UUID orderLineId;
  private UUID batchId;
  private String batchNo;
  private BigDecimal qtyAllocated;
}
