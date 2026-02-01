package com.meddistributor.erp.payments.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.payments.dto.PaymentAllocationRequest;
import com.meddistributor.erp.payments.dto.PaymentRequest;
import com.meddistributor.erp.payments.dto.PaymentResponse;
import com.meddistributor.erp.payments.service.PaymentService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {
  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('FINANCE')")
  public ResponseEntity<PaymentResponse> create(@Valid @RequestBody PaymentRequest request) {
    return ResponseEntity.ok(paymentService.create(request));
  }

  @GetMapping
  public ResponseEntity<PageResponse<PaymentResponse>> list(
      @RequestParam(value = "customerId", required = false) UUID customerId,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(paymentService.list(customerId, pageable));
  }

  @PostMapping("/allocate")
  @PreAuthorize("hasAnyRole('FINANCE')")
  public ResponseEntity<PaymentResponse> allocate(@Valid @RequestBody PaymentAllocationRequest request) {
    return ResponseEntity.ok(paymentService.allocate(request));
  }
}
