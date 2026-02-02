import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatus } from '../core/models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="statusClass">{{ status }}</span>`,
  styles: [
    ".badge { padding: 0.35rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }",
    ".created { background: #e0f2fe; color: #1d4ed8; }",
    ".confirmed { background: #e0f8ef; color: #047857; }",
    ".driver-assigned { background: #fbe4c6; color: #92400e; }",
    ".driver-arrived { background: #f4f4f5; color: #4b5563; }",
    ".picked-up { background: #d1fae5; color: #065f46; }",
    ".in-transit { background: #e0f2fe; color: #0f172a; }",
    ".delivered { background: #dcfce7; color: #166534; }",
    ".cancelled { background: #fee2e2; color: #b91c1c; }"
  ]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: BookingStatus;

  get statusClass() {
    return this.status.replace(/_/g, '-').toLowerCase();
  }
}
