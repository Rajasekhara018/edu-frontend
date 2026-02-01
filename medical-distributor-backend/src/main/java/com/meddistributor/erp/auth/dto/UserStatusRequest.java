package com.meddistributor.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserStatusRequest {
  @NotBlank
  private String status;
}
