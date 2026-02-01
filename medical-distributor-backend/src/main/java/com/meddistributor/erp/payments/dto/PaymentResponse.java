package com.meddistributor.erp.payments.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {
  private UUID id;
  private UUID customerId;
  private String customerName;
  private LocalDate paymentDate;
  private BigDecimal amount;
  private String method;
  private String reference;
  private String status;
  private String notes;
}
