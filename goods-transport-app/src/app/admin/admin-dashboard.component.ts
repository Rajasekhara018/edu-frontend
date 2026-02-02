import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../core/booking.service';
import { VehicleService } from '../core/vehicle.service';
import { PricingService } from '../core/pricing.service';
import { AuthService } from '../core/auth.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, ReactiveFormsModule],
  template: `
    <section class="admin-shell">
      <header>
        <h2>Admin Dashboard</h2>
        <p>Manage bookings, drivers, vehicles, and pricing rules locally.</p>
      </header>
      <div class="grid">
        <article class="panel">
          <h3>Stats</h3>
          <div class="rows">
            <div *ngFor="let stat of stats">
              <p>{{ stat.label }}</p>
              <strong>{{ stat.value }}</strong>
            </div>
          </div>
        </article>
        <article class="panel">
          <h3>Bookings</h3>
          <div *ngFor="let booking of bookings" class="booking-row">
            <div>
              <p class="muted">{{ booking.pickup.address }} → {{ booking.drop.address }}</p>
              <app-status-badge [status]="booking.status"></app-status-badge>
            </div>
            <div class="assign">
              <select [value]="booking.assignedDriverId" (change)="assignDriver(booking.id, $any($event.target).value)">
                <option value="">Assign driver</option>
                <option *ngFor="let driver of drivers" [value]="driver.id">{{ driver.name }}</option>
              </select>
            </div>
          </div>
        </article>
      </div>
      <div class="flex-sections">
        <article class="panel">
          <h3>Vehicle Types</h3>
          <form [formGroup]="vehicleForm" class="stack" (ngSubmit)="createVehicle()">
            <label>
              Name
              <input formControlName="name" />
            </label>
            <label>
              Capacity (kg)
              <input type="number" formControlName="capacityKg" />
            </label>
            <label>
              Base Fare
              <input type="number" formControlName="baseFare" />
            </label>
            <label>
              Per Km Rate
              <input type="number" formControlName="perKmRate" />
            </label>
            <button type="submit">Add vehicle</button>
          </form>
          <div *ngFor="let vehicle of vehicles" class="meta-row">
            <div>
              <strong>{{ vehicle.name }}</strong>
              <p class="muted">Capacity {{ vehicle.capacityKg }} kg</p>
            </div>
            <button type="button" (click)="toggleVehicle(vehicle.id)">{{ vehicle.enabled ? 'Disable' : 'Enable' }}</button>
          </div>
        </article>
        <article class="panel">
          <h3>Pricing Rules</h3>
          <form [formGroup]="pricingForm" class="stack" (ngSubmit)="submitPricing()">
            <label>
              Rule name
              <input formControlName="name" />
            </label>
            <label>
              Tax %
              <input type="number" formControlName="taxPercent" />
            </label>
            <label>
              Surge ×
              <input type="number" formControlName="surgeMultiplier" step="0.1" />
            </label>
            <button type="submit">{{ pricingForm.controls.id.value ? 'Update rule' : 'Add rule' }}</button>
          </form>
          <div *ngFor="let rule of pricingRules" class="meta-row">
            <div>
              <strong>{{ rule.name }}</strong>
              <p class="muted">Tax {{ rule.taxPercent }}% · Surge {{ rule.surgeMultiplier }}</p>
            </div>
            <button type="button" (click)="editRule(rule.id)">Edit</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    ".admin-shell { display: flex; flex-direction: column; gap: 1rem; background: white; padding: 1.5rem; border-radius: 1rem; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }",
    ".panel { background: #f8fafc; padding: 1rem; border-radius: 0.75rem; }",
    ".rows { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: 0.75rem; }",
    ".booking-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }",
    ".booking-row:last-child { border-bottom: none; }",
    ".assign select { border-radius: 0.5rem; border: 1px solid #cbd5f5; padding: 0.4rem 0.6rem; }",
    ".muted { margin: 0; font-size: 0.85rem; color: #475569; }",
    ".flex-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; }",
    ".stack { display: flex; flex-direction: column; gap: 0.6rem; }",
    "input { border: 1px solid #cbd5f5; border-radius: 0.5rem; padding: 0.45rem 0.6rem; }",
    "button { border: none; background: #2563eb; color: white; border-radius: 0.6rem; padding: 0.5rem 0.85rem; cursor: pointer; }",
    ".meta-row { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0; }",
    ".meta-row:last-child { border-bottom: none; }"
  ]
})
export class AdminDashboardComponent {
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

  get bookings() {
    return this.bookingService.bookings();
  }

  get stats() {
    const list = this.bookings;
    return [
      { label: 'Total bookings', value: list.length },
      { label: 'Created', value: list.filter((booking) => booking.status === 'CREATED').length },
      { label: 'In transit', value: list.filter((booking) => booking.status === 'IN_TRANSIT').length },
      { label: 'Delivered', value: list.filter((booking) => booking.status === 'DELIVERED').length }
    ];
  }

  get drivers() {
    return this.authService.getUsers().filter((user) => user.role === 'DRIVER');
  }

  assignDriver(bookingId: string, driverId: string) {
    if (!driverId) {
      return;
    }
    this.bookingService.assignDriver(bookingId, driverId);
    this.toast.show('Driver assigned', 'success');
  }

  get vehicles() {
    return this.vehicleService.vehicles();
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
    const newVehicle = {
      id: `vt-${Math.random().toString(36).slice(2, 8)}`,
      name,
      capacityKg,
      baseFare,
      perKmRate,
      enabled: true
    };
    this.vehicleService.addVehicle(newVehicle);
    this.toast.show('Vehicle type added', 'success');
    this.vehicleForm.reset({ name: '', capacityKg: 1000, baseFare: 500, perKmRate: 25 });
  }

  toggleVehicle(id: string) {
    this.vehicleService.toggleVehicle(id);
  }

  get pricingRules() {
    return this.pricingService.pricingRules();
  }

  editRule(id: string) {
    const rule = this.pricingRules.find((item) => item.id === id);
    if (!rule) {
      return;
    }
    this.pricingForm.setValue({ id: rule.id, name: rule.name, taxPercent: rule.taxPercent, surgeMultiplier: rule.surgeMultiplier });
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
