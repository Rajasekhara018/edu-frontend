package com.meddistributor.erp.payments.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PaymentAllocationRequest {
  @NotNull
  private UUID paymentId;
  @NotNull
  private List<@Valid PaymentAllocationItem> allocations;
}
