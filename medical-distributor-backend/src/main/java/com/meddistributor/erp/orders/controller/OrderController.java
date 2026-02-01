package com.meddistributor.erp.orders.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.orders.dto.AllocationResponse;
import com.meddistributor.erp.orders.dto.DispatchRequest;
import com.meddistributor.erp.orders.dto.DispatchResponse;
import com.meddistributor.erp.orders.dto.OrderStatusRequest;
import com.meddistributor.erp.orders.dto.SalesOrderRequest;
import com.meddistributor.erp.orders.dto.SalesOrderResponse;
import com.meddistributor.erp.orders.service.AllocationService;
import com.meddistributor.erp.orders.service.DispatchService;
import com.meddistributor.erp.orders.service.OrderService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {
  private final OrderService orderService;
  private final AllocationService allocationService;
  private final DispatchService dispatchService;

  public OrderController(OrderService orderService, AllocationService allocationService, DispatchService dispatchService) {
    this.orderService = orderService;
    this.allocationService = allocationService;
    this.dispatchService = dispatchService;
  }

  @PostMapping
  public ResponseEntity<SalesOrderResponse> create(@Valid @RequestBody SalesOrderRequest request) {
    return ResponseEntity.ok(orderService.create(request));
  }

  @GetMapping
  public ResponseEntity<PageResponse<SalesOrderResponse>> list(
      @RequestParam(value = "customerId", required = false) UUID customerId,
      @RequestParam(value = "status", required = false) String status,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(orderService.list(customerId, status, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<SalesOrderResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(orderService.get(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<SalesOrderResponse> update(@PathVariable UUID id, @Valid @RequestBody SalesOrderRequest request) {
    return ResponseEntity.ok(orderService.update(id, request));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<SalesOrderResponse> updateStatus(
      @PathVariable UUID id, @Valid @RequestBody OrderStatusRequest request) {
    return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
  }

  @PostMapping("/{id}/allocate")
  public ResponseEntity<AllocationResponse> allocate(@PathVariable UUID id) {
    return ResponseEntity.ok(allocationService.allocate(id));
  }

  @PutMapping("/{id}/dispatch")
  public ResponseEntity<DispatchResponse> updateDispatch(
      @PathVariable UUID id, @Valid @RequestBody DispatchRequest request) {
    return ResponseEntity.ok(dispatchService.update(id, request));
  }
}
