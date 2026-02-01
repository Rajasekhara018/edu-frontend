import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  standalone: false,
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.scss'
})
export class SkeletonTableComponent {
  @Input() rows = 6;

  skeletonArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}



