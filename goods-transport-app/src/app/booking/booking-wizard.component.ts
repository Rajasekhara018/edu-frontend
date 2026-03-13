import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../core/vehicle.service';
import { PricingService } from '../core/pricing.service';
import { BookingService } from '../core/booking.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../shared/toast.service';
import { Booking, BookingStatus, PaymentMethod } from '../core/models';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="wizard-shell">
      <div class="wizard-head">
        <div>
          <p class="eyebrow">Freight booking studio</p>
          <h2>Book Transport</h2>
          <p>Four-step booking with a cleaner quote-to-confirm flow.</p>
        </div>
        <div class="wizard-summary" *ngIf="estimate">
          <span>Estimated total</span>
          <strong>₹{{ estimate.total | number: '1.0-0' }}</strong>
        </div>
      </div>
      <div class="steps">
        <span class="step" [class.active]="stepNumber === 1">1. Pickup & Drop</span>
        <span class="step" [class.active]="stepNumber === 2">2. Goods</span>
        <span class="step" [class.active]="stepNumber === 3">3. Vehicle</span>
        <span class="step" [class.active]="stepNumber === 4">4. Payment</span>
      </div>
      <form class="step-form" [formGroup]="currentForm" (ngSubmit)="next()">
        <ng-container [ngSwitch]="stepNumber">
          <ng-container *ngSwitchCase="1">
            <label>
              Pickup Address
              <input formControlName="pickupAddress" placeholder="Pickup address" />
            </label>
            <label>
              Pickup Contact Name
              <input formControlName="pickupContact" placeholder="Contact name" />
            </label>
            <label>
              Pickup Phone
              <input formControlName="pickupPhone" placeholder="Phone" />
            </label>
            <label>
              Drop Address
              <input formControlName="dropAddress" placeholder="Drop address" />
            </label>
            <label>
              Drop Contact Name
              <input formControlName="dropContact" placeholder="Contact name" />
            </label>
            <label>
              Drop Phone
              <input formControlName="dropPhone" placeholder="Phone" />
            </label>
          </ng-container>
          <ng-container *ngSwitchCase="2">
            <label>
              Goods Category
              <input formControlName="category" placeholder="Electronics" />
            </label>
            <label>
              Weight (kg)
              <input type="number" formControlName="weightKg" min="1" />
            </label>
            <label>
              Packages
              <input type="number" formControlName="packages" min="1" />
            </label>
            <label>
              Fragile
              <select formControlName="fragile">
                <option [value]="true">Yes</option>
                <option [value]="false">No</option>
              </select>
            </label>
            <label>
              Notes
              <textarea formControlName="notes" rows="2"></textarea>
            </label>
          </ng-container>
          <ng-container *ngSwitchCase="3">
            <label>
              Vehicle Type
              <select formControlName="vehicleType">
                <option value="" disabled>Select vehicle</option>
                <option *ngFor="let vehicle of vehicles" [value]="vehicle.id">{{ vehicle.name }} – Capacity {{ vehicle.capacityKg }}kg</option>
              </select>
            </label>
            <label>
              Distance (km)
              <input type="number" formControlName="distanceKm" min="1" />
            </label>
            <label>
              Pricing Rule
              <select formControlName="pricingRuleId">
                <option value="" disabled>Select rule</option>
                <option *ngFor="let rule of pricingRules" [value]="rule.id">{{ rule.name }}</option>
              </select>
            </label>
            <div class="estimate" *ngIf="estimate">
              <p>Estimate (Rule: {{ estimate.ruleName }} · Surge {{ estimate.surgeMultiplier }})</p>
              <p>Distance: {{ estimate.distanceKm }} km</p>
              <p>Total: ₹{{ estimate.total | number: '1.0-0' }}</p>
            </div>
          </ng-container>
          <ng-container *ngSwitchCase="4">
            <div class="review">
              <h3>Review</h3>
              <p><strong>Pickup:</strong> {{ pickupData.pickupAddress }} · {{ pickupData.pickupContact }}</p>
              <p><strong>Drop:</strong> {{ pickupData.dropAddress }} · {{ pickupData.dropContact }}</p>
              <p><strong>Goods:</strong> {{ goodsData.category }} · {{ goodsData.weightKg }}kg</p>
              <p><strong>Vehicle:</strong> {{ selectedVehicle?.name || '–' }}</p>
              <p><strong>Estimated total:</strong> ₹{{ estimate?.total | number: '1.0-0' }}</p>
            </div>
            <label>
              Payment method
              <select formControlName="method">
                <option *ngFor="let method of paymentMethods" [value]="method">{{ paymentLabel(method) }}</option>
              </select>
            </label>
            <div class="estimate payment-box">
              <p><strong>Payment status on booking:</strong> {{ selectedPaymentMethod === 'COD' ? 'Pending until collection' : 'Paid immediately' }}</p>
              <p *ngIf="selectedPaymentMethod !== 'COD'">The order will be saved as paid and visible to driver and admin.</p>
              <p *ngIf="selectedPaymentMethod === 'COD'">Customer can still pay later from booking details, or the order can remain cash on delivery.</p>
            </div>
          </ng-container>
        </ng-container>
        <div class="actions">
          <button type="button" (click)="previous()" [disabled]="stepNumber === 1">Back</button>
          <button type="submit">{{ stepNumber === 4 ? confirmLabel : 'Next' }}</button>
        </div>
      </form>
    </section>
  `,
  styles: [
    ".wizard-shell { background: rgba(255,255,255,0.92); padding: 1.5rem; border-radius: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid rgba(20,32,24,0.1); box-shadow: 0 18px 40px rgba(28,39,32,0.08); }",
    ".wizard-head { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }",
    ".wizard-head h2 { margin: 0.25rem 0 0.35rem; }",
    ".eyebrow { margin: 0; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: #ea580c; font-weight: 700; }",
    ".wizard-summary { background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 1px solid rgba(234,88,12,0.14); padding: 0.9rem 1rem; border-radius: 1rem; min-width: 220px; }",
    ".wizard-summary span { display: block; color: #526257; }",
    ".wizard-summary strong { font-size: 1.45rem; }",
    ".steps { display: flex; gap: 0.6rem; flex-wrap: wrap; }",
    ".step { padding: 0.55rem 0.95rem; border-radius: 999px; background: #fff7ed; font-size: 0.82rem; color: #ea580c; }",
    ".step.active { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }",
    ".step-form { display: flex; flex-direction: column; gap: 0.9rem; }",
    "label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }",
    "input, select, textarea { border: 1px solid rgba(20,32,24,0.14); border-radius: 0.75rem; padding: 0.65rem 0.8rem; font-size: 1rem; }",
    ".estimate, .review { background: #f8fbf9; padding: 0.95rem; border-radius: 1rem; border: 1px solid rgba(20,32,24,0.08); }",
    ".actions { display: flex; justify-content: flex-end; gap: 0.75rem; }",
    "button { padding: 0.75rem 1.2rem; border: none; border-radius: 999px; background: linear-gradient(135deg, #f97316, #ea580c); color: white; cursor: pointer; }",
    "button:disabled { background: #cbd5f5; cursor: not-allowed; }",
    "@media (max-width: 720px) { .wizard-head { flex-direction: column; } .wizard-summary { min-width: unset; width: 100%; } }"
  ]
})
export class BookingWizardComponent {
  readonly step = signal(1);
  readonly vehicleForm = this.fb.group({
    vehicleType: ['', Validators.required],
    distanceKm: [20, Validators.required],
    pricingRuleId: ['', Validators.required]
  });

  readonly pickupForm = this.fb.group({
    pickupAddress: ['', Validators.required],
    pickupContact: ['', Validators.required],
    pickupPhone: ['', Validators.required],
    dropAddress: ['', Validators.required],
    dropContact: ['', Validators.required],
    dropPhone: ['', Validators.required]
  });

  readonly goodsForm = this.fb.group({
    category: ['', Validators.required],
    weightKg: [1, [Validators.required, Validators.min(1)]],
    packages: [1, [Validators.required, Validators.min(1)]],
    fragile: ['false'],
    notes: ['']
  });

  readonly paymentMethods: PaymentMethod[] = ['UPI', 'CARD', 'NET_BANKING', 'COD'];
  readonly paymentForm = this.fb.group({
    method: ['UPI', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly vehicleService: VehicleService,
    private readonly pricingService: PricingService,
    private readonly bookingService: BookingService,
    private readonly auth: AuthService,
    private readonly toast: ToastService
  ) {
    const firstVehicle = this.vehicles[0];
    const firstRule = this.pricingRules[0];
    this.vehicleForm.patchValue({
      vehicleType: firstVehicle?.id ?? '',
      pricingRuleId: firstRule?.id ?? ''
    });
  }

  get stepNumber() {
    return this.step();
  }

  get vehicles() {
    return this.vehicleService.vehicles().filter((vehicle) => vehicle.enabled);
  }

  get pricingRules() {
    return this.pricingService.pricingRules();
  }

  get selectedVehicle() {
    const vehicleId = this.vehicleForm.controls.vehicleType.value;
    if (!vehicleId) {
      return null;
    }
    return this.vehicleService.getVehicleById(vehicleId);
  }

  get estimate() {
    const vehicle = this.selectedVehicle;
    if (!vehicle) {
      return null;
    }
    const distance = Number(this.vehicleForm.controls.distanceKm.value) || 0;
    const pricingRuleId = this.vehicleForm.controls.pricingRuleId.value;
    return this.pricingService.estimate(distance, vehicle, pricingRuleId || undefined);
  }

  get currentForm() {
    const map = [this.pickupForm, this.goodsForm, this.vehicleForm, this.paymentForm];
    return map[this.stepNumber - 1] ?? this.pickupForm;
  }

  get pickupData() {
    return this.pickupForm.value;
  }

  get goodsData() {
    return this.goodsForm.value;
  }

  get selectedPaymentMethod() {
    return (this.paymentForm.controls.method.value as PaymentMethod) || 'UPI';
  }

  get confirmLabel() {
    return this.selectedPaymentMethod === 'COD' ? 'Confirm booking' : 'Pay and confirm booking';
  }

  paymentLabel(method: PaymentMethod) {
    return method === 'NET_BANKING' ? 'Net banking' : method;
  }

  next() {
    if (this.stepNumber < 4) {
      if (this.currentForm.invalid) {
        this.toast.show('Complete the current step', 'warn');
        return;
      }
      this.step.update((value) => value + 1);
      return;
    }
    this.submitBooking();
  }

  previous() {
    if (this.stepNumber === 1) {
      return;
    }
    this.step.update((value) => value - 1);
  }

  private createId() {
    return `booking-${Math.random().toString(36).slice(2, 9)}`;
  }

  private submitBooking() {
    if (!this.estimate || !this.selectedVehicle) {
      this.toast.show('Unable to calculate price', 'error');
      return;
    }
    const userId = this.auth.session()?.id ?? 'anon';
    const pickupAddress = this.pickupForm.controls.pickupAddress.value?.trim() ?? '';
    const pickupContact = this.pickupForm.controls.pickupContact.value?.trim() ?? '';
    const pickupPhone = this.pickupForm.controls.pickupPhone.value?.trim() ?? '';
    const dropAddress = this.pickupForm.controls.dropAddress.value?.trim() ?? '';
    const dropContact = this.pickupForm.controls.dropContact.value?.trim() ?? '';
    const dropPhone = this.pickupForm.controls.dropPhone.value?.trim() ?? '';
    const goodsCategory = this.goodsForm.controls.category.value?.trim() ?? '';
    const goodsNotes = this.goodsForm.controls.notes.value?.trim();
    const paymentMethod = this.selectedPaymentMethod;
    const paidAt = paymentMethod === 'COD' ? undefined : Date.now();
    const booking: Booking = {
      id: this.createId(),
      createdAt: Date.now(),
      createdBy: userId,
      pickup: {
        address: pickupAddress,
        contactName: pickupContact,
        phone: pickupPhone
      },
      drop: {
        address: dropAddress,
        contactName: dropContact,
        phone: dropPhone
      },
      goods: {
        category: goodsCategory,
        weightKg: Number(this.goodsForm.controls.weightKg.value),
        packages: Number(this.goodsForm.controls.packages.value),
        fragile: this.goodsForm.controls.fragile.value === 'true',
        notes: goodsNotes || undefined
      },
      vehicle: {
        type: this.selectedVehicle.name,
        capacityKg: this.selectedVehicle.capacityKg
      },
      pricing: {
        distanceKm: this.estimate.distanceKm,
        baseFare: this.estimate.baseFare,
        perKmRate: this.estimate.perKmRate,
        tax: this.estimate.tax,
        total: this.estimate.total
      },
      payment: {
        status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        amount: this.estimate.total,
        method: paymentMethod,
        paidAt,
        paidBy: paidAt ? userId : undefined,
        transactionRef: paidAt ? `pay-${Math.random().toString(36).slice(2, 10)}` : undefined
      },
      status: 'CREATED',
      statusHistory: [{ status: 'CREATED' as BookingStatus, at: Date.now(), by: userId }]
    };
    this.bookingService.create(booking);
    this.toast.show(paymentMethod === 'COD' ? 'Booking saved with payment pending' : 'Booking saved and payment received', 'success');
    this.step.set(1);
    this.pickupForm.reset();
    this.goodsForm.reset({ category: '', weightKg: 1, packages: 1, fragile: 'false', notes: '' });
    this.paymentForm.reset({ method: 'UPI' });
    const firstVehicle = this.vehicles[0];
    const firstRule = this.pricingRules[0];
    this.vehicleForm.reset({ vehicleType: firstVehicle?.id ?? '', distanceKm: 20, pricingRuleId: firstRule?.id ?? '' });
  }
}
