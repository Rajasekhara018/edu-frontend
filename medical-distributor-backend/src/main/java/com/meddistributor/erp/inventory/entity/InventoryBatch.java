package com.meddistributor.erp.inventory.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.masterdata.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "inventory_batch")
public class InventoryBatch extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @Column(nullable = false, length = 80)
  private String batchNo;

  @Column(nullable = false)
  private LocalDate expiryDate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal mrp;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal purchaseRate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal qtyAvailable;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal qtyReserved;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal qtyQuarantine;

  @Column(length = 30)
  private String branchCode;
}
