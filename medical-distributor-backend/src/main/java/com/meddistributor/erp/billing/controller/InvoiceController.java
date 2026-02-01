package com.meddistributor.erp.billing.controller;

import com.meddistributor.erp.billing.dto.InvoiceResponse;
import com.meddistributor.erp.billing.service.InvoiceService;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {
  private final InvoiceService invoiceService;

  public InvoiceController(InvoiceService invoiceService) {
    this.invoiceService = invoiceService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<InvoiceResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(invoiceService.get(id));
  }

  @GetMapping("/{id}/pdf")
  public ResponseEntity<byte[]> getPdf(@PathVariable UUID id) {
    byte[] pdf = invoiceService.getPdf(id);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=invoice-" + id + ".pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
  }
}
