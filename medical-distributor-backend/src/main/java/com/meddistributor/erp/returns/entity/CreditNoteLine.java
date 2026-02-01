package com.meddistributor.erp.returns.entity;

import com.meddistributor.erp.billing.entity.InvoiceLine;
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
@Table(name = "credit_note_line")
public class CreditNoteLine extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "credit_note_id")
  private CreditNote creditNote;

  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_line_id")
  private InvoiceLine invoiceLine;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal quantity;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal amount;
}
