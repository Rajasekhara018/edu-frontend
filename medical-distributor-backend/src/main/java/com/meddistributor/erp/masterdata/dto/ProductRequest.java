package com.meddistributor.erp.masterdata.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductRequest {
  @NotBlank
  private String sku;
  @NotBlank
  private String name;
  private String hsn;
  @NotNull
  private BigDecimal gstRate;
  private String manufacturer;
  private String category;
}
