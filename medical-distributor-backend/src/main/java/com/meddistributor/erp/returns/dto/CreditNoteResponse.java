package com.meddistributor.erp.returns.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreditNoteResponse {
  private UUID id;
  private String creditNoteNo;
  private UUID invoiceId;
  private UUID returnId;
  private LocalDate creditDate;
  private BigDecimal amount;
}
