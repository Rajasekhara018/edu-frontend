package com.meddistributor.erp.auth.dto;

import java.util.Set;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
  private UUID id;
  private String name;
  private String description;
  private Set<String> permissions;
}
