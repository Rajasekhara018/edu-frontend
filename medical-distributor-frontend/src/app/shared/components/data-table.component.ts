import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

export interface DataColumn {
  key: string;
  label: string;
  type?: 'text' | 'status' | 'currency' | 'date' | 'number';
}

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() columns: DataColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() total = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() emptyMessage = 'No records found for the current filters.';

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  onPage(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }
}



