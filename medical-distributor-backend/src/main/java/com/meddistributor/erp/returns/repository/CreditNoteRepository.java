package com.meddistributor.erp.returns.repository;

import com.meddistributor.erp.returns.entity.CreditNote;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditNoteRepository extends JpaRepository<CreditNote, UUID> {
}
