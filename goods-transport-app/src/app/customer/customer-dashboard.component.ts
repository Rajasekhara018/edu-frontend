import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BookingService } from '../core/booking.service';
import { VehicleService } from '../core/vehicle.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <section class="dashboard-shell">
      <section class="market-hero">
        <div class="hero-copy">
          <p class="eyebrow">Customer console</p>
          <h2>Welcome back, {{ auth.session()?.name }}</h2>
          <p class="lead">Browse fleet options, compare freight value and move from quote-ready planning to confirmed booking faster.</p>
          <div class="hero-actions">
            <a class="primary" routerLink="/booking/wizard">Book transport</a>
            <a class="ghost" routerLink="/customer/bookings">Open booking bag</a>
          </div>
        </div>
        <div class="hero-summary">
          <div class="summary-card" *ngFor="let item of summaryCards">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="fleet-section">
        <div class="section-head">
          <h3>Recommended fleet</h3>
          <a routerLink="/booking/wizard">Customize load</a>
        </div>
        <div class="fleet-grid">
          <article class="fleet-card" *ngFor="let vehicle of featuredVehicles">
            <p class="fleet-name">{{ vehicle.name }}</p>
            <p class="fleet-copy">Capacity {{ vehicle.capacityKg }} kg</p>
            <div class="fleet-metrics">
              <span>Base ₹{{ vehicle.baseFare }}</span>
              <span>₹{{ vehicle.perKmRate }}/km</span>
            </div>
            <a class="card-link" routerLink="/booking/wizard">Use this vehicle</a>
          </article>
        </div>
      </section>

      <section class="booking-preview">
        <div class="section-head">
          <h3>Recent bookings</h3>
          <a routerLink="/customer/bookings">View all</a>
        </div>
        <div *ngIf="latestBookings.length; else empty" class="booking-list">
          <article class="booking-card" *ngFor="let booking of latestBookings">
            <div class="booking-content">
              <p class="muted">Created {{ booking.createdAt | date: 'short' }}</p>
              <h4>{{ booking.pickup.address }} → {{ booking.drop.address }}</h4>
              <p class="booking-meta">{{ booking.goods.category }} · {{ booking.goods.weightKg }} kg · {{ booking.pricing.distanceKm }} km</p>
              <div class="badge-row">
                <app-status-badge [status]="booking.status"></app-status-badge>
                <span class="payment-chip" [class.paid]="booking.payment.status === 'PAID'">
                  {{ booking.payment.status }}
                </span>
              </div>
            </div>
            <div class="booking-side">
              <strong>₹{{ booking.pricing.total | number: '1.0-0' }}</strong>
              <a [routerLink]="['/booking/detail', booking.id]">Details</a>
            </div>
          </article>
        </div>
        <ng-template #empty>
          <div class="empty-card">No bookings yet. Start with a fresh freight request.</div>
        </ng-template>
      </section>
    </section>
  `,
  styles: [
    ".dashboard-shell { display: flex; flex-direction: column; gap: 1rem; }",
    ".market-hero, .fleet-section, .booking-preview { background: rgba(255,255,255,0.88); border: 1px solid rgba(20,32,24,0.1); border-radius: 1.25rem; box-shadow: 0 18px 40px rgba(28,39,32,0.08); }",
    ".market-hero { display: grid; grid-template-columns: 1.35fr 0.95fr; gap: 1rem; padding: 1.25rem; background: linear-gradient(135deg, #f8fffa, #eff6f1); }",
    ".hero-copy h2 { margin: 0.35rem 0 0.6rem; font-size: clamp(1.7rem, 2.5vw, 2.8rem); }",
    ".eyebrow { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: #ea580c; font-weight: 700; }",
    ".lead, .muted, .booking-meta { color: #526257; }",
    ".hero-actions, .fleet-metrics, .badge-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }",
    ".primary, .ghost, .card-link, .section-head a, .booking-side a { text-decoration: none; }",
    ".primary, .ghost { display: inline-flex; align-items: center; justify-content: center; padding: 0.8rem 1.05rem; border-radius: 999px; }",
    ".primary { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }",
    ".ghost { background: white; color: #111827; border: 1px solid rgba(15,23,42,0.12); }",
    ".hero-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }",
    ".summary-card, .fleet-card, .booking-card, .empty-card { background: white; border: 1px solid rgba(20,32,24,0.1); border-radius: 1rem; padding: 1rem; }",
    ".summary-card span { color: #526257; display: block; }",
    ".summary-card strong { font-size: 1.5rem; }",
    ".fleet-section, .booking-preview { padding: 1.15rem; }",
    ".section-head { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }",
    ".section-head h3 { margin: 0; }",
    ".section-head a { color: #ea580c; font-weight: 600; }",
    ".fleet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; }",
    ".fleet-name { margin: 0 0 0.3rem; font-weight: 700; font-size: 1.05rem; }",
    ".fleet-copy { margin: 0 0 0.8rem; color: #526257; }",
    ".fleet-metrics { margin-bottom: 1rem; color: #ea580c; font-weight: 600; }",
    ".card-link { color: #111827; font-weight: 600; }",
    ".booking-list { display: flex; flex-direction: column; gap: 0.85rem; }",
    ".booking-card { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }",
    ".payment-chip { display: inline-flex; align-items: center; padding: 0.3rem 0.65rem; border-radius: 999px; background: #fff7ed; color: #c2410c; font-size: 0.78rem; font-weight: 700; }",
    ".payment-chip.paid { background: #ecfdf3; color: #047857; }",
    ".booking-content h4 { margin: 0.2rem 0 0.4rem; }",
    ".booking-side { display: flex; flex-direction: column; align-items: end; gap: 0.65rem; }",
    ".booking-side strong { font-size: 1.1rem; }",
    ".booking-side a { color: #ea580c; font-weight: 600; }",
    ".empty-card { color: #526257; text-align: center; }",
    "@media (max-width: 900px) { .market-hero { grid-template-columns: 1fr; } .hero-summary { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); } .booking-card { flex-direction: column; align-items: flex-start; } .booking-side { align-items: flex-start; } }"
  ]
})
export class CustomerDashboardComponent {
  constructor(public auth: AuthService, private bookingService: BookingService, private vehicleService: VehicleService) {}

  private get bookings() {
    const user = this.auth.session();
    if (!user) {
      return [];
    }
    return this.bookingService.bookings().filter((booking) => booking.createdBy === user.id);
  }

  readonly counts = computed(() => {
    const list = this.bookings;
    return {
      total: list.length,
      inTransit: list.filter((booking) => booking.status === 'IN_TRANSIT').length,
      delivered: list.filter((booking) => booking.status === 'DELIVERED').length,
      awaiting: list.filter((booking) => booking.status === 'CREATED' || booking.status === 'DRIVER_ASSIGNED').length,
      paid: list.filter((booking) => booking.payment.status === 'PAID').length
    };
  });

  get latestBookings() {
    return this.bookings.slice(-3).reverse();
  }

  get featuredVehicles() {
    return this.vehicleService.vehicles().filter((vehicle) => vehicle.enabled).slice(0, 3);
  }

  get summaryCards() {
    const totals = this.counts();
    return [
      { label: 'Total bookings', value: totals.total },
      { label: 'In transit', value: totals.inTransit },
      { label: 'Delivered', value: totals.delivered },
      { label: 'Awaiting driver', value: totals.awaiting },
      { label: 'Payments received', value: totals.paid }
    ];
  }
}
