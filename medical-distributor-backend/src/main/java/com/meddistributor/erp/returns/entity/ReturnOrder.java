package com.meddistributor.erp.returns.entity;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.masterdata.entity.Customer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "return_order")
public class ReturnOrder extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "invoice_id")
  private Invoice invoice;

  @ManyToOne(optional = false)
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @Column(nullable = false)
  private LocalDate returnDate;

  @Column(length = 200)
  private String reason;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ReturnStatus status;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal totalAmount;

  @OneToMany(mappedBy = "returnOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<ReturnLine> lines = new ArrayList<>();
}
