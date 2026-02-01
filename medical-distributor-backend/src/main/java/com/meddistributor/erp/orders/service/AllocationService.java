package com.meddistributor.erp.orders.service;

import com.meddistributor.erp.audit.service.AuditService;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.inventory.service.InventoryBatchService;
import com.meddistributor.erp.orders.dto.AllocationResponse;
import com.meddistributor.erp.orders.dto.OrderAllocationLineResponse;
import com.meddistributor.erp.orders.entity.AllocationStatus;
import com.meddistributor.erp.orders.entity.OrderAllocation;
import com.meddistributor.erp.orders.entity.OrderStatus;
import com.meddistributor.erp.orders.entity.SalesOrder;
import com.meddistributor.erp.orders.entity.SalesOrderLine;
import com.meddistributor.erp.orders.repository.OrderAllocationRepository;
import com.meddistributor.erp.orders.repository.SalesOrderRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AllocationService {
  private final SalesOrderRepository orderRepository;
  private final OrderAllocationRepository allocationRepository;
  private final InventoryBatchRepository batchRepository;
  private final InventoryBatchService batchService;
  private final AuditService auditService;

  public AllocationService(SalesOrderRepository orderRepository,
                           OrderAllocationRepository allocationRepository,
                           InventoryBatchRepository batchRepository,
                           InventoryBatchService batchService,
                           AuditService auditService) {
    this.orderRepository = orderRepository;
    this.allocationRepository = allocationRepository;
    this.batchRepository = batchRepository;
    this.batchService = batchService;
    this.auditService = auditService;
  }

  @Transactional
  public AllocationResponse allocate(UUID orderId) {
    SalesOrder order = orderRepository.findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found"));
    if (order.getStatus() != OrderStatus.CONFIRMED && order.getStatus() != OrderStatus.ALLOCATED) {
      throw new BusinessException("Order not eligible for allocation", HttpStatus.BAD_REQUEST);
    }
    List<OrderAllocation> existingAllocations = allocationRepository.findByOrderLineOrderId(orderId);
    for (OrderAllocation allocation : existingAllocations) {
      batchService.releaseReserved(allocation.getBatch(), allocation.getQtyAllocated());
      allocationRepository.delete(allocation);
    }
    List<OrderAllocationLineResponse> allocations = new ArrayList<>();
    boolean allFulfilled = true;

    for (SalesOrderLine line : order.getLines()) {
      BigDecimal remaining = line.getQuantity();
      List<InventoryBatch> batches = batchRepository.findAvailableForAllocation(line.getProduct().getId(), LocalDate.now());
      for (InventoryBatch batch : batches) {
        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
          break;
        }
        BigDecimal allocQty = remaining.min(batch.getQtyAvailable());
        if (allocQty.compareTo(BigDecimal.ZERO) <= 0) {
          continue;
        }
        batchService.reserveStock(batch, allocQty);
        auditService.logChange("InventoryBatch", batch.getId(), "RESERVE", null, batch);
        OrderAllocation allocation = new OrderAllocation();
        allocation.setOrderLine(line);
        allocation.setBatch(batch);
        allocation.setQtyAllocated(allocQty);
        allocationRepository.save(allocation);
        allocations.add(OrderAllocationLineResponse.builder()
            .orderLineId(line.getId())
            .batchId(batch.getId())
            .batchNo(batch.getBatchNo())
            .qtyAllocated(allocQty)
            .build());
        remaining = remaining.subtract(allocQty);
      }
      if (remaining.compareTo(BigDecimal.ZERO) > 0) {
        allFulfilled = false;
      }
    }
    order.setAllocationStatus(allFulfilled ? AllocationStatus.FULL : AllocationStatus.PARTIAL);
    order.setStatus(OrderStatus.ALLOCATED);
    orderRepository.save(order);
    return AllocationResponse.builder()
        .orderId(order.getId())
        .allocationStatus(order.getAllocationStatus().name())
        .allocations(allocations)
        .build();
  }
}
