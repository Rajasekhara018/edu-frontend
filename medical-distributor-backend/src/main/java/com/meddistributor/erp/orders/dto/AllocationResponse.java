package com.meddistributor.erp.orders.dto;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AllocationResponse {
  private UUID orderId;
  private String allocationStatus;
  private List<OrderAllocationLineResponse> allocations;
}
