package com.meddistributor.erp.reporting.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OutstandingAgingRow {
  private UUID customerId;
  private String customerName;
  private BigDecimal bucket0to30;
  private BigDecimal bucket31to60;
  private BigDecimal bucket61to90;
  private BigDecimal bucket90plus;
  private BigDecimal totalOutstanding;
}
