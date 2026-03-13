import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingService } from '../core/booking.service';
import { PricingService } from '../core/pricing.service';
import { VehicleService } from '../core/vehicle.service';

@Component({
  selector: 'app-home-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="landing-shell">
      <section class="hero-grid">
        <article class="hero-panel">
          <p class="eyebrow">Logistics platform</p>
          <h1>Professional goods movement, booking control and dispatch visibility in one place.</h1>
          <p class="lead">
            GoodsGo is structured as a role-based transport operations platform. Customers create and track loads,
            drivers execute assigned jobs, and administrators manage pricing, fleet presets and dispatch decisions.
          </p>

          <div class="hero-actions">
            <a class="primary-cta" routerLink="/auth">Enter secure workspace</a>
            <a class="secondary-cta" routerLink="/auth">Review access roles</a>
          </div>

          <div class="signal-grid">
            <article class="signal-card" *ngFor="let item of platformSignals">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <p>{{ item.note }}</p>
            </article>
          </div>
        </article>

        <aside class="snapshot-panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Operational snapshot</p>
              <h2>Platform posture</h2>
            </div>
            <span class="head-chip">Live local data</span>
          </div>

          <div class="metric-grid">
            <article class="metric-card" *ngFor="let stat of stats">
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
            </article>
          </div>

          <div class="assurance-list">
            <article class="assurance-card" *ngFor="let item of assuranceNotes">
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </article>
          </div>
        </aside>
      </section>

      <section class="content-grid">
        <article class="surface capability-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Core capabilities</p>
              <h2>Public overview of what the application does</h2>
            </div>
            <span class="section-kicker">Structured for customer, driver and admin workflows</span>
          </div>

          <div class="capability-list">
            <article class="capability-card" *ngFor="let item of capabilityCards">
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </article>

        <article class="surface fleet-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Fleet and pricing</p>
              <h2>Ready vehicle presets</h2>
            </div>
            <a routerLink="/auth">Open booking flow</a>
          </div>

          <div class="fleet-list">
            <article class="fleet-card" *ngFor="let vehicle of featuredVehicles">
              <div>
                <strong>{{ vehicle.name }}</strong>
                <p>Capacity {{ vehicle.capacityKg }} kg · Base Rs {{ vehicle.baseFare }} · Rs {{ vehicle.perKmRate }}/km</p>
              </div>
              <span class="state-chip" [class.off]="!vehicle.enabled">{{ vehicle.enabled ? 'Available' : 'Paused' }}</span>
            </article>
          </div>
        </article>
      </section>

      <section class="surface role-panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">Access model</p>
            <h2>Role-based operational workspaces</h2>
          </div>
          <p class="section-copy">The home page is public. Customer, driver, admin and booking areas require login.</p>
        </div>

        <div class="role-grid">
          <a class="role-card" *ngFor="let role of roleCards" routerLink="/auth">
            <div>
              <strong>{{ role.title }}</strong>
              <p>{{ role.text }}</p>
            </div>
            <span>Login</span>
          </a>
        </div>
      </section>

      <section class="content-grid lower-grid">
        <article class="surface lifecycle-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Shipment lifecycle</p>
              <h2>Operational milestones</h2>
            </div>
          </div>

          <div class="timeline-grid">
            <article class="timeline-card" *ngFor="let lane of lifecycle; let i = index">
              <span class="timeline-index">0{{ i + 1 }}</span>
              <strong>{{ lane.label }}</strong>
              <p>{{ lane.note }}</p>
            </article>
          </div>
        </article>

        <article class="surface governance-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Governance and support</p>
              <h2>Operational discipline</h2>
            </div>
          </div>

          <div class="governance-list">
            <article class="governance-card" *ngFor="let item of governanceCards">
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </article>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: [
    ".landing-shell { display: flex; flex-direction: column; gap: 1.25rem; }",
    ".hero-grid, .content-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.8fr); gap: 1.25rem; }",
    ".surface, .hero-panel, .snapshot-panel { background: rgba(255,255,255,0.96); border: 1px solid rgba(15,23,42,0.08); border-radius: 1.5rem; box-shadow: 0 22px 48px rgba(15,23,42,0.08); }",
    ".hero-panel { padding: 1.5rem; background: linear-gradient(135deg, #fffaf5 0%, #ffffff 42%, #f8fbff 100%); }",
    ".snapshot-panel, .capability-panel, .fleet-panel, .role-panel, .lifecycle-panel, .governance-panel { padding: 1.35rem; }",
    ".eyebrow { margin: 0 0 0.5rem; color: #ea580c; text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.72rem; font-weight: 700; }",
    ".hero-panel h1 { margin: 0; max-width: 12ch; font-size: clamp(2.5rem, 5vw, 4.6rem); line-height: 0.98; letter-spacing: -0.05em; color: #0f172a; }",
    ".lead, .section-copy, .capability-card p, .fleet-card p, .timeline-card p, .governance-card p, .signal-card p, .assurance-card p, .role-card p { color: #667085; line-height: 1.7; }",
    ".lead { max-width: 62ch; margin: 1rem 0 0; }",
    ".hero-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.25rem; }",
    ".primary-cta, .secondary-cta, .section-head a, .role-card { text-decoration: none; }",
    ".primary-cta, .secondary-cta { display: inline-flex; align-items: center; justify-content: center; padding: 0.95rem 1.2rem; border-radius: 999px; font-weight: 700; }",
    ".primary-cta { background: linear-gradient(135deg, #f97316, #ea580c); color: white; box-shadow: 0 18px 34px rgba(249,115,22,0.22); }",
    ".secondary-cta { border: 1px solid rgba(15,23,42,0.12); color: #0f172a; background: white; }",
    ".signal-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; margin-top: 1.4rem; }",
    ".signal-card { padding: 1rem; border-radius: 1.05rem; background: rgba(15,23,42,0.03); border: 1px solid rgba(15,23,42,0.06); }",
    ".signal-card span, .metric-card span { color: #667085; font-size: 0.82rem; }",
    ".signal-card strong { display: block; margin-top: 0.45rem; font-size: 1.25rem; color: #0f172a; }",
    ".signal-card p { margin: 0.5rem 0 0; }",
    ".panel-head, .section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }",
    ".panel-head h2, .section-head h2 { margin: 0.1rem 0 0; color: #0f172a; font-size: 1.9rem; line-height: 1.1; }",
    ".head-chip, .state-chip { display: inline-flex; align-items: center; justify-content: center; padding: 0.45rem 0.8rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }",
    ".head-chip { background: rgba(15,23,42,0.06); color: #334155; }",
    ".metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }",
    ".metric-card { padding: 1rem; border-radius: 1rem; background: #0f172a; display: grid; gap: 0.35rem; }",
    ".metric-card strong { color: white; font-size: 2rem; line-height: 1; }",
    ".assurance-list, .capability-list, .fleet-list, .governance-list { display: flex; flex-direction: column; gap: 0.85rem; }",
    ".assurance-list { margin-top: 1rem; }",
    ".assurance-card, .capability-card, .fleet-card, .governance-card, .timeline-card, .role-card { padding: 1rem; border-radius: 1rem; border: 1px solid rgba(15,23,42,0.08); background: #fbfdff; }",
    ".assurance-card strong, .capability-card strong, .fleet-card strong, .governance-card strong, .timeline-card strong, .role-card strong { color: #0f172a; }",
    ".assurance-card p, .capability-card p, .fleet-card p, .governance-card p, .timeline-card p { margin: 0.45rem 0 0; }",
    ".section-kicker { color: #667085; font-size: 0.9rem; max-width: 24ch; }",
    ".fleet-panel .section-head a { color: #ea580c; font-weight: 700; }",
    ".fleet-card, .role-card { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }",
    ".state-chip { background: rgba(16,185,129,0.12); color: #047857; }",
    ".state-chip.off { background: rgba(15,23,42,0.08); color: #475467; }",
    ".role-grid, .timeline-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }",
    ".role-card { color: inherit; transition: transform 0.2s ease, border-color 0.2s ease; }",
    ".role-card:hover { transform: translateY(-2px); border-color: rgba(249,115,22,0.28); }",
    ".role-card span { color: #ea580c; font-weight: 700; }",
    ".lower-grid { grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr); }",
    ".timeline-card { background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%); }",
    ".timeline-index { display: inline-flex; margin-bottom: 0.9rem; padding: 0.3rem 0.55rem; border-radius: 999px; background: rgba(249,115,22,0.12); color: #c2410c; font-size: 0.74rem; font-weight: 700; }",
    "@media (max-width: 1080px) { .hero-grid, .content-grid, .lower-grid, .role-grid, .timeline-grid, .signal-grid { grid-template-columns: 1fr; } .hero-panel h1 { max-width: none; } }",
    "@media (max-width: 720px) { .metric-grid { grid-template-columns: 1fr; } .fleet-card, .role-card { flex-direction: column; align-items: flex-start; } .hero-actions { flex-direction: column; } .primary-cta, .secondary-cta { width: 100%; } }"
  ]
})
export class HomeLandingComponent {
  readonly platformSignals = [
    { label: 'Coverage model', value: 'B2B cargo', note: 'Designed for structured city and intercity goods movement workflows.' },
    { label: 'Support posture', value: 'Exception ready', note: 'Built to surface booking issues, changes and follow-up handling clearly.' },
    { label: 'Security model', value: 'Role based', note: 'Operational workspaces are protected and routed after authentication.' }
  ];

  readonly assuranceNotes = [
    { title: 'Public landing page', note: 'Only the application overview is visible here. Operational workspaces remain protected.' },
    { title: 'Unified data model', note: 'Vehicles, pricing rules, bookings and milestones operate on the same application dataset.' },
    { title: 'Track-first workflow', note: 'Search, booking creation, driver assignment and delivery visibility follow one operational chain.' }
  ];

  readonly capabilityCards = [
    { title: 'Shipment booking', text: 'Customers can create freight requests with pickup, drop, goods and vehicle selections in a guided workflow.' },
    { title: 'Tracking and lookup', text: 'Bookings can be located by shipment identifier, route details, contact numbers or goods type.' },
    { title: 'Dispatch administration', text: 'Administrators review demand, assign drivers, maintain vehicle presets and govern pricing configurations.' }
  ];

  readonly roleCards = [
    { title: 'Customer workspace', text: 'Create shipments, review booking history and track active movements.' },
    { title: 'Driver workspace', text: 'See assigned jobs, update milestones and confirm progress from pickup to delivery.' },
    { title: 'Admin workspace', text: 'Manage dispatch control, vehicle availability and pricing rules from a central console.' }
  ];

  readonly lifecycle = [
    { label: 'Created', note: 'The shipment request is captured and becomes visible for operational review.' },
    { label: 'Driver assigned', note: 'Dispatch allocates a driver and moves the booking into execution readiness.' },
    { label: 'In transit', note: 'The job is active with movement updates and status progression across the route.' },
    { label: 'Delivered', note: 'Completion is recorded and remains visible in booking history and operational reporting.' }
  ];

  readonly governanceCards = [
    { title: 'Support desk discipline', note: 'The data model supports booking clarifications, operational follow-up and route exceptions.' },
    { title: 'Pickup readiness', note: 'Pickup and drop contacts are captured clearly to reduce handoff ambiguity during dispatch.' },
    { title: 'Pricing governance', note: 'Vehicle presets and rate profiles are maintained in a structured administrative flow.' }
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
      { value: `${rules.length}`, label: 'Pricing rules' }
    ];
  }
}
