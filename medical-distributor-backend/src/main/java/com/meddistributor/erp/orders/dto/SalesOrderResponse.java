package com.meddistributor.erp.orders.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SalesOrderResponse {
  private UUID id;
  private String orderNo;
  private UUID customerId;
  private String customerName;
  private String status;
  private String allocationStatus;
  private LocalDate orderDate;
  private String branchCode;
  private BigDecimal subtotal;
  private BigDecimal discountTotal;
  private BigDecimal taxTotal;
  private BigDecimal netTotal;
  private List<SalesOrderLineResponse> lines;
}
