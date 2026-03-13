import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingService } from '../core/booking.service';
import { PricingService } from '../core/pricing.service';
import { VehicleService } from '../core/vehicle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home-shell">
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Logistics control tower</p>
          <h1>Freight booking, shipment tracking and dispatch operations in one Angular application.</h1>
          <p class="lead">
            This platform is built for customer booking, driver execution and admin operations. The public home page
            explains the capability set, while secure workflows remain behind login for customer, driver and admin users.
          </p>
          <div class="hero-actions">
            <a class="primary-btn" routerLink="/auth">Login to continue</a>
            <a class="ghost-btn" routerLink="/auth">View role-based access</a>
          </div>
          <div class="module-grid">
            <div class="module-card" *ngFor="let item of platformModules">
              <strong>{{ item.title }}</strong>
              <p>{{ item.body }}</p>
            </div>
          </div>
        </div>

        <div class="hero-panel">
          <p class="panel-title">Operational snapshot</p>
          <div class="stat-grid">
            <div class="stat-card" *ngFor="let stat of stats">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
          <div class="enterprise-strip">
            <div *ngFor="let item of enterpriseStats" class="enterprise-item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="showcase-grid">
        <article class="feature-stack">
          <div class="section-heading">
            <h2>Application capabilities</h2>
            <a routerLink="/auth">Secure login</a>
          </div>
          <div class="feature-card" *ngFor="let item of operationsCards">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </article>

        <article class="vehicle-stack">
          <div class="section-heading">
            <h2>Fleet and pricing model</h2>
            <a routerLink="/auth">Open booking flow</a>
          </div>
          <div class="vehicle-card" *ngFor="let vehicle of featuredVehicles">
            <div>
              <p class="vehicle-name">{{ vehicle.name }}</p>
              <p class="vehicle-copy">Capacity {{ vehicle.capacityKg }} kg · Base ₹{{ vehicle.baseFare }} · ₹{{ vehicle.perKmRate }}/km</p>
            </div>
            <span class="vehicle-state" [class.disabled]="!vehicle.enabled">{{ vehicle.enabled ? 'Available' : 'Paused' }}</span>
          </div>
        </article>
      </section>

      <section class="quick-section">
        <div class="section-heading">
          <h2>Role-based workflow</h2>
          <p>Each operational area requires login and only appears after authentication.</p>
        </div>
        <div class="quick-links">
          <a class="quick-card" *ngFor="let item of quickLinks" routerLink="/auth">
            <div>
              <span>{{ item.label }}</span>
              <p>{{ item.caption }}</p>
            </div>
            <strong>Login</strong>
          </a>
        </div>
      </section>

      <section class="status-section">
        <div class="section-heading">
          <h2>Shipment lifecycle</h2>
          <p>The application tracks operational milestones from request creation through delivery.</p>
        </div>
        <div class="status-grid">
          <div class="status-card" *ngFor="let lane of statusLanes; let i = index">
            <span class="status-index">0{{ i + 1 }}</span>
            <h3>{{ lane.label }}</h3>
            <p>{{ lane.note }}</p>
          </div>
        </div>
      </section>

      <section class="support-section">
        <div class="section-heading">
          <h2>Support and exception handling</h2>
          <p>Shipment records are structured for escalations, route changes and delivery follow-up.</p>
        </div>
        <div class="support-grid">
          <div class="support-card" *ngFor="let item of supportCards">
            <h3>{{ item.title }}</h3>
            <p *ngFor="let line of item.lines">{{ line }}</p>
          </div>
        </div>
      </section>
    </section>
  `
})
export class HomeComponent {
  readonly operationsCards = [
    { title: 'Track shipments', text: 'Lookup a booking by booking ID, route keyword or contact phone and jump directly to the movement record.' },
    { title: 'Calculate freight', text: 'Review fleet options, distance-linked pricing rules and transparent totals before dispatch.' },
    { title: 'Manage pickups', text: 'Structure pickup and drop contacts clearly so driver and customer handoffs stay operationally clean.' }
  ];

  readonly supportCards = [
    { title: 'Support desk', lines: ['Raise booking issues and route corrections', 'Built for quick ticket-style follow-up on active loads'] },
    { title: 'Pickup readiness', lines: ['Pickup contact, phone and address captured in one workflow', 'Cleaner warehouse handoff and dispatch prep'] },
    { title: 'Operational visibility', lines: ['Created, assigned, in-transit and delivered milestones', 'Status-first layout across customer and driver views'] }
  ];

  readonly quickLinks = [
    { label: 'Customer workspace', caption: 'Secure booking and shipment history for customers' },
    { label: 'Driver workspace', caption: 'Assigned jobs, milestones and proof updates' },
    { label: 'Admin workspace', caption: 'Fleet, pricing and control-tower management' }
  ];

  readonly statusLanes = [
    { label: 'Created', note: 'Shipment request captured and awaiting assignment' },
    { label: 'Driver assigned', note: 'Fleet aligned and ready for pickup coordination' },
    { label: 'In transit', note: 'Movement underway with active milestone progression' },
    { label: 'Delivered', note: 'Job completed and visible in booking history' }
  ];

  readonly enterpriseStats = [
    { label: 'Coverage model', value: 'B2B cargo' },
    { label: 'Support mode', value: 'Ticket-ready' },
    { label: 'Lookup flow', value: 'Track-first' }
  ];

  readonly platformModules = [
    { title: 'Public landing', body: 'Describe capabilities, workflow and module structure before users authenticate.' },
    { title: 'Role-based security', body: 'Customer, driver, admin and booking workflows are protected behind login.' },
    { title: 'Operational data', body: 'Bookings, rate cards, vehicle presets and milestones run on the same local data model.' }
  ];

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly bookingService: BookingService,
    private readonly pricingService: PricingService
  ) {}

  get featuredVehicles() {
    return this.vehicleService.vehicles().slice(0, 3);
  }

  get stats() {
    const vehicles = this.vehicleService.vehicles();
    const bookings = this.bookingService.bookings();
    const rules = this.pricingService.pricingRules();
    return [
      { value: `${vehicles.length}`, label: 'Fleet presets' },
      { value: `${bookings.length}`, label: 'Bookings created' },
      { value: `${bookings.filter((item) => item.status === 'IN_TRANSIT').length}`, label: 'Loads in transit' },
      { value: `${rules.length}`, label: 'Pricing profiles' }
    ];
  }
}
