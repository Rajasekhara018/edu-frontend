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
      <header class="page-head">
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
        <div class="booking-main">
          <p class="muted">{{ booking.createdAt | date: 'short' }}</p>
          <h3>{{ booking.pickup.address }} → {{ booking.drop.address }}</h3>
          <p class="meta">{{ booking.goods.category }} · {{ booking.goods.weightKg }} kg · {{ booking.vehicle.type }} · {{ booking.pricing.distanceKm }} km</p>
          <div class="badge-row">
            <app-status-badge [status]="booking.status"></app-status-badge>
            <span class="payment-chip" [class.paid]="booking.payment.status === 'PAID'">
              {{ booking.payment.status }} · {{ paymentLabel(booking.payment.method) }}
            </span>
          </div>
        </div>
        <div class="booking-side">
          <strong>₹{{ booking.pricing.total | number: '1.0-0' }}</strong>
          <div class="actions">
            <a [routerLink]="['/booking/detail', booking.id]">View</a>
            <button type="button" class="pay-btn" *ngIf="booking.payment.status === 'PENDING'" (click)="payNow(booking.id)">Pay</button>
            <button type="button" (click)="attemptCancel(booking.id)" [disabled]="!canCancel(booking.status)">Cancel</button>
          </div>
        </div>
      </article>
    </section>
  `,
  styles: [
    ".list-stack { display: flex; flex-direction: column; gap: 1rem; background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 1.25rem; border: 1px solid rgba(20,32,24,0.1); box-shadow: 0 18px 40px rgba(28,39,32,0.08); }",
    ".page-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }",
    ".page-head h2 { margin: 0; }",
    "form.filters { display: flex; gap: 1rem; flex-wrap: wrap; }",
    "label { display: flex; flex-direction: column; font-size: 0.85rem; gap: 0.25rem; }",
    "input, select { border: 1px solid rgba(20,32,24,0.14); padding: 0.55rem 0.75rem; border-radius: 0.75rem; min-width: 180px; }",
    ".booking-card { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid rgba(20,32,24,0.08); background: white; border-radius: 1rem; }",
    ".booking-main h3 { margin: 0.2rem 0 0.35rem; }",
    ".badge-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }",
    ".payment-chip { display: inline-flex; align-items: center; padding: 0.3rem 0.65rem; border-radius: 999px; background: #fff7ed; color: #c2410c; font-size: 0.78rem; font-weight: 700; }",
    ".payment-chip.paid { background: #ecfdf3; color: #047857; }",
    ".actions { display: flex; gap: 0.5rem; align-items: center; }",
    ".booking-side { display: flex; flex-direction: column; align-items: end; gap: 0.75rem; }",
    ".booking-side strong { font-size: 1.15rem; }",
    "a, button { padding: 0.6rem 0.95rem; border-radius: 999px; border: none; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-decoration: none; cursor: pointer; }",
    ".pay-btn { background: linear-gradient(135deg, #0f172a, #1f2937); }",
    "button:disabled { background: #94a3b8; cursor: not-allowed; }",
    ".muted, .meta, .empty { color: #526257; }",
    ".empty { text-align: center; }",
    "@media (max-width: 860px) { .booking-card { flex-direction: column; align-items: flex-start; } .booking-side { align-items: flex-start; } }"
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

  payNow(id: string) {
    const booking = this.bookingService.getById(id);
    if (!booking || booking.payment.status === 'PAID') {
      return;
    }
    this.bookingService.markPaid(id, this.auth.session()?.id ?? 'customer', booking.payment.method);
    this.toast.show('Payment received for booking', 'success');
  }

  paymentLabel(method: string) {
    return method === 'NET_BANKING' ? 'Net banking' : method;
  }
}
