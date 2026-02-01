package com.meddistributor.erp.masterdata.service;

import com.meddistributor.erp.auth.entity.User;
import com.meddistributor.erp.auth.repository.UserRepository;
import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.common.exception.NotFoundException;
import com.meddistributor.erp.common.util.SecurityUtil;
import com.meddistributor.erp.masterdata.dto.CustomerRequest;
import com.meddistributor.erp.masterdata.dto.CustomerResponse;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.entity.CustomerStatus;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {
  private final CustomerRepository customerRepository;
  private final UserRepository userRepository;
  private final InvoiceRepository invoiceRepository;

  public CustomerService(CustomerRepository customerRepository,
                         UserRepository userRepository,
                         InvoiceRepository invoiceRepository) {
    this.customerRepository = customerRepository;
    this.userRepository = userRepository;
    this.invoiceRepository = invoiceRepository;
  }

  @Transactional
  public CustomerResponse create(CustomerRequest request) {
    Customer customer = new Customer();
    applyRequest(customer, request);
    return toResponse(customerRepository.save(customer));
  }

  public PageResponse<CustomerResponse> list(String search, Pageable pageable) {
    Page<Customer> page;
    if (SecurityUtil.hasRole("SALES_REP")) {
      String username = SecurityUtil.currentUsername();
      page = customerRepository.findByAccountManager(username, pageable);
    } else {
      page = customerRepository.search(search, pageable);
    }
    return PageResponse.<CustomerResponse>builder()
        .data(page.map(this::toResponse).toList())
        .page(pageable.getPageNumber())
        .size(pageable.getPageSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .build();
  }

  public CustomerResponse get(UUID id) {
    Customer customer = customerRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Customer not found"));
    return toResponse(customer);
  }

  @Transactional
  public CustomerResponse update(UUID id, CustomerRequest request) {
    Customer customer = customerRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Customer not found"));
    applyRequest(customer, request);
    return toResponse(customerRepository.save(customer));
  }

  @Transactional
  public void delete(UUID id) {
    customerRepository.deleteById(id);
  }

  @Transactional
  public CustomerResponse updateCredit(UUID id, java.math.BigDecimal creditLimit, int paymentTermsDays) {
    Customer customer = customerRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Customer not found"));
    customer.setCreditLimit(creditLimit);
    customer.setPaymentTermsDays(paymentTermsDays);
    return toResponse(customerRepository.save(customer));
  }

  private void applyRequest(Customer customer, CustomerRequest request) {
    customer.setName(request.getName());
    customer.setGstin(request.getGstin());
    customer.setLicenseNo(request.getLicenseNo());
    customer.setBillingAddress(request.getBillingAddress());
    customer.setShippingAddress(request.getShippingAddress());
    customer.setContactName(request.getContactName());
    customer.setContactPhone(request.getContactPhone());
    customer.setEmail(request.getEmail());
    customer.setTerritory(request.getTerritory());
    customer.setCreditLimit(request.getCreditLimit());
    customer.setPaymentTermsDays(request.getPaymentTermsDays());
    customer.setStatus(CustomerStatus.valueOf(request.getStatus()));
    if (request.getAccountManagerId() != null) {
      User user = userRepository.findById(request.getAccountManagerId())
          .orElseThrow(() -> new NotFoundException("Account manager not found"));
      customer.setAccountManager(user);
    }
  }

  private CustomerResponse toResponse(Customer customer) {
    BigDecimal creditUsed = invoiceRepository.sumOutstandingByCustomer(customer.getId())
        .orElse(BigDecimal.ZERO);
    return CustomerResponse.builder()
        .id(customer.getId())
        .name(customer.getName())
        .gstin(customer.getGstin())
        .licenseNo(customer.getLicenseNo())
        .billingAddress(customer.getBillingAddress())
        .shippingAddress(customer.getShippingAddress())
        .contactName(customer.getContactName())
        .contactPhone(customer.getContactPhone())
        .email(customer.getEmail())
        .territory(customer.getTerritory())
        .creditLimit(customer.getCreditLimit())
        .creditUsed(creditUsed)
        .paymentTermsDays(customer.getPaymentTermsDays())
        .status(customer.getStatus().name())
        .accountManagerId(customer.getAccountManager() != null ? customer.getAccountManager().getId() : null)
        .build();
  }
}
