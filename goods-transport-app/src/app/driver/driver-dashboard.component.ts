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
      <header>
        <h2>Assigned Jobs</h2>
        <p>Manage status steps and proof submissions.</p>
      </header>
      <div *ngIf="!jobs.length" class="empty">No assignments yet.</div>
      <article *ngFor="let booking of jobs" class="job-card">
        <div>
          <p class="muted">{{ booking.createdAt | date: 'short' }}</p>
          <h3>{{ booking.pickup.address }} → {{ booking.drop.address }}</h3>
          <div class="badge-row">
            <app-status-badge [status]="booking.status"></app-status-badge>
          </div>
        </div>
        <a [routerLink]="['/driver/job', booking.id]">Open</a>
      </article>
    </section>
  `,
  styles: [
    ".card { background: white; padding: 1.5rem; border-radius: 1rem; }",
    ".job-card { padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }",
    ".job-card:last-child { border-bottom: none; }",
    "a { padding: 0.5rem 0.9rem; border-radius: 0.6rem; text-decoration: none; background: #2563eb; color: white; }",
    ".empty { color: #475569; text-align: center; padding: 1rem; }"
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
}
