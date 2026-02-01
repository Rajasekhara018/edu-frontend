package com.meddistributor.erp.auth.dto;

import java.util.Set;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
  private UUID id;
  private String username;
  private String fullName;
  private String email;
  private String territory;
  private String branchCode;
  private String status;
  private Set<String> roles;
}
