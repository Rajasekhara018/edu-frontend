package com.meddistributor.erp.orders;

import com.meddistributor.erp.inventory.entity.InventoryBatch;
import com.meddistributor.erp.inventory.repository.InventoryBatchRepository;
import com.meddistributor.erp.masterdata.entity.Customer;
import com.meddistributor.erp.masterdata.entity.CustomerStatus;
import com.meddistributor.erp.masterdata.entity.Product;
import com.meddistributor.erp.masterdata.repository.CustomerRepository;
import com.meddistributor.erp.masterdata.repository.ProductRepository;
import com.meddistributor.erp.orders.dto.SalesOrderLineRequest;
import com.meddistributor.erp.orders.dto.SalesOrderRequest;
import com.meddistributor.erp.orders.entity.AllocationStatus;
import com.meddistributor.erp.orders.repository.OrderAllocationRepository;
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
class AllocationServiceTest {

  @Autowired
  private AllocationService allocationService;

  @Autowired
  private OrderService orderService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private InventoryBatchRepository batchRepository;

  @Autowired
  private OrderAllocationRepository allocationRepository;

  @Test
  void allocatesByEarliestExpiry() {
    Product product = new Product();
    product.setSku("TEST-SKU");
    product.setName("Test Product");
    product.setGstRate(new BigDecimal("5.00"));
    productRepository.save(product);

    Customer customer = new Customer();
    customer.setName("Test Customer");
    customer.setStatus(CustomerStatus.ACTIVE);
    customer.setCreditLimit(new BigDecimal("10000"));
    customer.setPaymentTermsDays(15);
    customerRepository.save(customer);

    InventoryBatch batch1 = new InventoryBatch();
    batch1.setProduct(product);
    batch1.setBatchNo("B1");
    batch1.setExpiryDate(LocalDate.now().plusDays(30));
    batch1.setMrp(new BigDecimal("10"));
    batch1.setPurchaseRate(new BigDecimal("8"));
    batch1.setQtyAvailable(new BigDecimal("5"));
    batch1.setQtyReserved(BigDecimal.ZERO);
    batch1.setQtyQuarantine(BigDecimal.ZERO);
    batchRepository.save(batch1);

    InventoryBatch batch2 = new InventoryBatch();
    batch2.setProduct(product);
    batch2.setBatchNo("B2");
    batch2.setExpiryDate(LocalDate.now().plusDays(90));
    batch2.setMrp(new BigDecimal("10"));
    batch2.setPurchaseRate(new BigDecimal("8"));
    batch2.setQtyAvailable(new BigDecimal("10"));
    batch2.setQtyReserved(BigDecimal.ZERO);
    batch2.setQtyQuarantine(BigDecimal.ZERO);
    batchRepository.save(batch2);

    SalesOrderLineRequest line = new SalesOrderLineRequest();
    line.setProductId(product.getId());
    line.setQuantity(new BigDecimal("8"));
    line.setUnitPrice(new BigDecimal("10"));
    line.setDiscount(BigDecimal.ZERO);
    line.setTaxRate(new BigDecimal("5"));

    SalesOrderRequest orderRequest = new SalesOrderRequest();
    orderRequest.setCustomerId(customer.getId());
    orderRequest.setLines(List.of(line));

    var order = orderService.create(orderRequest);
    allocationService.allocate(order.getId());

    var allocations = allocationRepository.findByOrderLineOrderId(order.getId());
    Assertions.assertEquals(2, allocations.size());
    Assertions.assertEquals(AllocationStatus.FULL.name(), orderService.get(order.getId()).getAllocationStatus());

    var sorted = allocations.stream()
        .sorted((a, b) -> a.getBatch().getExpiryDate().compareTo(b.getBatch().getExpiryDate()))
        .toList();
    Assertions.assertEquals("B1", sorted.get(0).getBatch().getBatchNo());
    Assertions.assertEquals(new BigDecimal("5"), sorted.get(0).getQtyAllocated());
  }
}
