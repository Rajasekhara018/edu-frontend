package com.meddistributor.erp.masterdata.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class CustomerRequest {
  @NotBlank
  private String name;
  private String gstin;
  private String licenseNo;
  private String billingAddress;
  private String shippingAddress;
  private String contactName;
  private String contactPhone;
  private String email;
  private String territory;
  @NotNull
  private BigDecimal creditLimit;
  private int paymentTermsDays;
  @NotBlank
  private String status;
  private UUID accountManagerId;
}
