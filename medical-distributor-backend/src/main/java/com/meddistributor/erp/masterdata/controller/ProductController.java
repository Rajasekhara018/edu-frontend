package com.meddistributor.erp.masterdata.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.masterdata.dto.ProductRequest;
import com.meddistributor.erp.masterdata.dto.ProductResponse;
import com.meddistributor.erp.masterdata.service.ProductService;
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
@RequestMapping("/products")
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @PostMapping
  public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
    return ResponseEntity.ok(productService.create(request));
  }

  @GetMapping
  public ResponseEntity<PageResponse<ProductResponse>> list(
      @RequestParam(value = "search", required = false) String search,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(productService.list(search, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(productService.get(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductResponse> update(@PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
    return ResponseEntity.ok(productService.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    productService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
