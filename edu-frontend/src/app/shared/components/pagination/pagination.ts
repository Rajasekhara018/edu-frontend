import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination implements OnChanges {

  @Input() totalElements!: number;
  @Input() currentPage!: number;
  @Input() pageSize!: number;

  @Output() pageChange = new EventEmitter<{ pageNumber: number, pageSize: number }>();

  pageSizeOptions = [5, 10, 20, 50];

  totalPages = 0;

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
  }

  goToPage(page: number) {

    if (page >= 1 && page <= this.totalPages) {

      this.currentPage = page;

      this.pageChange.emit({
        pageNumber: this.currentPage - 1,
        pageSize: this.pageSize
      });

    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  onPageSizeChange() {

    this.currentPage = 1;

    this.pageChange.emit({
      pageNumber: 0,
      pageSize: this.pageSize
    });

  }

  /* ENTRY RANGE */

  get startIndex(): number {

    if (this.totalElements === 0) return 0;

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {

    if (this.totalElements === 0) return 0;

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalElements
    );
  }

  get visiblePages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

}