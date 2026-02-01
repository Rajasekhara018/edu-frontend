package com.meddistributor.erp.billing.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.orders.entity.SalesOrder;
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
@Table(name = "invoice")
public class Invoice extends BaseEntity {
  @Column(nullable = false, unique = true, length = 50)
  private String invoiceNo;

  @ManyToOne(optional = false)
  @JoinColumn(name = "order_id")
  private SalesOrder order;

  @ManyToOne(optional = false)
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @Column(nullable = false)
  private LocalDate invoiceDate;

  @Column(length = 30)
  private String branchCode;

  @Column(nullable = false, length = 20)
  private String financialYear;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal subtotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal discountTotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal taxTotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal netTotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal paidAmount;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal outstandingAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private InvoiceStatus status;

  @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<InvoiceLine> lines = new ArrayList<>();
}
