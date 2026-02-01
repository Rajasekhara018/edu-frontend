package com.meddistributor.erp.returns.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class ReturnRequest {
  @NotNull
  private UUID invoiceId;
  private String reason;
  @NotNull
  private List<@Valid ReturnLineRequest> lines;
}
