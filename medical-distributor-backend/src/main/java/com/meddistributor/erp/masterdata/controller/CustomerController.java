package com.meddistributor.erp.masterdata.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.masterdata.dto.CustomerCreditRequest;
import com.meddistributor.erp.masterdata.dto.CustomerRequest;
import com.meddistributor.erp.masterdata.dto.CustomerResponse;
import com.meddistributor.erp.masterdata.service.CustomerService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customers")
public class CustomerController {
  private final CustomerService customerService;

  public CustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @PostMapping
  public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
    return ResponseEntity.ok(customerService.create(request));
  }

  @GetMapping
  public ResponseEntity<PageResponse<CustomerResponse>> list(
      @RequestParam(value = "search", required = false) String search,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(customerService.list(search, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CustomerResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(customerService.get(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<CustomerResponse> update(@PathVariable UUID id, @Valid @RequestBody CustomerRequest request) {
    return ResponseEntity.ok(customerService.update(id, request));
  }

  @PatchMapping("/{id}/credit")
  public ResponseEntity<CustomerResponse> updateCredit(
      @PathVariable UUID id, @Valid @RequestBody CustomerCreditRequest request) {
    return ResponseEntity.ok(customerService.updateCredit(id, request.getCreditLimit(), request.getPaymentTermsDays()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    customerService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
