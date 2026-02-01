package com.meddistributor.erp.returns.repository;

import com.meddistributor.erp.returns.entity.ReturnOrder;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnOrderRepository extends JpaRepository<ReturnOrder, UUID> {
}
