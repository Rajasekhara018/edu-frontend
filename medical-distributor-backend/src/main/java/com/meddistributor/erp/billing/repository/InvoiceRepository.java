package com.meddistributor.erp.billing.repository;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceStatus;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
  Optional<Invoice> findByOrderId(UUID orderId);

  java.util.List<Invoice> findByStatus(InvoiceStatus status);

  @Query("select coalesce(sum(i.outstandingAmount),0) from Invoice i where i.customer.id = :customerId and i.status = com.meddistributor.erp.billing.entity.InvoiceStatus.OPEN")
  Optional<BigDecimal> sumOutstandingByCustomer(@Param("customerId") UUID customerId);

  @Query("select i from Invoice i where (:customerId is null or i.customer.id = :customerId) and (:status is null or i.status = :status)")
  Page<Invoice> search(@Param("customerId") UUID customerId, @Param("status") InvoiceStatus status, Pageable pageable);

  @Query("select i from Invoice i where (:from is null or i.invoiceDate >= :from) and (:to is null or i.invoiceDate <= :to)")
  Page<Invoice> findByDateRange(@Param("from") java.time.LocalDate from, @Param("to") java.time.LocalDate to, Pageable pageable);
}
