import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReportsService, SalesReportRow, OutstandingAgingRow, NearExpiryRow } from '../../core/services/reports.service';
import { DataColumn } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-reports-page',
  standalone: false,
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportsService = inject(ReportsService);

  salesForm = this.fb.group({
    from: [''],
    to: ['']
  });

  expiryForm = this.fb.group({
    days: [60]
  });

  salesRows: SalesReportRow[] = [];
  salesTotal = 0;
  salesPageIndex = 0;
  salesPageSize = 10;
  salesSort = 'invoiceDate,desc';
  salesLoading = false;
  salesError = '';

  agingRows: OutstandingAgingRow[] = [];
  agingLoading = false;
  agingError = '';

  expiryRows: NearExpiryRow[] = [];
  expiryTotal = 0;
  expiryPageIndex = 0;
  expiryPageSize = 10;
  expirySort = 'expiryDate,asc';
  expiryLoading = false;
  expiryError = '';

  salesColumns: DataColumn[] = [
    { key: 'invoiceNo', label: 'Invoice' },
    { key: 'customerName', label: 'Customer' },
    { key: 'invoiceDate', label: 'Date', type: 'date' },
    { key: 'netTotal', label: 'Net', type: 'currency' }
  ];

  expiryColumns: DataColumn[] = [
    { key: 'productName', label: 'Product' },
    { key: 'batchNo', label: 'Batch' },
    { key: 'expiryDate', label: 'Expiry', type: 'date' },
    { key: 'qtyAvailable', label: 'Available', type: 'number' }
  ];

  ngOnInit(): void {
    this.loadSales();
    this.loadAging();
    this.loadExpiry();
  }

  loadSales(): void {
    this.salesLoading = true;
    this.salesError = '';
    const { from, to } = this.salesForm.value;
    this.reportsService.salesReport(from || null, to || null, this.salesPageIndex, this.salesPageSize, this.salesSort).subscribe({
      next: response => {
        this.salesRows = response.data;
        this.salesTotal = response.totalElements;
        this.salesLoading = false;
      },
      error: () => {
        this.salesError = 'Unable to load sales report.';
        this.salesLoading = false;
      }
    });
  }

  loadAging(): void {
    this.agingLoading = true;
    this.agingError = '';
    this.reportsService.outstandingAging().subscribe({
      next: rows => {
        this.agingRows = rows;
        this.agingLoading = false;
      },
      error: () => {
        this.agingError = 'Unable to load outstanding aging report.';
        this.agingLoading = false;
      }
    });
  }

  loadExpiry(): void {
    this.expiryLoading = true;
    this.expiryError = '';
    const days = Number(this.expiryForm.value.days ?? 60);
    this.reportsService.nearExpiry(days, this.expiryPageIndex, this.expiryPageSize, this.expirySort).subscribe({
      next: response => {
        this.expiryRows = response.data;
        this.expiryTotal = response.totalElements;
        this.expiryLoading = false;
      },
      error: () => {
        this.expiryError = 'Unable to load near-expiry report.';
        this.expiryLoading = false;
      }
    });
  }

  onSalesPage(event: PageEvent): void {
    this.salesPageIndex = event.pageIndex;
    this.salesPageSize = event.pageSize;
    this.loadSales();
  }

  onSalesSort(sort: Sort): void {
    this.salesSort = sort.active && sort.direction ? `${sort.active},${sort.direction}` : 'invoiceDate,desc';
    this.loadSales();
  }

  onExpiryPage(event: PageEvent): void {
    this.expiryPageIndex = event.pageIndex;
    this.expiryPageSize = event.pageSize;
    this.loadExpiry();
  }

  onExpirySort(sort: Sort): void {
    this.expirySort = sort.active && sort.direction ? `${sort.active},${sort.direction}` : 'expiryDate,asc';
    this.loadExpiry();
  }
}



