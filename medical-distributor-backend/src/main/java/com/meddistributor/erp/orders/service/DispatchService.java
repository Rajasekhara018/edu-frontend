package com.meddistributor.erp.orders.service;

import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.orders.dto.DispatchRequest;
import com.meddistributor.erp.orders.dto.DispatchResponse;
import com.meddistributor.erp.orders.entity.Dispatch;
import com.meddistributor.erp.orders.entity.DispatchStatus;
import com.meddistributor.erp.orders.entity.OrderStatus;
import com.meddistributor.erp.orders.entity.SalesOrder;
import com.meddistributor.erp.orders.repository.DispatchRepository;
import com.meddistributor.erp.orders.repository.SalesOrderRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DispatchService {
  private final DispatchRepository dispatchRepository;
  private final SalesOrderRepository orderRepository;

  public DispatchService(DispatchRepository dispatchRepository, SalesOrderRepository orderRepository) {
    this.dispatchRepository = dispatchRepository;
    this.orderRepository = orderRepository;
  }

  @Transactional
  public DispatchResponse update(UUID orderId, DispatchRequest request) {
    SalesOrder order = orderRepository.findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found"));
    Dispatch dispatch = dispatchRepository.findByOrderId(orderId).orElse(new Dispatch());
    dispatch.setOrder(order);
    dispatch.setLrNo(request.getLrNo());
    dispatch.setVehicleNo(request.getVehicleNo());
    dispatch.setTransporter(request.getTransporter());
    dispatch.setEta(request.getEta());
    DispatchStatus status = DispatchStatus.valueOf(request.getStatus());
    dispatch.setStatus(status);
    if (status == DispatchStatus.DISPATCHED && dispatch.getDispatchedAt() == null) {
      dispatch.setDispatchedAt(Instant.now());
      order.setStatus(OrderStatus.DISPATCHED);
    }
    if (status == DispatchStatus.DELIVERED && dispatch.getDeliveredAt() == null) {
      dispatch.setDeliveredAt(Instant.now());
      order.setStatus(OrderStatus.DELIVERED);
    }
    if (status == DispatchStatus.PACKED) {
      order.setStatus(OrderStatus.PACKED);
    }
    orderRepository.save(order);
    Dispatch saved = dispatchRepository.save(dispatch);
    return DispatchResponse.builder()
        .id(saved.getId())
        .orderId(orderId)
        .lrNo(saved.getLrNo())
        .vehicleNo(saved.getVehicleNo())
        .transporter(saved.getTransporter())
        .eta(saved.getEta())
        .dispatchedAt(saved.getDispatchedAt())
        .deliveredAt(saved.getDeliveredAt())
        .status(saved.getStatus().name())
        .build();
  }
}
