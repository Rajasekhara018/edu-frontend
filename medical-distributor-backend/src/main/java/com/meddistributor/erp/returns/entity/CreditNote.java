package com.meddistributor.erp.returns.entity;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "credit_note")
public class CreditNote extends BaseEntity {
  @Column(nullable = false, unique = true, length = 50)
  private String creditNoteNo;

  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_id")
  private Invoice invoice;

  @ManyToOne(optional = false)
  @JoinColumn(name = "return_id")
  private ReturnOrder returnOrder;

  @Column(nullable = false)
  private LocalDate creditDate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal amount;

  @OneToMany(mappedBy = "creditNote", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<CreditNoteLine> lines = new ArrayList<>();
}
