package com.meddistributor.erp.returns.repository;

import com.meddistributor.erp.returns.entity.CreditNoteLine;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditNoteLineRepository extends JpaRepository<CreditNoteLine, UUID> {
  List<CreditNoteLine> findByCreditNoteId(UUID creditNoteId);
}
