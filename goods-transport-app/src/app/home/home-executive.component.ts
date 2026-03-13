import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingService } from '../core/booking.service';
import { PricingService } from '../core/pricing.service';
import { VehicleService } from '../core/vehicle.service';

@Component({
  selector: 'app-home-executive',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="executive-shell">
      <section class="executive-hero">
        <article class="hero-main">
          <p class="eyebrow">Logistics platform</p>
          <h1>Professional freight booking, shipment visibility and dispatch control.</h1>
          <p class="lead">
            GoodsGo is a structured transport operations application for customers, drivers and administrators. The
            public homepage explains the platform. Secure workspaces open only after login.
          </p>

          <div class="hero-actions">
            <a class="primary-cta" routerLink="/auth">Enter secure workspace</a>
            <a class="secondary-cta" routerLink="/auth">View access roles</a>
          </div>

          <div class="hero-points">
            <article class="point-card" *ngFor="let item of heroPoints">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <p>{{ item.note }}</p>
            </article>
          </div>
        </article>

        <aside class="hero-side">
          <div class="side-panel side-panel-dark">
            <div class="panel-head">
              <div>
                <p class="eyebrow light">Operational snapshot</p>
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
          </div>

          <div class="side-panel">
            <div class="side-list">
              <article class="assurance-card" *ngFor="let item of assuranceNotes">
                <strong>{{ item.title }}</strong>
                <p>{{ item.note }}</p>
              </article>
            </div>
          </div>
        </aside>
      </section>

      <section class="board-grid">
        <article class="surface wide-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Core capabilities</p>
              <h2>What the application is built to do</h2>
            </div>
            <span class="section-copy">Designed around booking, execution and administrative control</span>
          </div>

          <div class="capability-grid">
            <article class="capability-card" *ngFor="let item of capabilityCards">
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </article>

        <article class="surface narrow-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Fleet and pricing</p>
              <h2>Vehicle presets</h2>
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

      <section class="surface role-surface">
        <div class="section-head">
          <div>
            <p class="eyebrow">Access model</p>
            <h2>Role-based workspaces</h2>
          </div>
          <p class="section-copy">Customers, drivers, admins and booking flows require authentication.</p>
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

      <section class="board-grid lower-grid">
        <article class="surface wide-panel">
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

        <article class="surface narrow-panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">Governance and support</p>
              <h2>Operational discipline</h2>
            </div>
          </div>

          <div class="support-list">
            <article class="support-card" *ngFor="let item of governanceCards">
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </article>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: [
    ".executive-shell { width: 100%; display: flex; flex-direction: column; gap: 1.6rem; }",
    ".executive-hero, .board-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(380px, 0.85fr); gap: 1.5rem; }",
    ".surface, .hero-main, .side-panel { background: rgba(255,255,255,0.97); border: 1px solid rgba(15,23,42,0.08); border-radius: 1.65rem; box-shadow: 0 26px 60px rgba(15,23,42,0.08); }",
    ".hero-main { padding: 2.25rem; background: radial-gradient(circle at top right, rgba(251,146,60,0.16), transparent 24%), linear-gradient(135deg, #fff8f3 0%, #ffffff 42%, #f7fbff 100%); }",
    ".hero-side, .fleet-list, .support-list { display: flex; flex-direction: column; gap: 1rem; }",
    ".side-panel, .wide-panel, .narrow-panel, .role-surface { padding: 1.5rem; }",
    ".side-panel-dark { background: linear-gradient(180deg, #0f172a 0%, #16243a 100%); border-color: rgba(255,255,255,0.06); }",
    ".eyebrow { margin: 0 0 0.55rem; color: #ea580c; text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.74rem; font-weight: 700; }",
    ".eyebrow.light { color: #fdba74; }",
    ".hero-main h1 { margin: 0; max-width: 10.2ch; font-size: clamp(3.4rem, 5vw, 5.8rem); line-height: 0.93; letter-spacing: -0.07em; color: #0f172a; }",
    ".lead, .section-copy, .capability-card p, .fleet-card p, .support-card p, .timeline-card p, .point-card p, .assurance-card p, .role-card p { color: #667085; line-height: 1.75; }",
    ".lead { max-width: 66ch; margin: 1.15rem 0 0; font-size: 1.05rem; }",
    ".hero-actions { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 1.7rem; }",
    ".primary-cta, .secondary-cta, .role-card, .section-head a { text-decoration: none; }",
    ".primary-cta, .secondary-cta { display: inline-flex; align-items: center; justify-content: center; padding: 1rem 1.35rem; border-radius: 999px; font-weight: 700; }",
    ".primary-cta { background: linear-gradient(135deg, #f97316, #ea580c); color: white; box-shadow: 0 20px 40px rgba(249,115,22,0.22); }",
    ".secondary-cta { background: white; color: #0f172a; border: 1px solid rgba(15,23,42,0.12); }",
    ".hero-points { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1.8rem; }",
    ".point-card, .assurance-card, .capability-card, .fleet-card, .support-card, .timeline-card, .role-card { padding: 1.15rem; border-radius: 1.15rem; border: 1px solid rgba(15,23,42,0.08); background: #fbfdff; }",
    ".point-card span, .metric-card span { color: #94a3b8; font-size: 0.82rem; }",
    ".point-card strong { display: block; margin-top: 0.4rem; color: #0f172a; font-size: 1.35rem; }",
    ".point-card p { margin: 0.45rem 0 0; }",
    ".panel-head, .section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1.1rem; }",
    ".panel-head h2, .section-head h2 { margin: 0.05rem 0 0; color: #0f172a; font-size: 2.2rem; line-height: 1.02; letter-spacing: -0.03em; }",
    ".side-panel-dark h2 { color: white; }",
    ".head-chip, .state-chip { display: inline-flex; align-items: center; justify-content: center; padding: 0.45rem 0.8rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }",
    ".head-chip { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.82); }",
    ".metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; }",
    ".metric-card { padding: 1.05rem; border-radius: 1.1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); }",
    ".metric-card strong { display: block; margin-top: 0.45rem; color: white; font-size: 2.35rem; line-height: 1; }",
    ".capability-grid, .role-grid, .timeline-grid { display: grid; gap: 1rem; }",
    ".capability-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
    ".section-copy { max-width: 28ch; }",
    ".section-head a { color: #ea580c; font-weight: 700; }",
    ".fleet-card, .role-card { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }",
    ".state-chip { background: rgba(16,185,129,0.12); color: #047857; }",
    ".state-chip.off { background: rgba(15,23,42,0.08); color: #475467; }",
    ".role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
    ".role-card { color: inherit; transition: transform 0.2s ease, border-color 0.2s ease; }",
    ".role-card:hover { transform: translateY(-2px); border-color: rgba(249,115,22,0.28); }",
    ".role-card span { color: #ea580c; font-weight: 700; }",
    ".lower-grid { grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.85fr); }",
    ".timeline-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }",
    ".timeline-card { min-height: 205px; background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%); }",
    ".timeline-index { display: inline-flex; margin-bottom: 0.9rem; padding: 0.3rem 0.55rem; border-radius: 999px; background: rgba(249,115,22,0.12); color: #c2410c; font-size: 0.74rem; font-weight: 700; }",
    "@media (max-width: 1180px) { .executive-hero, .board-grid, .lower-grid, .capability-grid, .role-grid, .timeline-grid, .hero-points { grid-template-columns: 1fr; } .hero-main h1 { max-width: none; } }",
    "@media (max-width: 720px) { .metric-grid { grid-template-columns: 1fr; } .hero-actions { flex-direction: column; } .primary-cta, .secondary-cta { width: 100%; } .fleet-card, .role-card { flex-direction: column; align-items: flex-start; } .hero-main, .side-panel, .wide-panel, .narrow-panel, .role-surface { padding: 1.2rem; } }"
  ]
})
export class HomeExecutiveComponent {
  readonly heroPoints = [
    { label: 'Coverage model', value: 'B2B cargo', note: 'Built for structured city and intercity goods movement workflows.' },
    { label: 'Support posture', value: 'Exception ready', note: 'Designed to handle booking clarifications and operational follow-up.' },
    { label: 'Security model', value: 'Role based', note: 'Workspaces are protected and routed after authentication.' }
  ];

  readonly assuranceNotes = [
    { title: 'Public landing only', note: 'This homepage explains the platform. Operational workspaces remain protected.' },
    { title: 'Unified data model', note: 'Vehicles, pricing rules, bookings and milestones operate on one application dataset.' },
    { title: 'Track-first workflow', note: 'Search, booking creation, driver assignment and delivery visibility follow one operational chain.' }
  ];

  readonly capabilityCards = [
    { title: 'Shipment booking', text: 'Customers create freight requests with pickup, drop, goods and vehicle selections in a guided workflow.' },
    { title: 'Tracking and lookup', text: 'Bookings can be located by shipment identifier, route details, contact numbers or goods type.' },
    { title: 'Dispatch administration', text: 'Administrators review demand, assign drivers, maintain vehicle presets and govern pricing configurations.' }
  ];

  readonly roleCards = [
    { title: 'Customer workspace', text: 'Create shipments, review booking history and track active movement records.' },
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
