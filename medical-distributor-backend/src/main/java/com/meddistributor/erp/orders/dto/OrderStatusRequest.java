package com.meddistributor.erp.orders.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusRequest {
  @NotBlank
  private String status;
}
