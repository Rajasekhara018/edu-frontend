package com.meddistributor.erp.orders.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dispatch")
public class Dispatch extends BaseEntity {
  @OneToOne(optional = false)
  @JoinColumn(name = "order_id")
  private SalesOrder order;

  @Column(length = 80)
  private String lrNo;

  @Column(length = 80)
  private String vehicleNo;

  @Column(length = 120)
  private String transporter;

  private LocalDate eta;

  private Instant dispatchedAt;

  private Instant deliveredAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private DispatchStatus status;
}
