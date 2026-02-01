package com.meddistributor.erp.inventory.repository;

import com.meddistributor.erp.inventory.entity.InventoryBatch;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, UUID> {
  @Query("select b from InventoryBatch b where b.product.id = :productId and b.expiryDate >= :today and b.qtyAvailable > 0 order by b.expiryDate asc")
  List<InventoryBatch> findAvailableForAllocation(@Param("productId") UUID productId, @Param("today") LocalDate today);

  @Query("select b from InventoryBatch b where b.expiryDate <= :threshold and b.qtyAvailable > 0")
  Page<InventoryBatch> findNearExpiry(@Param("threshold") LocalDate threshold, Pageable pageable);

  @Query("select b from InventoryBatch b where (:productId is null or b.product.id = :productId)")
  Page<InventoryBatch> search(@Param("productId") UUID productId, Pageable pageable);
}
