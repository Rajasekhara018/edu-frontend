package com.meddistributor.erp.orders.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.masterdata.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sales_order_line")
public class SalesOrderLine extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "order_id")
  private SalesOrder order;

  @ManyToOne(optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal quantity;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal unitPrice;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal discount;

  @Column(nullable = false, precision = 5, scale = 2)
  private BigDecimal taxRate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal netAmount;
}
