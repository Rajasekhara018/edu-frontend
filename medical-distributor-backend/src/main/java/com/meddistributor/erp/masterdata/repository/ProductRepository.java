package com.meddistributor.erp.masterdata.repository;

import com.meddistributor.erp.masterdata.entity.Product;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, UUID> {
  @Query("select p from Product p where (:search is null or lower(p.name) like lower(concat('%', :search, '%')) or lower(p.sku) like lower(concat('%', :search, '%')))")
  Page<Product> search(@Param("search") String search, Pageable pageable);
}
