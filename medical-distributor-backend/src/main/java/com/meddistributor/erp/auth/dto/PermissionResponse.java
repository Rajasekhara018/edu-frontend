package com.meddistributor.erp.auth.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionResponse {
  private UUID id;
  private String code;
  private String description;
}
