package com.meddistributor.erp.billing.repository;

import com.meddistributor.erp.billing.entity.InvoiceLine;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceLineRepository extends JpaRepository<InvoiceLine, UUID> {
  List<InvoiceLine> findByInvoiceId(UUID invoiceId);
}
