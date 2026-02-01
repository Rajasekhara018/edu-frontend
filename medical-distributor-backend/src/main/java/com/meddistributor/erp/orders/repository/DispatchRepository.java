package com.meddistributor.erp.orders.repository;

import com.meddistributor.erp.orders.entity.Dispatch;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DispatchRepository extends JpaRepository<Dispatch, UUID> {
  Optional<Dispatch> findByOrderId(UUID orderId);
}
