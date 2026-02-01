package com.meddistributor.erp.masterdata.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product extends BaseEntity {
  @Column(nullable = false, unique = true, length = 80)
  private String sku;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(length = 30)
  private String hsn;

  @Column(nullable = false, precision = 5, scale = 2)
  private BigDecimal gstRate;

  @Column(length = 160)
  private String manufacturer;

  @Column(length = 120)
  private String category;
}
