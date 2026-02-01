package com.meddistributor.erp.orders.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DispatchResponse {
  private UUID id;
  private UUID orderId;
  private String lrNo;
  private String vehicleNo;
  private String transporter;
  private LocalDate eta;
  private Instant dispatchedAt;
  private Instant deliveredAt;
  private String status;
}
