package com.meddistributor.erp.inventory.service;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.inventory.dto.InventoryBatchRequest;
import com.meddistributor.erp.inventory.dto.InventoryBatchResponse;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryBatchService {
  private final InventoryBatchRepository batchRepository;
  private final ProductRepository productRepository;

  public InventoryBatchService(InventoryBatchRepository batchRepository, ProductRepository productRepository) {
    this.batchRepository = batchRepository;
    this.productRepository = productRepository;
  }

  @Transactional
  public InventoryBatchResponse create(InventoryBatchRequest request) {
    InventoryBatch batch = new InventoryBatch();
    applyRequest(batch, request);
    return toResponse(batchRepository.save(batch));
  }

  public PageResponse<InventoryBatchResponse> list(UUID productId, Pageable pageable) {
    Page<InventoryBatch> page = batchRepository.search(productId, pageable);
    return PageResponse.<InventoryBatchResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public PageResponse<InventoryBatchResponse> nearExpiry(int days, Pageable pageable) {
    LocalDate threshold = LocalDate.now().plusDays(days);
    Page<InventoryBatch> page = batchRepository.findNearExpiry(threshold, pageable);
    return PageResponse.<InventoryBatchResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public InventoryBatchResponse get(UUID id) {
    return toResponse(batchRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Batch not found")));
  }

  @Transactional
  public InventoryBatchResponse update(UUID id, InventoryBatchRequest request) {
    InventoryBatch batch = batchRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Batch not found"));
    applyRequest(batch, request);
    return toResponse(batchRepository.save(batch));
  }

  @Transactional
  public void delete(UUID id) {
    batchRepository.deleteById(id);
  }

  @Transactional
  public void reserveStock(InventoryBatch batch, BigDecimal qty) {
    batch.setQtyAvailable(batch.getQtyAvailable().subtract(qty));
    batch.setQtyReserved(batch.getQtyReserved().add(qty));
    batchRepository.save(batch);
  }

  @Transactional
  public void consumeReserved(InventoryBatch batch, BigDecimal qty) {
    batch.setQtyReserved(batch.getQtyReserved().subtract(qty));
    batchRepository.save(batch);
  }

  @Transactional
  public void releaseReserved(InventoryBatch batch, BigDecimal qty) {
    batch.setQtyReserved(batch.getQtyReserved().subtract(qty));
    batch.setQtyAvailable(batch.getQtyAvailable().add(qty));
    batchRepository.save(batch);
  }

  @Transactional
  public void addSaleableReturn(InventoryBatch batch, BigDecimal qty) {
    batch.setQtyAvailable(batch.getQtyAvailable().add(qty));
    batchRepository.save(batch);
  }

  @Transactional
  public void addNonSaleableReturn(InventoryBatch batch, BigDecimal qty) {
    batch.setQtyQuarantine(batch.getQtyQuarantine().add(qty));
    batchRepository.save(batch);
  }

  private void applyRequest(InventoryBatch batch, InventoryBatchRequest request) {
    Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> new NotFoundException("Product not found"));
    batch.setProduct(product);
    batch.setBatchNo(request.getBatchNo());
    batch.setExpiryDate(request.getExpiryDate());
    batch.setMrp(request.getMrp());
    batch.setPurchaseRate(request.getPurchaseRate());
    batch.setQtyAvailable(request.getQtyAvailable());
    batch.setQtyReserved(request.getQtyReserved() == null ? BigDecimal.ZERO : request.getQtyReserved());
    batch.setQtyQuarantine(request.getQtyQuarantine() == null ? BigDecimal.ZERO : request.getQtyQuarantine());
    batch.setBranchCode(request.getBranchCode());
  }

  private InventoryBatchResponse toResponse(InventoryBatch batch) {
    return InventoryBatchResponse.builder()
        .id(batch.getId())
        .productId(batch.getProduct().getId())
        .productName(batch.getProduct().getName())
        .batchNo(batch.getBatchNo())
        .expiryDate(batch.getExpiryDate())
        .mrp(batch.getMrp())
        .purchaseRate(batch.getPurchaseRate())
        .qtyAvailable(batch.getQtyAvailable())
        .qtyReserved(batch.getQtyReserved())
        .qtyQuarantine(batch.getQtyQuarantine())
        .branchCode(batch.getBranchCode())
        .build();
  }
}
