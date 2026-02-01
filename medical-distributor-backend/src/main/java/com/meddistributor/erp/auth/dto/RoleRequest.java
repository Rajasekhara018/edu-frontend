package com.meddistributor.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;
import lombok.Data;

@Data
public class RoleRequest {
  @NotBlank
  private String name;
  private String description;
  private Set<String> permissions;
}
