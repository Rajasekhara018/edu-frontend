import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../core/booking.service';
import { AuthService } from '../core/auth.service';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from '../shared/status-badge.component';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <section class="card">
      <header class="page-head">
        <div>
          <p class="eyebrow">Driver workspace</p>
          <h2>Assigned Jobs</h2>
          <p>Manage status steps and proof submissions.</p>
        </div>
        <div class="summary">
          <div class="summary-card">
            <span>Total jobs</span>
            <strong>{{ jobs.length }}</strong>
          </div>
          <div class="summary-card">
            <span>In transit</span>
            <strong>{{ inTransitCount }}</strong>
          </div>
          <div class="summary-card">
            <span>Payments received</span>
            <strong>₹{{ paidAmount | number: '1.0-0' }}</strong>
          </div>
        </div>
      </header>
      <div *ngIf="!jobs.length" class="empty">No assignments yet.</div>
      <article *ngFor="let booking of jobs" class="job-card">
        <div>
          <p class="muted">{{ booking.createdAt | date: 'short' }}</p>
          <h3>{{ booking.pickup.address }} → {{ booking.drop.address }}</h3>
          <p class="meta">{{ booking.goods.category }} · {{ booking.goods.weightKg }} kg · {{ booking.pricing.distanceKm }} km</p>
          <div class="badge-row">
            <app-status-badge [status]="booking.status"></app-status-badge>
            <span class="payment-chip" [class.paid]="booking.payment.status === 'PAID'">
              {{ booking.payment.status }} · ₹{{ booking.payment.amount | number: '1.0-0' }}
            </span>
          </div>
        </div>
        <a [routerLink]="['/driver/job', booking.id]">Open</a>
      </article>
    </section>
  `,
  styles: [
    ".card { background: var(--panel-bg); padding: 1.5rem; border-radius: 1.25rem; border: 1px solid var(--border); box-shadow: var(--shadow); }",
    ".page-head { display: flex; justify-content: space-between; gap: 1rem; align-items: start; margin-bottom: 1rem; }",
    ".page-head h2 { margin: 0.25rem 0 0.35rem; }",
    ".eyebrow { margin: 0; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: var(--brand-strong); font-weight: 700; }",
    ".summary { display: flex; gap: 0.75rem; }",
    ".summary-card { background: var(--panel-muted-bg); border: 1px solid var(--border); border-radius: 1rem; padding: 0.9rem 1rem; min-width: 120px; }",
    ".summary-card span { display: block; color: var(--muted); }",
    ".summary-card strong { font-size: 1.25rem; color: var(--text); }",
    ".job-card { padding: 1rem; border: 1px solid var(--border); background: var(--panel-muted-bg); border-radius: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 0.85rem; }",
    ".job-card:last-child { margin-bottom: 0; }",
    ".badge-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }",
    ".payment-chip { display: inline-flex; align-items: center; padding: 0.3rem 0.65rem; border-radius: 999px; background: color-mix(in srgb, var(--brand-contrast) 60%, white); color: var(--brand-strong); font-size: 0.78rem; font-weight: 700; }",
    ".payment-chip.paid { background: color-mix(in srgb, var(--brand) 14%, white); color: var(--brand-strong); }",
    ".meta, .empty, .muted { color: var(--muted); }",
    "h3 { color: var(--text); }",
    "a { padding: 0.65rem 0.95rem; border-radius: 999px; text-decoration: none; background: linear-gradient(135deg, var(--brand), var(--brand-strong)); color: var(--inverse-text); }",
    ".empty { text-align: center; padding: 1rem; }",
    "@media (max-width: 720px) { .page-head, .job-card { flex-direction: column; align-items: flex-start; } .summary { width: 100%; flex-wrap: wrap; } }"
  ]
})
export class DriverDashboardComponent {
  constructor(private readonly bookingService: BookingService, private readonly auth: AuthService) {}

  get jobs() {
    const userId = this.auth.session()?.id;
    if (!userId) {
      return [];
    }
    return this.bookingService.bookings().filter((booking) => booking.assignedDriverId === userId);
  }

  get inTransitCount() {
    return this.jobs.filter((job) => job.status === 'IN_TRANSIT').length;
  }

  get paidAmount() {
    return this.jobs.filter((job) => job.payment.status === 'PAID').reduce((sum, job) => sum + job.payment.amount, 0);
  }
}
