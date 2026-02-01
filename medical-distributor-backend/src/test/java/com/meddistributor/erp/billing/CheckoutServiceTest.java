package com.meddistributor.erp.billing;

import com.meddistributor.erp.billing.repository.InvoiceRepository;
import com.meddistributor.erp.billing.service.CheckoutService;
import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.entity.CustomerStatus;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import com.meddistributor.erp.orders.dto.SalesOrderLineRequest;
import com.meddistributor.erp.orders.dto.SalesOrderRequest;
import com.meddistributor.erp.orders.service.AllocationService;
import com.meddistributor.erp.orders.service.OrderService;
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
class CheckoutServiceTest {

  @Autowired
  private OrderService orderService;

  @Autowired
  private AllocationService allocationService;

  @Autowired
  private CheckoutService checkoutService;

  @Autowired
  private InvoiceRepository invoiceRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private InventoryBatchRepository batchRepository;

  @Test
  void checkoutIsIdempotent() {
    Product product = new Product();
    product.setSku("TEST-SKU-2");
    product.setName("Test Product 2");
    product.setGstRate(new BigDecimal("5.00"));
    productRepository.save(product);

    Customer customer = new Customer();
    customer.setName("Test Customer 2");
    customer.setStatus(CustomerStatus.ACTIVE);
    customer.setCreditLimit(new BigDecimal("50000"));
    customer.setPaymentTermsDays(15);
    customerRepository.save(customer);

    InventoryBatch batch = new InventoryBatch();
    batch.setProduct(product);
    batch.setBatchNo("B100");
    batch.setExpiryDate(LocalDate.now().plusDays(90));
    batch.setMrp(new BigDecimal("10"));
    batch.setPurchaseRate(new BigDecimal("8"));
    batch.setQtyAvailable(new BigDecimal("20"));
    batch.setQtyReserved(BigDecimal.ZERO);
    batch.setQtyQuarantine(BigDecimal.ZERO);
    batchRepository.save(batch);

    SalesOrderLineRequest line = new SalesOrderLineRequest();
    line.setProductId(product.getId());
    line.setQuantity(new BigDecimal("5"));
    line.setUnitPrice(new BigDecimal("10"));
    line.setDiscount(BigDecimal.ZERO);
    line.setTaxRate(new BigDecimal("5"));

    SalesOrderRequest orderRequest = new SalesOrderRequest();
    orderRequest.setCustomerId(customer.getId());
    orderRequest.setLines(List.of(line));

    var order = orderService.create(orderRequest);
    allocationService.allocate(order.getId());

    var invoice1 = checkoutService.checkout(order.getId());
    var invoice2 = checkoutService.checkout(order.getId());

    Assertions.assertEquals(invoice1.getId(), invoice2.getId());
    Assertions.assertEquals(1, invoiceRepository.count());

    InventoryBatch updated = batchRepository.findById(batch.getId()).orElseThrow();
    Assertions.assertEquals(new BigDecimal("0"), updated.getQtyReserved());
  }
}
