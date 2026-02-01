package com.meddistributor.erp.orders.entity;

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
@Table(name = "sales_order")
public class SalesOrder extends BaseEntity {
  @Column(nullable = false, unique = true, length = 40)
  private String orderNo;

  @ManyToOne(optional = false)
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private OrderStatus status;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AllocationStatus allocationStatus;

  @Column(nullable = false)
  private LocalDate orderDate;

  @Column(length = 30)
  private String branchCode;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal subtotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal discountTotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal taxTotal;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal netTotal;

  @Column(nullable = false)
  private boolean creditChecked;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<SalesOrderLine> lines = new ArrayList<>();
}
