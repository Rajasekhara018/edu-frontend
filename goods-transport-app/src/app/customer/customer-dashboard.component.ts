import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BookingService } from '../core/booking.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <section class="hero">
      <div>
        <h2>Welcome back, {{ auth.session()?.name }}</h2>
        <p>Plan your next cargo move today. Everything stays in LocalStorage.</p>
      </div>
      <div class="hero-actions">
        <a class="primary" routerLink="/booking/wizard">Book Transport</a>
        <a class="ghost" routerLink="/customer/bookings">My Bookings</a>
      </div>
    </section>
    <section class="stats-grid">
      <article>
        <p>Total bookings</p>
        <strong>{{ counts().total }}</strong>
      </article>
      <article>
        <p>In transit</p>
        <strong>{{ counts().inTransit }}</strong>
      </article>
      <article>
        <p>Delivered</p>
        <strong>{{ counts().delivered }}</strong>
      </article>
      <article>
        <p>Awaiting driver</p>
        <strong>{{ counts().awaiting }}</strong>
      </article>
    </section>
    <section class="booking-preview" *ngIf="latestBookings.length">
      <h3>Recent bookings</h3>
        <div class="booking-card" *ngFor="let booking of latestBookings">
        <div>
          <p class="muted">Created {{ booking.createdAt | date: 'short' }}</p>
          <h4>{{ booking.pickup.address }} → {{ booking.drop.address }}</h4>
          <div class="badge-row">
            <app-status-badge [status]="booking.status"></app-status-badge>
          </div>
        </div>
        <a [routerLink]="['/booking/detail', booking.id]">Details</a>
      </div>
    </section>
  `,
  styles: [
    ".hero { display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: white; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }",
    ".hero-actions { display: flex; gap: 0.75rem; }",
    ".primary { background: #2563eb; color: white; padding: 0.65rem 1rem; border-radius: 0.65rem; text-decoration: none; }",
    ".ghost { border: 1px solid #cbd5f5; color: #1e3a8a; padding: 0.65rem 1rem; border-radius: 0.65rem; text-decoration: none; }",
    ".stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }",
    ".stats-grid article { background: white; padding: 1rem; border-radius: 0.75rem; }",
    ".booking-preview .booking-card { background: white; border-radius: 1rem; padding: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }",
    ".booking-preview .muted { color: #475569; margin: 0; }"
  ]
})
export class CustomerDashboardComponent {
  constructor(public auth: AuthService, private bookingService: BookingService) {}

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
      awaiting: list.filter((booking) => booking.status === 'CREATED' || booking.status === 'DRIVER_ASSIGNED').length
    };
  });

  get latestBookings() {
    return this.bookings.slice(-3).reverse();
  }
}
