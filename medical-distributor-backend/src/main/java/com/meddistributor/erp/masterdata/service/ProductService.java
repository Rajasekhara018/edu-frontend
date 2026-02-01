package com.meddistributor.erp.masterdata.service;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.masterdata.dto.ProductRequest;
import com.meddistributor.erp.masterdata.dto.ProductResponse;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Transactional
  public ProductResponse create(ProductRequest request) {
    Product product = new Product();
    applyRequest(product, request);
    return toResponse(productRepository.save(product));
  }

  public PageResponse<ProductResponse> list(String search, Pageable pageable) {
    Page<Product> page = productRepository.search(search, pageable);
    return PageResponse.<ProductResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public ProductResponse get(UUID id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Product not found"));
    return toResponse(product);
  }

  @Transactional
  public ProductResponse update(UUID id, ProductRequest request) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Product not found"));
    applyRequest(product, request);
    return toResponse(productRepository.save(product));
  }

  @Transactional
  public void delete(UUID id) {
    productRepository.deleteById(id);
  }

  private void applyRequest(Product product, ProductRequest request) {
    product.setSku(request.getSku());
    product.setName(request.getName());
    product.setHsn(request.getHsn());
    product.setGstRate(request.getGstRate());
    product.setManufacturer(request.getManufacturer());
    product.setCategory(request.getCategory());
  }

  private ProductResponse toResponse(Product product) {
    return ProductResponse.builder()
        .id(product.getId())
        .sku(product.getSku())
        .name(product.getName())
        .hsn(product.getHsn())
        .gstRate(product.getGstRate())
        .manufacturer(product.getManufacturer())
        .category(product.getCategory())
        .build();
  }
}
