package com.meddistributor.erp.masterdata.repository;

import com.meddistributor.erp.masterdata.entity.Customer;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
  @Query("select c from Customer c where (:search is null or lower(c.name) like lower(concat('%', :search, '%'))) ")
  Page<Customer> search(@Param("search") String search, Pageable pageable);

  @Query("select c from Customer c where c.accountManager.username = :username")
  Page<Customer> findByAccountManager(@Param("username") String username, Pageable pageable);
}
