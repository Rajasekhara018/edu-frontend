package com.meddistributor.erp.payments.service;

import com.meddistributor.erp.audit.service.AuditService;
import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceStatus;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import com.meddistributor.erp.payments.dto.PaymentAllocationItem;
import com.meddistributor.erp.payments.dto.PaymentAllocationRequest;
import com.meddistributor.erp.payments.dto.PaymentRequest;
import com.meddistributor.erp.payments.dto.PaymentResponse;
import com.meddistributor.erp.payments.entity.Payment;
import com.meddistributor.erp.payments.entity.PaymentAllocation;
import com.meddistributor.erp.payments.entity.PaymentMethod;
import com.meddistributor.erp.payments.entity.PaymentStatus;
import com.meddistributor.erp.payments.repository.PaymentAllocationRepository;
import com.meddistributor.erp.payments.repository.PaymentRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {
  private final PaymentRepository paymentRepository;
  private final PaymentAllocationRepository allocationRepository;
  private final CustomerRepository customerRepository;
  private final InvoiceRepository invoiceRepository;
  private final AuditService auditService;

  public PaymentService(PaymentRepository paymentRepository,
                        PaymentAllocationRepository allocationRepository,
                        CustomerRepository customerRepository,
                        InvoiceRepository invoiceRepository,
                        AuditService auditService) {
    this.paymentRepository = paymentRepository;
    this.allocationRepository = allocationRepository;
    this.customerRepository = customerRepository;
    this.invoiceRepository = invoiceRepository;
    this.auditService = auditService;
  }

  @Transactional
  public PaymentResponse create(PaymentRequest request) {
    Customer customer = customerRepository.findById(request.getCustomerId())
        .orElseThrow(() -> new NotFoundException("Customer not found"));
    Payment payment = new Payment();
    payment.setCustomer(customer);
    payment.setPaymentDate(request.getPaymentDate() == null ? LocalDate.now() : request.getPaymentDate());
    payment.setAmount(request.getAmount());
    payment.setMethod(PaymentMethod.valueOf(request.getMethod()));
    payment.setReference(request.getReference());
    payment.setStatus(PaymentStatus.RECEIVED);
    payment.setNotes(request.getNotes());
    return toResponse(paymentRepository.save(payment));
  }

  public PageResponse<PaymentResponse> list(UUID customerId, Pageable pageable) {
    Page<Payment> page = paymentRepository.search(customerId, pageable);
    return PageResponse.<PaymentResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  @Transactional
  public PaymentResponse allocate(PaymentAllocationRequest request) {
    Payment payment = paymentRepository.findById(request.getPaymentId())
        .orElseThrow(() -> new NotFoundException("Payment not found"));
    BigDecimal allocatedTotal = BigDecimal.ZERO;
    for (PaymentAllocationItem item : request.getAllocations()) {
      Invoice invoice = invoiceRepository.findById(item.getInvoiceId())
          .orElseThrow(() -> new NotFoundException("Invoice not found"));
      if (!invoice.getCustomer().getId().equals(payment.getCustomer().getId())) {
        throw new BusinessException("Invoice customer mismatch", HttpStatus.BAD_REQUEST);
      }
      BigDecimal amount = item.getAmount();
      if (amount.compareTo(BigDecimal.ZERO) <= 0) {
        continue;
      }
      if (amount.compareTo(invoice.getOutstandingAmount()) > 0) {
        throw new BusinessException("Allocation exceeds invoice outstanding", HttpStatus.BAD_REQUEST);
      }
      PaymentAllocation allocation = new PaymentAllocation();
      allocation.setPayment(payment);
      allocation.setInvoice(invoice);
      allocation.setAmount(amount);
      allocationRepository.save(allocation);

      invoice.setPaidAmount(invoice.getPaidAmount().add(amount));
      invoice.setOutstandingAmount(invoice.getOutstandingAmount().subtract(amount));
      if (invoice.getOutstandingAmount().compareTo(BigDecimal.ZERO) == 0) {
        invoice.setStatus(InvoiceStatus.PAID);
      }
      invoiceRepository.save(invoice);
      auditService.logChange("Invoice", invoice.getId(), "PAYMENT_ALLOCATED", null, invoice);
      allocatedTotal = allocatedTotal.add(amount);
    }
    if (allocatedTotal.compareTo(payment.getAmount()) > 0) {
      throw new BusinessException("Allocated amount exceeds payment", HttpStatus.BAD_REQUEST);
    }
    if (allocatedTotal.compareTo(payment.getAmount()) == 0) {
      payment.setStatus(PaymentStatus.ALLOCATED);
    } else if (allocatedTotal.compareTo(BigDecimal.ZERO) > 0) {
      payment.setStatus(PaymentStatus.PARTIALLY_ALLOCATED);
    }
    paymentRepository.save(payment);
    auditService.logChange("Payment", payment.getId(), "ALLOCATED", null, payment);
    return toResponse(payment);
  }

  private PaymentResponse toResponse(Payment payment) {
    return PaymentResponse.builder()
        .id(payment.getId())
        .customerId(payment.getCustomer().getId())
        .customerName(payment.getCustomer().getName())
        .paymentDate(payment.getPaymentDate())
        .amount(payment.getAmount())
        .method(payment.getMethod().name())
        .reference(payment.getReference())
        .status(payment.getStatus().name())
        .notes(payment.getNotes())
        .build();
  }
}
