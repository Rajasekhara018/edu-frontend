package com.meddistributor.erp.returns.controller;

import com.meddistributor.erp.returns.dto.CreditNoteResponse;
import com.meddistributor.erp.returns.dto.ReturnRequest;
import com.meddistributor.erp.returns.dto.ReturnResponse;
import com.meddistributor.erp.returns.service.ReturnService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReturnController {
  private final ReturnService returnService;

  public ReturnController(ReturnService returnService) {
    this.returnService = returnService;
  }

  @PostMapping("/returns")
  public ResponseEntity<ReturnResponse> create(@Valid @RequestBody ReturnRequest request) {
    return ResponseEntity.ok(returnService.create(request));
  }

  @GetMapping("/credit-notes/{id}")
  public ResponseEntity<CreditNoteResponse> getCreditNote(@PathVariable UUID id) {
    return ResponseEntity.ok(returnService.getCreditNote(id));
  }
}
