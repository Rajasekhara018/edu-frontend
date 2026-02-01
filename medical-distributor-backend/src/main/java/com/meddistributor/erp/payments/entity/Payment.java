package com.meddistributor.erp.payments.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.masterdata.entity.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "payment")
public class Payment extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @Column(nullable = false)
  private LocalDate paymentDate;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PaymentMethod method;

  @Column(length = 120)
  private String reference;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PaymentStatus status;

  @Column(columnDefinition = "text")
  private String notes;
}
