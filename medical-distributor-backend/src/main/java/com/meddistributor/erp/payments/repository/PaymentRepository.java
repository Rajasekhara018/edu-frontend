package com.meddistributor.erp.payments.repository;

import com.meddistributor.erp.payments.entity.Payment;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
  @Query("select p from Payment p where (:customerId is null or p.customer.id = :customerId)")
  Page<Payment> search(@Param("customerId") UUID customerId, Pageable pageable);
}
