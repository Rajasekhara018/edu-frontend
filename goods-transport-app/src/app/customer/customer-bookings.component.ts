import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../core/booking.service';
import { AuthService } from '../core/auth.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from '../shared/confirmation.service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-customer-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, RouterModule],
  template: `
    <section class="list-stack">
      <header>
        <h2>My Bookings</h2>
        <form [formGroup]="filterForm" class="filters">
          <label>
            Status
            <select formControlName="status">
              <option value="ALL">All</option>
              <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
            </select>
          </label>
          <label>
            Search
            <input formControlName="query" placeholder="Pickup, drop or notes" />
          </label>
        </form>
      </header>
      <div *ngIf="!filteredBookings.length" class="empty">No bookings yet.</div>
      <article *ngFor="let booking of filteredBookings" class="booking-card">
        <div>
          <p class="muted">{{ booking.createdAt | date: 'short' }}</p>
          <h3>{{ booking.pickup.address }} → {{ booking.drop.address }}</h3>
          <div class="badge-row">
            <app-status-badge [status]="booking.status"></app-status-badge>
          </div>
        </div>
        <div class="actions">
          <a [routerLink]="['/booking/detail', booking.id]">View</a>
          <button type="button" (click)="attemptCancel(booking.id)" [disabled]="!canCancel(booking.status)">Cancel</button>
        </div>
      </article>
    </section>
  `,
  styles: [
    ".list-stack { display: flex; flex-direction: column; gap: 1rem; background: white; padding: 1.5rem; border-radius: 1rem; }",
    "header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }",
    "form.filters { display: flex; gap: 1rem; }",
    "label { display: flex; flex-direction: column; font-size: 0.85rem; }",
    "input, select { border: 1px solid #d1d5db; padding: 0.4rem 0.6rem; border-radius: 0.5rem; }",
    ".booking-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e2e8f0; }",
    ".booking-card:last-child { border-bottom: none; }",
    ".actions { display: flex; gap: 0.5rem; align-items: center; }",
    "a, button { padding: 0.5rem 0.85rem; border-radius: 0.5rem; border: none; background: #2563eb; color: white; text-decoration: none; cursor: pointer; }",
    "button:disabled { background: #94a3b8; cursor: not-allowed; }",
    ".muted { margin: 0; color: #475569; }",
    ".empty { color: #475569; text-align: center; }"
  ]
})
export class CustomerBookingsComponent {
  readonly statuses = ['CREATED', 'CONFIRMED', 'DRIVER_ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  readonly filterForm = this.fb.group({
    status: ['ALL'],
    query: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookingService: BookingService,
    private readonly auth: AuthService,
    private readonly confirmation: ConfirmationService,
    private readonly toast: ToastService
  ) {}

  get filteredBookings() {
    const list = this.bookingService.bookings().filter((booking) => booking.createdBy === this.auth.session()?.id);
    const status = this.filterForm.controls.status.value;
    const query = (this.filterForm.controls.query.value || '').toLowerCase();
    return list.filter((booking) => {
      const matchesStatus = status === 'ALL' || booking.status === status;
      const text = `${booking.pickup.address} ${booking.drop.address} ${booking.goods.notes ?? ''}`.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      return matchesStatus && matchesSearch;
    });
  }

  canCancel(status: string) {
    return status === 'CREATED' || status === 'CONFIRMED' || status === 'DRIVER_ASSIGNED';
  }

  attemptCancel(id: string) {
    if (!this.confirmation.confirm('Confirm cancellation?')) {
      return;
    }
    const booking = this.bookingService.getById(id);
    if (!booking) {
      return;
    }
    this.bookingService.cancelBooking(id, this.auth.session()?.id ?? 'system', 'Customer cancelled');
    this.toast.show('Booking cancelled', 'info');
  }
}
