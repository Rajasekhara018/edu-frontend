import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CustomerService, Customer } from '../../core/services/customer.service';

@Component({
  selector: 'app-customers-page',
  standalone: false,
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss'
})
export class CustomersPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);

  filterForm = this.fb.group({
    search: [''],
    status: ['all']
  });

  displayedColumns = ['name', 'gstin', 'territory', 'credit', 'status', 'actions'];
  data: Customer[] = [];
  loading = false;
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  sort = 'name,asc';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const search = this.filterForm.value.search ?? '';
    this.customerService.list(search, this.pageIndex, this.pageSize).subscribe({
      next: response => {
        let rows = response.data;
        const status = this.filterForm.value.status ?? 'all';
        if (status !== 'all') {
          rows = rows.filter(row => row.status.toLowerCase() === status);
        }
        this.data = rows;
        this.total = response.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  onSort(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sort = 'name,asc';
    } else {
      this.sort = `${sort.active},${sort.direction}`;
    }
    this.load();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  creditUtilization(row: Customer): number {
    if (!row.creditLimit) {
      return 0;
    }
    return Math.min(100, (row.creditUsed / row.creditLimit) * 100);
  }
}



