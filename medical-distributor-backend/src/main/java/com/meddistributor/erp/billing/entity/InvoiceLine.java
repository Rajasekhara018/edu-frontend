package com.meddistributor.erp.billing.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.orders.entity.SalesOrderLine;
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
@Table(name = "invoice_line")
public class InvoiceLine extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_id")
  private Invoice invoice;

  @ManyToOne
  @JoinColumn(name = "order_line_id")
  private SalesOrderLine orderLine;

  @ManyToOne(optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @ManyToOne(optional = false)
  @JoinColumn(name = "batch_id")
  private InventoryBatch batch;

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
