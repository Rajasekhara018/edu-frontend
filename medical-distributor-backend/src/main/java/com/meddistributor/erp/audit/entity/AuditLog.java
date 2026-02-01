package com.meddistributor.erp.audit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "audit_log")
public class AuditLog {
  @Id
  @Column(columnDefinition = "uuid")
  private UUID id;

  @Column(nullable = false, length = 80)
  private String entityType;

  @Column(nullable = false, columnDefinition = "uuid")
  private UUID entityId;

  @Column(nullable = false, length = 80)
  private String action;

  @Column(columnDefinition = "jsonb")
  private String beforeData;

  @Column(columnDefinition = "jsonb")
  private String afterData;

  @Column(columnDefinition = "uuid")
  private UUID userId;

  @Column(length = 120)
  private String correlationId;

  @Column(nullable = false)
  private Instant createdAt;
}
