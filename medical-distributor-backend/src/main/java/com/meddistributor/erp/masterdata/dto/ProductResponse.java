package com.meddistributor.erp.masterdata.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
  private UUID id;
  private String sku;
  private String name;
  private String hsn;
  private BigDecimal gstRate;
  private String manufacturer;
  private String category;
}
