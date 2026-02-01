package com.meddistributor.erp.payments.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
public class PaymentRequest {
  @NotNull
  private UUID customerId;
  private LocalDate paymentDate;
  @NotNull
  private BigDecimal amount;
  @NotNull
  private String method;
  private String reference;
  private String notes;
}
