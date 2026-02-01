package com.meddistributor.erp.payments.entity;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.common.entity.BaseEntity;
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
@Table(name = "payment_allocation")
public class PaymentAllocation extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "payment_id")
  private Payment payment;

  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_id")
  private Invoice invoice;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal amount;
}
