package com.meddistributor.erp.returns.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReturnResponse {
  private UUID id;
  private UUID invoiceId;
  private UUID customerId;
  private LocalDate returnDate;
  private String reason;
  private String status;
  private BigDecimal totalAmount;
  private List<ReturnLineResponse> lines;
}
