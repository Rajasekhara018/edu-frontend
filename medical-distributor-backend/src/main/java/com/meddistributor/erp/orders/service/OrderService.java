package com.meddistributor.erp.orders.service;

import com.meddistributor.erp.audit.service.AuditService;
import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.common.util.SecurityUtil;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.entity.CustomerStatus;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import com.meddistributor.erp.orders.dto.SalesOrderLineRequest;
import com.meddistributor.erp.orders.dto.SalesOrderResponse;
import com.meddistributor.erp.orders.dto.SalesOrderRequest;
import com.meddistributor.erp.orders.dto.SalesOrderLineResponse;
import com.meddistributor.erp.orders.entity.AllocationStatus;
import com.meddistributor.erp.orders.entity.OrderStatus;
import com.meddistributor.erp.orders.entity.SalesOrder;
import com.meddistributor.erp.orders.entity.SalesOrderLine;
import com.meddistributor.erp.orders.repository.SalesOrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
  private final SalesOrderRepository orderRepository;
  private final CustomerRepository customerRepository;
  private final ProductRepository productRepository;
  private final AuditService auditService;

  public OrderService(SalesOrderRepository orderRepository,
                      CustomerRepository customerRepository,
                      ProductRepository productRepository,
                      AuditService auditService) {
    this.orderRepository = orderRepository;
    this.customerRepository = customerRepository;
    this.productRepository = productRepository;
    this.auditService = auditService;
  }

  @Transactional
  public SalesOrderResponse create(SalesOrderRequest request) {
    Customer customer = customerRepository.findById(request.getCustomerId())
        .orElseThrow(() -> new NotFoundException("Customer not found"));
    if (customer.getStatus() != CustomerStatus.ACTIVE) {
      throw new BusinessException("Customer is not active", HttpStatus.BAD_REQUEST);
    }
    if (SecurityUtil.hasRole("SALES_REP") && customer.getAccountManager() != null) {
      String username = SecurityUtil.currentUsername();
      if (username != null && !customer.getAccountManager().getUsername().equalsIgnoreCase(username)) {
        throw new BusinessException("Customer not assigned to sales rep", HttpStatus.FORBIDDEN);
      }
    }
    SalesOrder order = new SalesOrder();
    order.setOrderNo(generateOrderNo());
    order.setCustomer(customer);
    order.setOrderDate(request.getOrderDate() == null ? LocalDate.now() : request.getOrderDate());
    order.setBranchCode(request.getBranchCode());
    order.setStatus(OrderStatus.CONFIRMED);
    order.setAllocationStatus(AllocationStatus.NONE);
    order.setCreditChecked(false);
    applyLines(order, request.getLines());
    calculateTotals(order);
    return toResponse(orderRepository.save(order));
  }

  public PageResponse<SalesOrderResponse> list(UUID customerId, String status, Pageable pageable) {
    OrderStatus orderStatus = status == null ? null : OrderStatus.valueOf(status);
    Page<SalesOrder> page = orderRepository.search(customerId, orderStatus, pageable);
    return PageResponse.<SalesOrderResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public SalesOrderResponse get(UUID id) {
    return toResponse(orderRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Order not found")));
  }

  @Transactional
  public SalesOrderResponse update(UUID id, SalesOrderRequest request) {
    SalesOrder order = orderRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Order not found"));
    if (order.getStatus().ordinal() >= OrderStatus.INVOICED.ordinal()) {
      throw new BusinessException("Invoiced orders are immutable", HttpStatus.BAD_REQUEST);
    }
    OrderStatus prevStatus = order.getStatus();
    order.setOrderDate(request.getOrderDate() == null ? order.getOrderDate() : request.getOrderDate());
    order.setBranchCode(request.getBranchCode());
    applyLines(order, request.getLines());
    calculateTotals(order);
    SalesOrder saved = orderRepository.save(order);
    if (prevStatus.ordinal() >= OrderStatus.ALLOCATED.ordinal()) {
      auditService.logChange("SalesOrder", order.getId(), "ORDER_UPDATED", null, saved);
    }
    return toResponse(saved);
  }

  @Transactional
  public SalesOrderResponse updateStatus(UUID id, String status) {
    SalesOrder order = orderRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Order not found"));
    OrderStatus next = OrderStatus.valueOf(status);
    validateTransition(order.getStatus(), next);
    order.setStatus(next);
    return toResponse(orderRepository.save(order));
  }

  private void validateTransition(OrderStatus current, OrderStatus next) {
    if (next.ordinal() < current.ordinal()) {
      throw new BusinessException("Cannot move to previous status", HttpStatus.BAD_REQUEST);
    }
  }

  private void applyLines(SalesOrder order, List<SalesOrderLineRequest> lines) {
    order.getLines().clear();
    for (SalesOrderLineRequest lineRequest : lines) {
      Product product = productRepository.findById(lineRequest.getProductId())
          .orElseThrow(() -> new NotFoundException("Product not found"));
      SalesOrderLine line = new SalesOrderLine();
      line.setOrder(order);
      line.setProduct(product);
      line.setQuantity(lineRequest.getQuantity());
      line.setUnitPrice(lineRequest.getUnitPrice());
      line.setDiscount(lineRequest.getDiscount());
      line.setTaxRate(lineRequest.getTaxRate());
      line.setNetAmount(calculateLineNet(line));
      order.getLines().add(line);
    }
  }

  private BigDecimal calculateLineNet(SalesOrderLine line) {
    BigDecimal base = line.getUnitPrice().multiply(line.getQuantity());
    BigDecimal afterDiscount = base.subtract(line.getDiscount());
    BigDecimal tax = afterDiscount.multiply(line.getTaxRate()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    return afterDiscount.add(tax);
  }

  private void calculateTotals(SalesOrder order) {
    BigDecimal subtotal = order.getLines().stream()
        .map(line -> line.getUnitPrice().multiply(line.getQuantity()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal discount = order.getLines().stream()
        .map(SalesOrderLine::getDiscount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal taxTotal = order.getLines().stream()
        .map(line -> line.getNetAmount().subtract(line.getUnitPrice().multiply(line.getQuantity()).subtract(line.getDiscount())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal netTotal = order.getLines().stream()
        .map(SalesOrderLine::getNetAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    order.setSubtotal(subtotal);
    order.setDiscountTotal(discount);
    order.setTaxTotal(taxTotal);
    order.setNetTotal(netTotal);
  }

  private String generateOrderNo() {
    String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
    String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    return "ORD-" + datePart + "-" + random;
  }

  private SalesOrderResponse toResponse(SalesOrder order) {
    List<SalesOrderLineResponse> lines = order.getLines().stream().map(line -> SalesOrderLineResponse.builder()
        .id(line.getId())
        .productId(line.getProduct().getId())
        .productName(line.getProduct().getName())
        .quantity(line.getQuantity())
        .unitPrice(line.getUnitPrice())
        .discount(line.getDiscount())
        .taxRate(line.getTaxRate())
        .netAmount(line.getNetAmount())
        .build()).toList();
    return SalesOrderResponse.builder()
        .id(order.getId())
        .orderNo(order.getOrderNo())
        .customerId(order.getCustomer().getId())
        .customerName(order.getCustomer().getName())
        .status(order.getStatus().name())
        .allocationStatus(order.getAllocationStatus().name())
        .orderDate(order.getOrderDate())
        .branchCode(order.getBranchCode())
        .subtotal(order.getSubtotal())
        .discountTotal(order.getDiscountTotal())
        .taxTotal(order.getTaxTotal())
        .netTotal(order.getNetTotal())
        .lines(lines)
        .build();
  }
}
