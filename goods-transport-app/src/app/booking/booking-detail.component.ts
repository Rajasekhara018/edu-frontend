import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../core/booking.service';
import { Booking } from '../core/models';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { TimelineComponent } from '../shared/timeline.component';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, TimelineComponent],
  template: `
    <section *ngIf="booking; else missing" class="detail-shell">
      <header>
        <h2>Booking #{{ booking.id }}</h2>
        <app-status-badge [status]="booking.status"></app-status-badge>
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
    ".detail-shell { background: white; padding: 1.5rem; border-radius: 1rem; display: flex; flex-direction: column; gap: 1rem; }",
    "header { display: flex; justify-content: space-between; align-items: center; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }",
    ".panel { border: 1px solid #e2e8f0; padding: 1rem; border-radius: 0.75rem; }",
    ".pricing { border-top: 1px solid #e5e7eb; padding-top: 1rem; }",
    ".timeline-wrapper { border-top: 1px dashed #cbd5f5; padding-top: 1rem; }",
    ".muted { color: #6b7280; }",
    ".empty { padding: 2rem; text-align: center; }"
  ]
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | null = null;

  constructor(private readonly route: ActivatedRoute, private readonly bookingService: BookingService, private readonly router: Router) {}

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
}
