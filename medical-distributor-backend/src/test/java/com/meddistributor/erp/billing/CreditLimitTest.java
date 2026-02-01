package com.meddistributor.erp.billing;

import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.billing.service.CheckoutService;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.entity.CustomerStatus;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import com.meddistributor.erp.orders.dto.SalesOrderLineRequest;
import com.meddistributor.erp.orders.dto.SalesOrderRequest;
import com.meddistributor.erp.orders.service.AllocationService;
import com.meddistributor.erp.orders.service.OrderService;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CreditLimitTest {

  @Autowired
  private CheckoutService checkoutService;

  @Autowired
  private OrderService orderService;

  @Autowired
  private AllocationService allocationService;

  @Autowired
  private InvoiceRepository invoiceRepository;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private InventoryBatchRepository batchRepository;

  @Test
  void checkoutFailsWhenCreditExceeded() {
    Customer customer = new Customer();
    customer.setName("Credit Customer");
    customer.setStatus(CustomerStatus.ACTIVE);
    customer.setCreditLimit(new BigDecimal("100"));
    customer.setPaymentTermsDays(15);
    customerRepository.save(customer);

    Product product = new Product();
    product.setSku("TEST-SKU-3");
    product.setName("Test Product 3");
    product.setGstRate(new BigDecimal("5.00"));
    productRepository.save(product);

    InventoryBatch batch = new InventoryBatch();
    batch.setProduct(product);
    batch.setBatchNo("B200");
    batch.setExpiryDate(LocalDate.now().plusDays(90));
    batch.setMrp(new BigDecimal("10"));
    batch.setPurchaseRate(new BigDecimal("8"));
    batch.setQtyAvailable(new BigDecimal("20"));
    batch.setQtyReserved(BigDecimal.ZERO);
    batch.setQtyQuarantine(BigDecimal.ZERO);
    batchRepository.save(batch);

    SalesOrderLineRequest line1 = new SalesOrderLineRequest();
    line1.setProductId(product.getId());
    line1.setQuantity(new BigDecimal("9"));
    line1.setUnitPrice(new BigDecimal("10"));
    line1.setDiscount(BigDecimal.ZERO);
    line1.setTaxRate(new BigDecimal("0"));

    SalesOrderRequest firstOrder = new SalesOrderRequest();
    firstOrder.setCustomerId(customer.getId());
    firstOrder.setLines(List.of(line1));

    var order1 = orderService.create(firstOrder);
    allocationService.allocate(order1.getId());
    checkoutService.checkout(order1.getId());
    Assertions.assertEquals(1, invoiceRepository.count());

    SalesOrderLineRequest line = new SalesOrderLineRequest();
    line.setProductId(product.getId());
    line.setQuantity(new BigDecimal("2"));
    line.setUnitPrice(new BigDecimal("10"));
    line.setDiscount(BigDecimal.ZERO);
    line.setTaxRate(new BigDecimal("0"));

    SalesOrderRequest orderRequest = new SalesOrderRequest();
    orderRequest.setCustomerId(customer.getId());
    orderRequest.setLines(List.of(line));

    var order = orderService.create(orderRequest);
    allocationService.allocate(order.getId());

    Assertions.assertThrows(BusinessException.class, () -> checkoutService.checkout(order.getId()));
  }
}
