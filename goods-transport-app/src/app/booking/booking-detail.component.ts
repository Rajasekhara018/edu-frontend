import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../core/booking.service';
import { Booking } from '../core/models';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { TimelineComponent } from '../shared/timeline.component';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, TimelineComponent],
  template: `
    <section *ngIf="booking; else missing" class="detail-shell">
      <header class="detail-head">
        <div>
          <p class="eyebrow">Booking detail</p>
          <h2>Booking #{{ booking.id }}</h2>
        </div>
        <div class="head-side">
          <strong>₹{{ booking.pricing.total | number: '1.0-0' }}</strong>
          <app-status-badge [status]="booking.status"></app-status-badge>
        </div>
      </header>
      <div class="grid">
        <div class="panel">
          <h3>Pickup</h3>
          <p>{{ booking.pickup.address }}</p>
          <p>{{ booking.pickup.contactName }} · {{ booking.pickup.phone }}</p>
        </div>
        <div class="panel">
          <h3>Drop</h3>
          <p>{{ booking.drop.address }}</p>
          <p>{{ booking.drop.contactName }} · {{ booking.drop.phone }}</p>
        </div>
        <div class="panel">
          <h3>Goods</h3>
          <p>{{ booking.goods.category }} · {{ booking.goods.weightKg }} kg · {{ booking.goods.packages }} pkgs</p>
          <p *ngIf="booking.goods.fragile">Fragile handling</p>
          <p *ngIf="booking.goods.notes">Notes: {{ booking.goods.notes }}</p>
        </div>
        <div class="panel">
          <h3>Vehicle</h3>
          <p>{{ booking.vehicle.type }} · Capacity {{ booking.vehicle.capacityKg }} kg</p>
        </div>
      </div>
      <div class="pricing">
        <h3>Pricing</h3>
        <p>Distance: {{ booking.pricing.distanceKm }} km</p>
        <p>Base fare: ₹{{ booking.pricing.baseFare }}</p>
        <p>Per km: ₹{{ booking.pricing.perKmRate }}</p>
        <p>Tax: ₹{{ booking.pricing.tax | number: '1.0-0' }}</p>
        <p><strong>Total: ₹{{ booking.pricing.total | number: '1.0-0' }}</strong></p>
      </div>
      <div class="payment-panel">
        <div>
          <h3>Payment</h3>
          <p><strong>Status:</strong> {{ booking.payment.status }}</p>
          <p><strong>Method:</strong> {{ paymentLabel(booking.payment.method) }}</p>
          <p><strong>Amount:</strong> ₹{{ booking.payment.amount | number: '1.0-0' }}</p>
          <p *ngIf="booking.payment.paidAt"><strong>Paid at:</strong> {{ booking.payment.paidAt | date: 'short' }}</p>
        </div>
        <button type="button" *ngIf="canPay" (click)="payNow()">Pay now</button>
      </div>
      <div class="timeline-wrapper">
        <h3>Status Timeline</h3>
        <app-timeline [events]="booking.statusHistory"></app-timeline>
      </div>
      <p *ngIf="booking.cancelReason" class="muted">Cancelled: {{ booking.cancelReason }}</p>
    </section>
    <ng-template #missing>
      <div class="empty">Booking not found.</div>
    </ng-template>
  `,
  styles: [
    ".detail-shell { background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid rgba(20,32,24,0.1); box-shadow: 0 18px 40px rgba(28,39,32,0.08); }",
    ".detail-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }",
    ".detail-head h2 { margin: 0.2rem 0 0; }",
    ".eyebrow { margin: 0; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: #ea580c; font-weight: 700; }",
    ".head-side { display: flex; flex-direction: column; align-items: end; gap: 0.5rem; }",
    ".head-side strong { font-size: 1.25rem; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }",
    ".panel, .pricing, .timeline-wrapper, .payment-panel { border: 1px solid rgba(20,32,24,0.08); padding: 1rem; border-radius: 1rem; background: white; }",
    ".payment-panel { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }",
    ".timeline-wrapper { display: flex; flex-direction: column; gap: 0.75rem; }",
    ".muted { color: #6b7280; }",
    "button { padding: 0.7rem 1rem; border: none; border-radius: 999px; background: linear-gradient(135deg, #f97316, #ea580c); color: white; cursor: pointer; }",
    ".empty { padding: 2rem; text-align: center; }",
    "@media (max-width: 720px) { .detail-head, .payment-panel { flex-direction: column; align-items: flex-start; } .head-side { align-items: flex-start; } }"
  ]
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly toast: ToastService
  ) {}

  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (!bookingId) {
      this.router.navigate(['/customer']);
      return;
    }
    this.booking = this.bookingService.getById(bookingId);
    if (!this.booking) {
      this.router.navigate(['/customer']);
    }
  }

  get canPay() {
    const userId = this.auth.session()?.id;
    return Boolean(this.booking && this.booking.createdBy === userId && this.booking.payment.status === 'PENDING');
  }

  paymentLabel(method: string) {
    return method === 'NET_BANKING' ? 'Net banking' : method;
  }

  payNow() {
    if (!this.booking) {
      return;
    }
    const updated = this.bookingService.markPaid(this.booking.id, this.auth.session()?.id ?? 'customer', this.booking.payment.method);
    if (!updated) {
      return;
    }
    this.booking = updated;
    this.toast.show('Payment received for this booking', 'success');
  }
}
