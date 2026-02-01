package com.meddistributor.erp.orders.repository;

import com.meddistributor.erp.orders.entity.OrderStatus;
import com.meddistributor.erp.orders.entity.SalesOrder;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, UUID> {
  Optional<SalesOrder> findByOrderNo(String orderNo);

  @Query("select o from SalesOrder o where (:customerId is null or o.customer.id = :customerId) and (:status is null or o.status = :status)")
  Page<SalesOrder> search(@Param("customerId") UUID customerId, @Param("status") OrderStatus status, Pageable pageable);
}
