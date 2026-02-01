package com.meddistributor.erp.reporting.controller;

import com.meddistributor.erp.common.dto.PageResponse;
import com.meddistributor.erp.reporting.dto.NearExpiryRow;
import com.meddistributor.erp.reporting.dto.OutstandingAgingRow;
import com.meddistributor.erp.reporting.dto.SalesReportRow;
import com.meddistributor.erp.reporting.service.ReportingService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportingController {
  private final ReportingService reportingService;

  public ReportingController(ReportingService reportingService) {
    this.reportingService = reportingService;
  }

  @GetMapping("/sales")
  public ResponseEntity<PageResponse<SalesReportRow>> sales(
      @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(reportingService.salesReport(from, to, pageable));
  }

  @GetMapping("/outstanding-aging")
  public ResponseEntity<List<OutstandingAgingRow>> outstanding() {
    return ResponseEntity.ok(reportingService.outstandingAging());
  }

  @GetMapping("/near-expiry")
  public ResponseEntity<PageResponse<NearExpiryRow>> nearExpiry(
      @RequestParam(value = "days", defaultValue = "60") int days,
      @PageableDefault Pageable pageable) {
    return ResponseEntity.ok(reportingService.nearExpiry(days, pageable));
  }
}
