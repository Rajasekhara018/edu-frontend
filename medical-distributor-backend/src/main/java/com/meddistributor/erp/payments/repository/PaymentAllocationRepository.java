package com.meddistributor.erp.payments.repository;

import com.meddistributor.erp.payments.entity.PaymentAllocation;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentAllocationRepository extends JpaRepository<PaymentAllocation, UUID> {
  List<PaymentAllocation> findByPaymentId(UUID paymentId);
}
