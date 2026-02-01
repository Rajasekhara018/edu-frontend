package com.meddistributor.erp.orders.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Data;

@Data
public class DispatchRequest {
  private String lrNo;
  private String vehicleNo;
  private String transporter;
  private LocalDate eta;
  @NotBlank
  private String status;
}
