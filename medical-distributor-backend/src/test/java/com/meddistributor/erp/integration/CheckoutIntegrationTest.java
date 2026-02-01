package com.meddistributor.erp.integration;

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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CheckoutIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private OrderService orderService;

  @Autowired
  private AllocationService allocationService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private InventoryBatchRepository batchRepository;

  @Test
  @WithMockUser(roles = {"WAREHOUSE"})
  void createsInvoiceAndUpdatesStock() throws Exception {
    Product product = new Product();
    product.setSku("INT-SKU");
    product.setName("Integration Product");
    product.setGstRate(new BigDecimal("5.00"));
    productRepository.save(product);

    Customer customer = new Customer();
    customer.setName("Integration Customer");
    customer.setStatus(CustomerStatus.ACTIVE);
    customer.setCreditLimit(new BigDecimal("10000"));
    customer.setPaymentTermsDays(15);
    customerRepository.save(customer);

    InventoryBatch batch = new InventoryBatch();
    batch.setProduct(product);
    batch.setBatchNo("INT-B1");
    batch.setExpiryDate(LocalDate.now().plusDays(120));
    batch.setMrp(new BigDecimal("10"));
    batch.setPurchaseRate(new BigDecimal("8"));
    batch.setQtyAvailable(new BigDecimal("10"));
    batch.setQtyReserved(BigDecimal.ZERO);
    batch.setQtyQuarantine(BigDecimal.ZERO);
    batchRepository.save(batch);

    SalesOrderLineRequest line = new SalesOrderLineRequest();
    line.setProductId(product.getId());
    line.setQuantity(new BigDecimal("4"));
    line.setUnitPrice(new BigDecimal("10"));
    line.setDiscount(BigDecimal.ZERO);
    line.setTaxRate(new BigDecimal("0"));

    SalesOrderRequest orderRequest = new SalesOrderRequest();
    orderRequest.setCustomerId(customer.getId());
    orderRequest.setLines(List.of(line));

    var order = orderService.create(orderRequest);
    allocationService.allocate(order.getId());

    mockMvc.perform(post("/checkout/" + order.getId() + "/invoice"))
        .andExpect(status().isOk());

    InventoryBatch updated = batchRepository.findById(batch.getId()).orElseThrow();
    Assertions.assertEquals(new BigDecimal("0"), updated.getQtyReserved());
  }
}
