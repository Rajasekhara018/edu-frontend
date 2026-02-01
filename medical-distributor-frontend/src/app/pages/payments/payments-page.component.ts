import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { PaymentAllocationDialogComponent } from './payment-allocation-dialog.component';

interface OutstandingInvoice {
  invoiceNo: string;
  customer: string;
  bucket: string;
  outstanding: number;
}

@Component({
  selector: 'app-payments-page',
  standalone: false,
  templateUrl: './payments-page.component.html',
  styleUrl: './payments-page.component.scss'
})
export class PaymentsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({
    bucket: ['all'],
    search: ['']
  });

  data: OutstandingInvoice[] = [];
  loading = false;
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  sort = 'invoiceNo,asc';

  private allInvoices: OutstandingInvoice[] = [
    { invoiceNo: 'HQ/2025-26/000024', customer: 'Apex Health', bucket: '31-60', outstanding: 18200 },
    { invoiceNo: 'HQ/2025-26/000025', customer: 'CarePlus Medicals', bucket: '0-30', outstanding: 9500 },
    { invoiceNo: 'HQ/2025-26/000026', customer: 'Wellness Hub', bucket: '90+', outstanding: 41200 },
    { invoiceNo: 'HQ/2025-26/000027', customer: 'CityCare Pharmacy', bucket: '61-90', outstanding: 28450 },
    { invoiceNo: 'HQ/2025-26/000028', customer: 'Nova Health', bucket: '0-30', outstanding: 7600 },
    { invoiceNo: 'HQ/2025-26/000029', customer: 'Prime Medico', bucket: '31-60', outstanding: 15600 }
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const bucket = this.filterForm.value.bucket ?? 'all';
    const search = (this.filterForm.value.search ?? '').toLowerCase().trim();

    let rows = [...this.allInvoices];
    if (bucket !== 'all') {
      rows = rows.filter(row => row.bucket === bucket);
    }
    if (search) {
      rows = rows.filter(row =>
        row.invoiceNo.toLowerCase().includes(search) ||
        row.customer.toLowerCase().includes(search)
      );
    }

    const [sortField, sortDir] = this.sort.split(',');
    rows.sort((a, b) => {
      const first = (a as any)[sortField];
      const second = (b as any)[sortField];
      if (first === second) return 0;
      const order = first > second ? 1 : -1;
      return sortDir === 'desc' ? -order : order;
    });

    this.total = rows.length;
    const start = this.pageIndex * this.pageSize;
    this.data = rows.slice(start, start + this.pageSize);
    this.loading = false;
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  onSort(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sort = 'invoiceNo,asc';
    } else {
      this.sort = `${sort.active},${sort.direction}`;
    }
    this.load();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  openAllocation(): void {
    this.dialog.open(PaymentAllocationDialogComponent, { width: '420px' });
  }
}



