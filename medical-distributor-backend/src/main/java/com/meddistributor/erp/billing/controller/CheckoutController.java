package com.meddistributor.erp.billing.controller;

import com.meddistributor.erp.billing.dto.InvoiceResponse;
import com.meddistributor.erp.billing.service.CheckoutService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
  private final CheckoutService checkoutService;

  public CheckoutController(CheckoutService checkoutService) {
    this.checkoutService = checkoutService;
  }

  @PostMapping("/{orderId}/invoice")
  @PreAuthorize(\"hasAnyRole('WAREHOUSE','FINANCE')\")
  public ResponseEntity<InvoiceResponse> checkout(@PathVariable UUID orderId) {
    return ResponseEntity.ok(checkoutService.checkout(orderId));
  }
}
