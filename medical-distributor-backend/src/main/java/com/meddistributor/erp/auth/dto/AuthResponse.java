package com.meddistributor.erp.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
  private String accessToken;
  private String refreshToken;
  private long expiresInSeconds;
}
