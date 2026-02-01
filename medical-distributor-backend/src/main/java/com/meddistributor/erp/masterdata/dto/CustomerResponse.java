package com.meddistributor.erp.masterdata.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerResponse {
  private UUID id;
  private String name;
  private String gstin;
  private String licenseNo;
  private String billingAddress;
  private String shippingAddress;
  private String contactName;
  private String contactPhone;
  private String email;
  private String territory;
  private BigDecimal creditLimit;
  private BigDecimal creditUsed;
  private int paymentTermsDays;
  private String status;
  private UUID accountManagerId;
}
