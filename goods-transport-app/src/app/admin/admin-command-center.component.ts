import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../core/auth.service';
import { BookingService } from '../core/booking.service';
import { Booking, PricingRule, VehicleType } from '../core/models';
import { PricingService } from '../core/pricing.service';
import { VehicleService } from '../core/vehicle.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-admin-command-center',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent],
  template: `
    <section class="admin-shell">
      <section class="command-hero">
        <div class="hero-copy">
          <p class="eyebrow">Admin control tower</p>
          <h2>Run booking oversight, fleet readiness and rate governance from one workspace.</h2>
          <p class="lead">
            Review active demand, assign drivers, keep vehicle presets operational and maintain pricing rules without
            leaving the dashboard.
          </p>
          <div class="hero-badges">
            <span>Dispatch ready</span>
            <span>Role protected</span>
            <span>Local persistence</span>
          </div>
        </div>
        <div class="hero-metrics">
          <article class="metric-card" *ngFor="let stat of statCards">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.note }}</small>
          </article>
        </div>
      </section>

      <section class="highlights-grid">
        <article class="surface summary-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Operations snapshot</p>
              <h3>Today’s dispatch posture</h3>
            </div>
          </div>
          <div class="summary-grid">
            <div class="summary-item" *ngFor="let item of operationalHighlights">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
          <div class="activity-strip">
            <div class="activity-card" *ngFor="let item of activitySignals">
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </div>
          </div>
        </article>

        <article class="surface queue-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Dispatch queue</p>
              <h3>Booking assignment board</h3>
            </div>
            <span class="section-note">{{ bookings.length }} total bookings</span>
          </div>

          <div *ngIf="bookings.length; else emptyBookings" class="queue-list">
            <article class="queue-row" *ngFor="let booking of bookings">
              <div class="queue-copy">
                <div class="queue-topline">
                  <strong>{{ booking.pickup.address }} → {{ booking.drop.address }}</strong>
                  <app-status-badge [status]="booking.status"></app-status-badge>
                </div>
                <p>
                  {{ booking.goods.category }} · {{ booking.goods.weightKg }} kg · {{ booking.pricing.distanceKm }} km
                </p>
                <small>
                  {{ booking.assignedDriverId ? 'Assigned to ' + driverName(booking.assignedDriverId) : 'Awaiting driver allocation' }}
                </small>
                <small class="payment-note">
                  Payment {{ booking.payment.status }} · {{ paymentLabel(booking.payment.method) }} · ₹{{ booking.payment.amount | number: '1.0-0' }}
                </small>
              </div>
              <label class="queue-action">
                <span>Assign driver</span>
                <select [value]="booking.assignedDriverId ?? ''" (change)="assignDriver(booking.id, $any($event.target).value)">
                  <option value="">Select driver</option>
                  <option *ngFor="let driver of drivers" [value]="driver.id">{{ driver.name }}</option>
                </select>
              </label>
            </article>
          </div>

          <ng-template #emptyBookings>
            <div class="empty-state">No bookings available yet. New shipment requests will appear here for dispatch review.</div>
          </ng-template>
        </article>
      </section>

      <section class="workspace-grid">
        <article class="surface management-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Fleet management</p>
              <h3>Vehicle presets</h3>
            </div>
            <span class="section-note">{{ enabledVehicleCount }}/{{ vehicles.length }} active</span>
          </div>

          <form [formGroup]="vehicleForm" class="editor-form" (ngSubmit)="createVehicle()">
            <div class="field-grid">
              <label>
                <span>Name</span>
                <input formControlName="name" placeholder="Mini truck plus" />
              </label>
              <label>
                <span>Capacity (kg)</span>
                <input type="number" formControlName="capacityKg" />
              </label>
              <label>
                <span>Base fare</span>
                <input type="number" formControlName="baseFare" />
              </label>
              <label>
                <span>Per km rate</span>
                <input type="number" formControlName="perKmRate" />
              </label>
            </div>
            <button type="submit" class="primary-action">Add vehicle type</button>
          </form>

          <div class="record-list">
            <article class="record-row" *ngFor="let vehicle of vehicles">
              <div>
                <div class="record-topline">
                  <strong>{{ vehicle.name }}</strong>
                  <span class="state-chip" [class.off]="!vehicle.enabled">{{ vehicle.enabled ? 'Active' : 'Paused' }}</span>
                </div>
                <p>Capacity {{ vehicle.capacityKg }} kg · Base ₹{{ vehicle.baseFare }} · ₹{{ vehicle.perKmRate }}/km</p>
              </div>
              <button type="button" class="ghost-action" (click)="toggleVehicle(vehicle.id)">
                {{ vehicle.enabled ? 'Disable' : 'Enable' }}
              </button>
            </article>
          </div>
        </article>

        <article class="surface management-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Pricing governance</p>
              <h3>Rate profiles</h3>
            </div>
            <span class="section-note">{{ pricingRules.length }} rules</span>
          </div>

          <form [formGroup]="pricingForm" class="editor-form" (ngSubmit)="submitPricing()">
            <div class="field-grid pricing-grid">
              <label>
                <span>Rule name</span>
                <input formControlName="name" placeholder="Standard day shift" />
              </label>
              <label>
                <span>Tax %</span>
                <input type="number" formControlName="taxPercent" />
              </label>
              <label>
                <span>Surge multiplier</span>
                <input type="number" formControlName="surgeMultiplier" step="0.1" />
              </label>
            </div>
            <button type="submit" class="primary-action">
              {{ pricingForm.controls.id.value ? 'Update pricing rule' : 'Add pricing rule' }}
            </button>
          </form>

          <div class="record-list">
            <article class="record-row" *ngFor="let rule of pricingRules">
              <div>
                <div class="record-topline">
                  <strong>{{ rule.name }}</strong>
                  <span class="state-chip neutral">Tax {{ rule.taxPercent }}%</span>
                </div>
                <p>Surge multiplier {{ rule.surgeMultiplier }}x</p>
              </div>
              <button type="button" class="ghost-action" (click)="editRule(rule.id)">Edit</button>
            </article>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: [
    ".admin-shell { display: flex; flex-direction: column; gap: 1.2rem; }",
    ".surface, .command-hero { background: var(--panel-bg); border: 1px solid var(--border); border-radius: 1.45rem; box-shadow: var(--shadow); }",
    ".command-hero { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.95fr); gap: 1rem; padding: 1.35rem; background: radial-gradient(circle at top right, color-mix(in srgb, var(--brand) 18%, transparent), transparent 24%), linear-gradient(135deg, color-mix(in srgb, var(--brand-contrast) 38%, white) 0%, #ffffff 35%, color-mix(in srgb, var(--panel-bg) 84%, #f5faff) 100%); }",
    ".eyebrow { margin: 0 0 0.45rem; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.72rem; font-weight: 700; color: var(--brand-strong); }",
    ".hero-copy h2 { margin: 0; font-size: clamp(1.9rem, 3vw, 3rem); line-height: 1.08; color: var(--text); max-width: 14ch; }",
    ".lead { margin: 0.85rem 0 0; max-width: 62ch; color: var(--muted); line-height: 1.7; }",
    ".hero-badges { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1rem; }",
    ".hero-badges span, .state-chip { display: inline-flex; align-items: center; justify-content: center; padding: 0.42rem 0.78rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }",
    ".hero-badges span { background: var(--brand-soft); color: var(--brand-strong); }",
    ".hero-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }",
    ".metric-card { padding: 1rem; border-radius: 1rem; background: linear-gradient(180deg, color-mix(in srgb, var(--panel-strong-bg) 98%, black) 0%, var(--panel-strong-bg) 100%); color: var(--inverse-text); display: grid; gap: 0.35rem; }",
    ".metric-card span { color: var(--inverse-muted); font-size: 0.8rem; }",
    ".metric-card strong { font-size: 1.9rem; line-height: 1; }",
    ".metric-card small { color: var(--inverse-muted); line-height: 1.5; }",
    ".highlights-grid, .workspace-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; }",
    ".summary-panel, .queue-panel, .management-panel { padding: 1.25rem; }",
    ".section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }",
    ".section-head h3 { margin: 0.15rem 0 0; color: var(--text); }",
    ".section-note { color: var(--muted); font-size: 0.86rem; }",
    ".summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.85rem; }",
    ".summary-item { padding: 1rem; border-radius: 1rem; background: var(--panel-muted-bg); border: 1px solid var(--border); display: grid; gap: 0.45rem; }",
    ".summary-item span { color: var(--muted); font-size: 0.86rem; }",
    ".summary-item strong { font-size: 1.5rem; color: var(--text); }",
    ".activity-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.85rem; margin-top: 0.95rem; }",
    ".activity-card { padding: 1rem; border-radius: 1rem; background: linear-gradient(180deg, color-mix(in srgb, var(--brand-contrast) 40%, white) 0%, #ffffff 100%); border: 1px solid color-mix(in srgb, var(--brand) 16%, transparent); }",
    ".activity-card strong { color: var(--text); }",
    ".activity-card p { margin: 0.4rem 0 0; color: var(--muted); line-height: 1.6; }",
    ".queue-list, .record-list { display: flex; flex-direction: column; gap: 0.8rem; }",
    ".queue-row, .record-row { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); background: var(--panel-muted-bg); }",
    ".queue-copy, .queue-action, .record-row > div { min-width: 0; }",
    ".queue-topline, .record-topline { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }",
    ".queue-copy strong, .record-row strong { color: var(--text); }",
    ".queue-copy p, .queue-copy small, .record-row p { margin: 0.35rem 0 0; color: var(--muted); }",
    ".payment-note { font-weight: 700; color: var(--text); }",
    ".queue-action { display: grid; gap: 0.4rem; color: color-mix(in srgb, var(--text) 82%, white); font-size: 0.82rem; font-weight: 600; }",
    ".editor-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; padding: 1rem; border-radius: 1rem; background: linear-gradient(180deg, color-mix(in srgb, var(--brand-contrast) 36%, white) 0%, #ffffff 100%); border: 1px solid color-mix(in srgb, var(--brand) 16%, transparent); }",
    ".field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }",
    ".pricing-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
    "label { display: flex; flex-direction: column; gap: 0.35rem; color: color-mix(in srgb, var(--text) 82%, white); font-size: 0.84rem; font-weight: 600; }",
    "input, select { width: 100%; border: 1px solid var(--border); border-radius: 0.8rem; padding: 0.8rem 0.9rem; background: white; color: var(--text); font: inherit; }",
    "input:focus, select:focus { outline: none; border-color: var(--brand-strong); box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent); }",
    ".primary-action, .ghost-action { border: none; border-radius: 0.9rem; padding: 0.78rem 1rem; font: inherit; font-weight: 700; cursor: pointer; }",
    ".primary-action { background: linear-gradient(135deg, var(--brand), var(--brand-strong)); color: var(--inverse-text); box-shadow: 0 16px 30px color-mix(in srgb, var(--brand) 22%, transparent); }",
    ".ghost-action { background: color-mix(in srgb, var(--brand-contrast) 50%, white); color: var(--brand-strong); border: 1px solid color-mix(in srgb, var(--brand) 18%, transparent); }",
    ".state-chip { background: color-mix(in srgb, var(--brand) 14%, white); color: var(--brand-strong); }",
    ".state-chip.off { background: color-mix(in srgb, var(--text) 8%, white); color: var(--muted); }",
    ".state-chip.neutral { background: color-mix(in srgb, var(--text) 8%, white); color: color-mix(in srgb, var(--text) 78%, white); }",
    ".empty-state { padding: 1rem; border-radius: 1rem; background: var(--panel-muted-bg); color: var(--muted); border: 1px dashed var(--border); }",
    "@media (max-width: 1080px) { .command-hero, .highlights-grid, .workspace-grid, .summary-grid, .activity-strip { grid-template-columns: 1fr; } .hero-copy h2 { max-width: none; } .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }",
    "@media (max-width: 720px) { .hero-metrics, .field-grid, .pricing-grid { grid-template-columns: 1fr; } .queue-row, .record-row { flex-direction: column; align-items: stretch; } .queue-action { width: 100%; } .primary-action, .ghost-action { width: 100%; } }"
  ]
})
export class AdminCommandCenterComponent {
  readonly vehicleForm = this.fb.group({
    name: ['', Validators.required],
    capacityKg: [1000, Validators.required],
    baseFare: [500, Validators.required],
    perKmRate: [25, Validators.required]
  });

  readonly pricingForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    taxPercent: [12, Validators.required],
    surgeMultiplier: [1, Validators.required]
  });

  constructor(
    private readonly bookingService: BookingService,
    private readonly vehicleService: VehicleService,
    private readonly pricingService: PricingService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService
  ) {}

  get bookings(): Booking[] {
    return this.bookingService.bookings();
  }

  get drivers() {
    return this.authService.getUsers().filter((user) => user.role === 'DRIVER');
  }

  get vehicles(): VehicleType[] {
    return this.vehicleService.vehicles();
  }

  get pricingRules(): PricingRule[] {
    return this.pricingService.pricingRules();
  }

  get enabledVehicleCount() {
    return this.vehicles.filter((vehicle) => vehicle.enabled).length;
  }

  get statCards() {
    const list = this.bookings;
    return [
      { label: 'Total bookings', value: list.length, note: 'All shipment requests in the system' },
      { label: 'Created', value: list.filter((booking) => booking.status === 'CREATED').length, note: 'Awaiting dispatch action' },
      { label: 'Payments received', value: `₹${list.filter((booking) => booking.payment.status === 'PAID').reduce((sum, booking) => sum + booking.payment.amount, 0).toFixed(0)}`, note: 'Revenue captured across all bookings' },
      { label: 'Pending payments', value: list.filter((booking) => booking.payment.status === 'PENDING').length, note: 'Orders still awaiting payment' }
    ];
  }

  get operationalHighlights() {
    return [
      { label: 'Active drivers', value: this.drivers.length },
      { label: 'Fleet presets', value: this.vehicles.length },
      { label: 'Rate profiles', value: this.pricingRules.length },
      { label: 'Driver assigned', value: this.bookings.filter((booking) => booking.status === 'DRIVER_ASSIGNED').length }
    ];
  }

  get activitySignals() {
    return [
      {
        title: 'Dispatch workload',
        note: `${this.bookings.filter((booking) => !booking.assignedDriverId).length} bookings still need driver allocation`
      },
      {
        title: 'Fleet availability',
        note: `${this.enabledVehicleCount} vehicle presets are currently enabled for booking quotes`
      },
      {
        title: 'Pricing governance',
        note: `${this.pricingRules.length} pricing configurations are available for estimation`
      },
      {
        title: 'Payment visibility',
        note: `${this.bookings.filter((booking) => booking.payment.status === 'PAID').length} bookings are already marked paid`
      }
    ];
  }

  paymentLabel(method: string) {
    return method === 'NET_BANKING' ? 'Net banking' : method;
  }

  driverName(driverId?: string) {
    if (!driverId) {
      return 'Unassigned';
    }

    return this.drivers.find((driver) => driver.id === driverId)?.name ?? 'Assigned driver';
  }

  assignDriver(bookingId: string, driverId: string) {
    if (!driverId) {
      return;
    }

    this.bookingService.assignDriver(bookingId, driverId);
    this.toast.show('Driver assigned', 'success');
  }

  createVehicle() {
    if (this.vehicleForm.invalid) {
      this.toast.show('Fill vehicle fields', 'warn');
      return;
    }

    const name = this.vehicleForm.controls.name.value?.trim() ?? '';
    const capacityKg = Number(this.vehicleForm.controls.capacityKg.value) || 0;
    const baseFare = Number(this.vehicleForm.controls.baseFare.value) || 0;
    const perKmRate = Number(this.vehicleForm.controls.perKmRate.value) || 0;

    this.vehicleService.addVehicle({
      id: `vt-${Math.random().toString(36).slice(2, 8)}`,
      name,
      capacityKg,
      baseFare,
      perKmRate,
      enabled: true
    });
    this.toast.show('Vehicle type added', 'success');
    this.vehicleForm.reset({ name: '', capacityKg: 1000, baseFare: 500, perKmRate: 25 });
  }

  toggleVehicle(id: string) {
    this.vehicleService.toggleVehicle(id);
  }

  editRule(id: string) {
    const rule = this.pricingRules.find((item) => item.id === id);
    if (!rule) {
      return;
    }

    this.pricingForm.setValue({
      id: rule.id,
      name: rule.name,
      taxPercent: rule.taxPercent,
      surgeMultiplier: rule.surgeMultiplier
    });
  }

  submitPricing() {
    if (this.pricingForm.invalid) {
      this.toast.show('Complete pricing rule data', 'warn');
      return;
    }

    const values = this.pricingForm.value;
    const name = values.name ?? '';
    const taxPercent = Number(values.taxPercent);
    const surgeMultiplier = Number(values.surgeMultiplier);

    if (values.id) {
      this.pricingService.updateRule({ id: values.id, name, taxPercent, surgeMultiplier });
      this.toast.show('Pricing rule updated', 'success');
    } else {
      this.pricingService.addRule({ id: `pr-${Math.random().toString(36).slice(2, 8)}`, name, taxPercent, surgeMultiplier });
      this.toast.show('Pricing rule added', 'success');
    }

    this.pricingForm.reset({ id: '', name: '', taxPercent: 12, surgeMultiplier: 1 });
  }
}
