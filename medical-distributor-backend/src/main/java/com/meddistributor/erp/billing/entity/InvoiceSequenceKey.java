package com.meddistributor.erp.billing.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class InvoiceSequenceKey implements Serializable {
  private String branchCode;
  private String financialYear;
}
