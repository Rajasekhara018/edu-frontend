package com.meddistributor.erp.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class SalesOrderRequest {
  @NotNull
  private UUID customerId;
  private LocalDate orderDate;
  private String branchCode;
  @NotNull
  private List<@Valid SalesOrderLineRequest> lines;
}
