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
      <section class="job-hero">
        <div>
          <p class="eyebrow">Driver execution</p>
          <h2>Shipment {{ booking.id }}</h2>
          <p class="lead">
            Move this load through the assigned delivery stages, capture proof, and keep payment visibility clear for handoff.
          </p>
        </div>
        <div class="hero-side">
          <div class="amount-card">
            <span>Collected amount</span>
            <strong>₹{{ booking.payment.amount | number: '1.0-0' }}</strong>
            <small>{{ booking.payment.status }} · {{ paymentLabel(booking.payment.method) }}</small>
          </div>
          <app-status-badge [status]="booking.status"></app-status-badge>
        </div>
      </section>

      <section class="overview-grid">
        <article class="info-card">
          <p class="card-label">Pickup point</p>
          <h3>{{ booking.pickup.address }}</h3>
          <p>{{ booking.pickup.contactName }} · {{ booking.pickup.phone }}</p>
        </article>
        <article class="info-card">
          <p class="card-label">Drop point</p>
          <h3>{{ booking.drop.address }}</h3>
          <p>{{ booking.drop.contactName }} · {{ booking.drop.phone }}</p>
        </article>
        <article class="info-card">
          <p class="card-label">Load profile</p>
          <h3>{{ booking.goods.category }}</h3>
          <p>{{ booking.goods.weightKg }} kg · {{ booking.goods.packages }} packages</p>
        </article>
        <article class="info-card payment-card">
          <p class="card-label">Payment</p>
          <h3>{{ booking.payment.status }}</h3>
          <p>{{ paymentLabel(booking.payment.method) }} · Ref {{ booking.payment.transactionRef || 'Pending confirmation' }}</p>
        </article>
      </section>

      <section class="workspace-grid">
        <article class="surface">
          <div class="section-head">
            <div>
              <p class="eyebrow">Status control</p>
              <h3>Move shipment forward</h3>
            </div>
            <span class="next-chip" *ngIf="nextStatus">Next: {{ nextStatus.replace(/_/g, ' ') }}</span>
          </div>
          <div class="status-lane">
            <div
              *ngFor="let status of actions"
              class="status-step"
              [class.completed]="isCompleted(status)"
              [class.next]="canAdvance(status)"
            >
              {{ status.replace(/_/g, ' ') }}
            </div>
          </div>
          <div class="status-actions">
            <button type="button" class="advance-btn" (click)="advance()" [disabled]="!nextStatus">
              {{ nextStatus ? 'Mark as ' + nextStatus.replace(/_/g, ' ') : 'All steps completed' }}
            </button>
          </div>
        </article>

        <article class="surface proof-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Proof capture</p>
              <h3>Delivery confirmation</h3>
            </div>
          </div>
          <form [formGroup]="proofForm" class="proof" (ngSubmit)="submitProof()">
            <label>
              Notes / signature
              <textarea formControlName="proofText" rows="3" placeholder="Receiver name, signature note, package remarks"></textarea>
            </label>
            <label>
              Image base64 (optional)
              <textarea formControlName="proofImage" rows="3" placeholder="Paste captured proof string if available"></textarea>
            </label>
            <button type="submit">Save proof</button>
          </form>
        </article>
      </section>

      <article class="surface timeline">
        <div class="section-head">
          <div>
            <p class="eyebrow">Execution history</p>
            <h3>Timeline</h3>
          </div>
        </div>
        <app-timeline [events]="booking.statusHistory"></app-timeline>
      </article>
    </section>
    <ng-template #missing>
      <div class="empty">Booking not found or not assigned.</div>
    </ng-template>
  `,
  styles: [
    ".job-shell { display: flex; flex-direction: column; gap: 1.1rem; }",
    ".job-hero, .surface, .info-card { background: rgba(255,255,255,0.96); border: 1px solid rgba(15,23,42,0.08); border-radius: 1.35rem; box-shadow: 0 18px 44px rgba(15,23,42,0.08); }",
    ".job-hero { display: flex; justify-content: space-between; align-items: start; gap: 1rem; padding: 1.4rem; background: linear-gradient(135deg, #fffaf5 0%, #ffffff 42%, #f7fbff 100%); }",
    ".eyebrow { margin: 0 0 0.4rem; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.72rem; color: #ea580c; font-weight: 700; }",
    ".job-hero h2 { margin: 0; font-size: clamp(1.9rem, 3vw, 3rem); color: #0f172a; }",
    ".lead, .info-card p, .amount-card span, .amount-card small { color: #667085; }",
    ".lead { margin: 0.8rem 0 0; max-width: 62ch; line-height: 1.7; }",
    ".hero-side { display: flex; flex-direction: column; gap: 0.8rem; align-items: end; }",
    ".amount-card { min-width: 220px; padding: 1rem; border-radius: 1rem; background: #0f172a; color: white; display: grid; gap: 0.3rem; }",
    ".amount-card strong { font-size: 1.8rem; line-height: 1; }",
    ".amount-card span, .amount-card small { color: rgba(255,255,255,0.72); }",
    ".overview-grid, .workspace-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }",
    ".overview-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }",
    ".info-card { padding: 1rem; }",
    ".card-label { margin: 0 0 0.55rem; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem; color: #94a3b8; font-weight: 700; }",
    ".info-card h3 { margin: 0; color: #0f172a; font-size: 1.1rem; }",
    ".payment-card { background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%); }",
    ".surface { padding: 1.15rem; }",
    ".section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }",
    ".section-head h3 { margin: 0.15rem 0 0; color: #0f172a; font-size: 1.25rem; }",
    ".next-chip { display: inline-flex; align-items: center; padding: 0.35rem 0.7rem; border-radius: 999px; background: rgba(249,115,22,0.1); color: #c2410c; font-size: 0.76rem; font-weight: 700; }",
    ".status-lane { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }",
    ".status-step { padding: 0.9rem 1rem; border-radius: 1rem; background: #e2e8f0; color: #64748b; font-weight: 700; text-align: center; }",
    ".status-step.completed { background: linear-gradient(135deg, #0f766e, #0f9f88); color: white; }",
    ".status-step.next { background: linear-gradient(135deg, #f97316, #ea580c); color: white; box-shadow: 0 12px 24px rgba(249,115,22,0.2); }",
    ".status-actions { margin-top: 0.9rem; display: flex; }",
    ".advance-btn, .proof button { border: none; background: linear-gradient(135deg, #f97316, #ea580c); color: white; border-radius: 999px; padding: 0.85rem 1rem; cursor: pointer; font-weight: 700; }",
    ".advance-btn[disabled] { background: #cbd5e1; color: white; cursor: not-allowed; box-shadow: none; }",
    ".proof { display: flex; flex-direction: column; gap: 0.9rem; }",
    "label { display: flex; flex-direction: column; gap: 0.35rem; color: #475467; font-size: 0.84rem; font-weight: 600; }",
    "textarea { border: 1px solid rgba(15,23,42,0.12); border-radius: 0.8rem; padding: 0.75rem 0.85rem; font-size: 1rem; font: inherit; }",
    "textarea:focus { outline: none; border-color: #ea580c; box-shadow: 0 0 0 4px rgba(249,115,22,0.12); }",
    ".timeline { display: flex; flex-direction: column; gap: 0.75rem; }",
    ".empty { padding: 2rem; text-align: center; background: white; border-radius: 1rem; }",
    "@media (max-width: 1080px) { .overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .workspace-grid, .status-lane { grid-template-columns: 1fr; } }",
    "@media (max-width: 720px) { .job-hero { flex-direction: column; } .hero-side { width: 100%; align-items: stretch; } .overview-grid { grid-template-columns: 1fr; } .status-actions { flex-direction: column; } .advance-btn, .proof button { width: 100%; } }"
  ]
})
export class DriverJobComponent implements OnInit {
  booking: Booking | null = null;
  readonly proofForm = this.fb.group({ proofText: [''], proofImage: [''] });
  readonly actions: BookingStatus[] = ['DRIVER_ARRIVED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
  readonly progressOrder: BookingStatus[] = ['DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

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
    const currentIndex = this.progressOrder.indexOf(this.booking.status);
    if (currentIndex === -1) {
      return this.progressOrder[0];
    }
    return this.progressOrder[currentIndex + 1] ?? null;
  }

  canAdvance(status: BookingStatus) {
    return this.nextStatus === status;
  }

  isCompleted(status: BookingStatus) {
    if (!this.booking) {
      return false;
    }
    return this.progressOrder.indexOf(status) <= this.progressOrder.indexOf(this.booking.status);
  }

  update(status: BookingStatus) {
    if (!this.booking) {
      return;
    }
    if (!this.canAdvance(status)) {
      this.toast.show('Follow the delivery steps in order', 'warn');
      return;
    }
    const updated = this.bookingService.changeStatus(this.booking.id, status, this.booking.assignedDriverId ?? 'driver');
    if (!updated) {
      this.toast.show('Unable to update shipment status', 'error');
      return;
    }
    this.booking = updated;
    this.toast.show(`Status updated to ${status}`, 'success');
  }

  advance() {
    if (!this.nextStatus) {
      return;
    }
    this.update(this.nextStatus);
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

  paymentLabel(method: string) {
    return method === 'NET_BANKING' ? 'Net banking' : method;
  }
}
