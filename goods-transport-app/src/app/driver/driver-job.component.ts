import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../core/booking.service';
import { Booking, BookingStatus } from '../core/models';
import { TimelineComponent } from '../shared/timeline.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-driver-job',
  standalone: true,
  imports: [CommonModule, TimelineComponent, StatusBadgeComponent, ReactiveFormsModule],
  template: `
    <section *ngIf="booking; else missing" class="job-shell">
      <header>
        <h2>Job {{ booking.id }}</h2>
        <app-status-badge [status]="booking.status"></app-status-badge>
      </header>
      <div class="grid">
        <div>
          <h3>Pickup</h3>
          <p>{{ booking.pickup.address }} · {{ booking.pickup.contactName }}</p>
        </div>
        <div>
          <h3>Drop</h3>
          <p>{{ booking.drop.address }} · {{ booking.drop.contactName }}</p>
        </div>
      </div>
      <div class="status-actions">
        <button *ngFor="let status of actions" [disabled]="status !== nextStatus" (click)="update(status)">{{ status.replace(/_/g, ' ') }}</button>
      </div>
      <form [formGroup]="proofForm" class="proof" (ngSubmit)="submitProof()">
        <h3>Proof of delivery</h3>
        <label>
          Notes / signature
          <textarea formControlName="proofText" rows="3"></textarea>
        </label>
        <label>
          Image base64 (optional)
          <textarea formControlName="proofImage" rows="3"></textarea>
        </label>
        <button type="submit">Save proof</button>
      </form>
      <div class="timeline">
        <h3>Timeline</h3>
        <app-timeline [events]="booking.statusHistory"></app-timeline>
      </div>
    </section>
    <ng-template #missing>
      <div class="empty">Booking not found or not assigned.</div>
    </ng-template>
  `,
  styles: [
    ".job-shell { background: white; padding: 1.5rem; border-radius: 1rem; display: flex; flex-direction: column; gap: 1rem; }",
    "header { display: flex; justify-content: space-between; align-items: center; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }",
    ".status-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }",
    ".status-actions button, .proof button { border: none; background: #2563eb; color: white; border-radius: 0.6rem; padding: 0.5rem 1rem; cursor: pointer; }",
    ".status-actions button[disabled] { background: #cbd5f5; cursor: not-allowed; }",
    ".proof { background: #f8fafc; padding: 1rem; border-radius: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem; }",
    "textarea { border: 1px solid #cbd5f5; border-radius: 0.45rem; padding: 0.5rem; font-size: 1rem; }",
    ".timeline { border-top: 1px dashed #cbd5f5; padding-top: 1rem; }"
  ]
})
export class DriverJobComponent implements OnInit {
  booking: Booking | null = null;
  readonly proofForm = this.fb.group({ proofText: [''], proofImage: [''] });
  readonly actions: BookingStatus[] = ['DRIVER_ARRIVED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/driver']);
      return;
    }
    const booking = this.bookingService.getById(id);
    if (!booking) {
      this.router.navigate(['/driver']);
      return;
    }
    this.booking = booking;
  }

  get nextStatus() {
    if (!this.booking) {
      return null;
    }
    const order: BookingStatus[] = ['DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    const currentIndex = order.indexOf(this.booking.status);
    if (currentIndex === -1) {
      return order[0];
    }
    return order[currentIndex + 1] ?? null;
  }

  update(status: BookingStatus) {
    if (!this.booking) {
      return;
    }
    this.bookingService.changeStatus(this.booking.id, status, this.booking.assignedDriverId ?? 'driver');
    this.booking = this.bookingService.getById(this.booking.id);
    this.toast.show(`Status updated to ${status}`, 'success');
  }

  submitProof() {
    if (!this.booking) {
      return;
    }
    const text = this.proofForm.controls.proofText.value?.trim();
    const image = this.proofForm.controls.proofImage.value?.trim();
    if (!text && !image) {
      this.toast.show('Add proof text or base64 image', 'warn');
      return;
    }
    const notes = [this.booking.goods.notes, text ? `Proof: ${text}` : null, image ? `Image: ${image}` : null]
      .filter(Boolean)
      .join(' | ');
    const updated: Booking = {
      ...this.booking,
      goods: { ...this.booking.goods, notes },
      statusHistory: [...this.booking.statusHistory]
    };
    this.bookingService.update(updated);
    this.booking = this.bookingService.getById(this.booking.id);
    this.toast.show('Proof saved', 'info');
  }
}
