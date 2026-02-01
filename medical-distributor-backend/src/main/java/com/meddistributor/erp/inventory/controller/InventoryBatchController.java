package com.meddistributor.erp.inventory.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.inventory.dto.InventoryBatchRequest;
import com.meddistributor.erp.inventory.dto.InventoryBatchResponse;
import com.meddistributor.erp.inventory.service.InventoryBatchService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory/batches")
public class InventoryBatchController {
  private final InventoryBatchService batchService;

  public InventoryBatchController(InventoryBatchService batchService) {
    this.batchService = batchService;
  }

  @PostMapping
  public ResponseEntity<InventoryBatchResponse> create(@Valid @RequestBody InventoryBatchRequest request) {
    return ResponseEntity.ok(batchService.create(request));
  }

  @GetMapping
  public ResponseEntity<PageResponse<InventoryBatchResponse>> list(
      @RequestParam(value = "productId", required = false) UUID productId,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(batchService.list(productId, pageable));
  }

  @GetMapping("/near-expiry")
  public ResponseEntity<PageResponse<InventoryBatchResponse>> nearExpiry(
      @RequestParam(value = "days", defaultValue = "60") int days,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(batchService.nearExpiry(days, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<InventoryBatchResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(batchService.get(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<InventoryBatchResponse> update(
      @PathVariable UUID id, @Valid @RequestBody InventoryBatchRequest request) {
    return ResponseEntity.ok(batchService.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    batchService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
