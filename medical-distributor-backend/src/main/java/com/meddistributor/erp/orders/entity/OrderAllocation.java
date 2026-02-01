package com.meddistributor.erp.orders.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
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
@Table(name = "order_allocation")
public class OrderAllocation extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "order_line_id")
  private SalesOrderLine orderLine;

  @ManyToOne(optional = false)
  @JoinColumn(name = "batch_id")
  private InventoryBatch batch;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal qtyAllocated;
}
