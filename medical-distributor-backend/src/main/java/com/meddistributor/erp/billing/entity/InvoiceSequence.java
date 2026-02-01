package com.meddistributor.erp.billing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "invoice_sequence")
public class InvoiceSequence {
  @EmbeddedId
  private InvoiceSequenceKey id;

  @Column(nullable = false)
  private long nextSeq;
}
