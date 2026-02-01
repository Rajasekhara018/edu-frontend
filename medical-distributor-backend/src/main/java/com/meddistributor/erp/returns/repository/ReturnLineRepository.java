package com.meddistributor.erp.returns.repository;

import com.meddistributor.erp.returns.entity.ReturnLine;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnLineRepository extends JpaRepository<ReturnLine, UUID> {
  List<ReturnLine> findByReturnOrderId(UUID returnId);

  @org.springframework.data.jpa.repository.Query(\"select coalesce(sum(r.quantity),0) from ReturnLine r where r.invoiceLine.id = :invoiceLineId\")\n  java.math.BigDecimal sumReturnedByInvoiceLine(@org.springframework.data.repository.query.Param(\"invoiceLineId\") UUID invoiceLineId);
}
