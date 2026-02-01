package com.meddistributor.erp.masterdata.entity;

import com.meddistributor.erp.auth.entity.User;
import com.meddistributor.erp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {
  @Column(nullable = false, length = 200)
  private String name;

  @Column(length = 30, unique = true)
  private String gstin;

  @Column(length = 50)
  private String licenseNo;

  @Column(columnDefinition = "text")
  private String billingAddress;

  @Column(columnDefinition = "text")
  private String shippingAddress;

  @Column(length = 120)
  private String contactName;

  @Column(length = 30)
  private String contactPhone;

  @Column(length = 160)
  private String email;

  @Column(length = 50)
  private String territory;

  @Column(nullable = false, precision = 14, scale = 2)
  private java.math.BigDecimal creditLimit;

  @Column(nullable = false)
  private int paymentTermsDays;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CustomerStatus status;

  @ManyToOne
  @JoinColumn(name = "account_manager_id")
  private User accountManager;
}
