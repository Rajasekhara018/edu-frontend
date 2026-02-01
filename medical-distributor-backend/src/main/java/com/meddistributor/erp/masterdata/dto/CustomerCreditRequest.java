package com.meddistributor.erp.masterdata.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class CustomerCreditRequest {
  @NotNull
  private BigDecimal creditLimit;
  private int paymentTermsDays;
}
