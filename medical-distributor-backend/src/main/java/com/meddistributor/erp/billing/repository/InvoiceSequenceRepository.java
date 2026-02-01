package com.meddistributor.erp.billing.repository;

import com.meddistributor.erp.billing.entity.InvoiceSequence;
import com.meddistributor.erp.billing.entity.InvoiceSequenceKey;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence, InvoiceSequenceKey> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from InvoiceSequence s where s.id.branchCode = :branchCode and s.id.financialYear = :financialYear")
  Optional<InvoiceSequence> lockForUpdate(@Param("branchCode") String branchCode, @Param("financialYear") String financialYear);
}
