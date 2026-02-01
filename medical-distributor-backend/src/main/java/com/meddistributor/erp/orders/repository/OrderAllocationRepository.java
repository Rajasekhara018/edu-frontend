package com.meddistributor.erp.orders.repository;

import com.meddistributor.erp.orders.entity.OrderAllocation;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderAllocationRepository extends JpaRepository<OrderAllocation, UUID> {
  List<OrderAllocation> findByOrderLineId(UUID orderLineId);

  List<OrderAllocation> findByOrderLineOrderId(UUID orderId);
}
