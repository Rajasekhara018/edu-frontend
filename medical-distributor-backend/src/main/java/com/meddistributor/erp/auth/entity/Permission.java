package com.meddistributor.erp.auth.entity;

import com.meddistributor.erp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity {
  @Column(nullable = false, unique = true, length = 120)
  private String code;

  @Column(length = 200)
  private String description;
}
