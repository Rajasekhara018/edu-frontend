package com.meddistributor.erp.returns.entity;

import com.meddistributor.erp.billing.entity.InvoiceLine;
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
@Table(name = "return_line")
public class ReturnLine extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "return_id")
  private ReturnOrder returnOrder;

  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_line_id")
  private InvoiceLine invoiceLine;

  @ManyToOne(optional = false)
  @JoinColumn(name = "batch_id")
  private InventoryBatch batch;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal quantity;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal unitPrice;

  @Column(nullable = false, precision = 5, scale = 2)
  private BigDecimal taxRate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal netAmount;

  @Column(nullable = false)
  private boolean saleable;
}
