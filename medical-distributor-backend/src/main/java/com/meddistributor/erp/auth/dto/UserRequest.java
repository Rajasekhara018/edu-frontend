package com.meddistributor.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import lombok.Data;

@Data
public class UserRequest {
  @NotBlank
  private String username;

  private String password;

  @NotBlank
  private String fullName;

  private String email;
  private String territory;
  private String branchCode;

  @NotEmpty
  private Set<String> roles;
}
