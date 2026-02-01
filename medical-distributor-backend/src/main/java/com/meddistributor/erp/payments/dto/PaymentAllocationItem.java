package com.meddistributor.erp.payments.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class PaymentAllocationItem {
  @NotNull
  private UUID invoiceId;
  @NotNull
  private BigDecimal amount;
}
