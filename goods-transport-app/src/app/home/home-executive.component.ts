import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppProfileConfigService } from '../core/app-profile-config.service';
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
          <p class="eyebrow">{{ homeContent.eyebrow }}</p>
          <h1>{{ homeContent.title }}</h1>
          <p class="lead">{{ homeContent.subtitle }}</p>

          <div class="hero-actions">
            <a class="primary-cta" routerLink="/auth">{{ homeContent.primaryCta }}</a>
            <a class="secondary-cta" routerLink="/auth">{{ homeContent.secondaryCta }}</a>
          </div>

          <div class="hero-points">
            <article class="point-card" *ngFor="let item of homeContent.heroPoints">
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
              <article class="assurance-card" *ngFor="let item of homeContent.assuranceNotes">
                <strong>{{ item.title }}</strong>
                <p>{{ item.text }}</p>
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
            <article class="capability-card" *ngFor="let item of homeContent.capabilityCards">
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
                <p>Capacity {{ vehicle.capacityKg }} kg | Base Rs {{ vehicle.baseFare }} | Rs {{ vehicle.perKmRate }}/km</p>
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
          <a class="role-card" *ngFor="let role of homeContent.roleCards" routerLink="/auth">
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
            <article class="timeline-card" *ngFor="let lane of homeContent.lifecycle; let i = index">
              <span class="timeline-index">0{{ i + 1 }}</span>
              <strong>{{ lane.title }}</strong>
              <p>{{ lane.text }}</p>
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
            <article class="support-card" *ngFor="let item of homeContent.governanceCards">
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: [
    ".executive-shell { width: 100%; display: flex; flex-direction: column; gap: 1.6rem; }",
    ".executive-hero, .board-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(380px, 0.85fr); gap: 1.5rem; }",
    ".surface, .hero-main, .side-panel { background: var(--panel-bg); border: 1px solid var(--border); border-radius: 1.65rem; box-shadow: 0 26px 60px color-mix(in srgb, var(--text) 8%, transparent); }",
    ".hero-main { padding: 2.25rem; background: radial-gradient(circle at top right, color-mix(in srgb, var(--brand) 18%, transparent), transparent 24%), linear-gradient(135deg, color-mix(in srgb, var(--brand-contrast) 48%, white) 0%, #ffffff 42%, color-mix(in srgb, var(--panel-bg) 86%, #eef6ff) 100%); }",
    ".hero-side, .fleet-list, .support-list { display: flex; flex-direction: column; gap: 1rem; }",
    ".side-panel, .wide-panel, .narrow-panel, .role-surface { padding: 1.5rem; }",
    ".side-panel-dark { background: linear-gradient(180deg, color-mix(in srgb, var(--panel-strong-bg) 98%, black) 0%, var(--panel-strong-bg) 100%); border-color: color-mix(in srgb, var(--inverse-text) 8%, transparent); }",
    ".eyebrow { margin: 0 0 0.55rem; color: var(--brand-strong); text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.74rem; font-weight: 700; }",
    ".eyebrow.light { color: color-mix(in srgb, var(--brand-contrast) 82%, white); }",
    ".hero-main h1 { margin: 0; max-width: 10.2ch; font-size: clamp(3.4rem, 5vw, 5.8rem); line-height: 0.93; letter-spacing: -0.07em; color: var(--text); }",
    ".lead, .section-copy, .capability-card p, .fleet-card p, .support-card p, .timeline-card p, .point-card p, .assurance-card p, .role-card p { color: var(--muted); line-height: 1.75; }",
    ".lead { max-width: 66ch; margin: 1.15rem 0 0; font-size: 1.05rem; }",
    ".hero-actions { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 1.7rem; }",
    ".primary-cta, .secondary-cta, .role-card, .section-head a { text-decoration: none; }",
    ".primary-cta, .secondary-cta { display: inline-flex; align-items: center; justify-content: center; padding: 1rem 1.35rem; border-radius: 999px; font-weight: 700; }",
    ".primary-cta { background: linear-gradient(135deg, var(--brand), var(--brand-strong)); color: var(--inverse-text); box-shadow: 0 20px 40px color-mix(in srgb, var(--brand) 28%, transparent); }",
    ".secondary-cta { background: white; color: var(--text); border: 1px solid var(--border); }",
    ".hero-points { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1.8rem; }",
    ".point-card, .assurance-card, .capability-card, .fleet-card, .support-card, .timeline-card, .role-card { padding: 1.15rem; border-radius: 1.15rem; border: 1px solid var(--border); background: var(--panel-muted-bg); }",
    ".point-card span, .metric-card span { color: color-mix(in srgb, var(--muted) 78%, white); font-size: 0.82rem; }",
    ".point-card strong { display: block; margin-top: 0.4rem; color: var(--text); font-size: 1.35rem; }",
    ".point-card p { margin: 0.45rem 0 0; }",
    ".panel-head, .section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1.1rem; }",
    ".panel-head h2, .section-head h2 { margin: 0.05rem 0 0; color: var(--text); font-size: 2.2rem; line-height: 1.02; letter-spacing: -0.03em; }",
    ".side-panel-dark h2 { color: var(--inverse-text); }",
    ".head-chip, .state-chip { display: inline-flex; align-items: center; justify-content: center; padding: 0.45rem 0.8rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }",
    ".head-chip { background: color-mix(in srgb, var(--inverse-text) 8%, transparent); color: color-mix(in srgb, var(--inverse-text) 86%, transparent); }",
    ".metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; }",
    ".metric-card { padding: 1.05rem; border-radius: 1.1rem; background: color-mix(in srgb, var(--inverse-text) 8%, transparent); border: 1px solid color-mix(in srgb, var(--inverse-text) 8%, transparent); }",
    ".metric-card strong { display: block; margin-top: 0.45rem; color: var(--inverse-text); font-size: 2.35rem; line-height: 1; }",
    ".capability-grid, .role-grid, .timeline-grid { display: grid; gap: 1rem; }",
    ".capability-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
    ".section-copy { max-width: 28ch; }",
    ".section-head a { color: var(--brand-strong); font-weight: 700; }",
    ".fleet-card, .role-card { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }",
    ".state-chip { background: color-mix(in srgb, var(--brand) 14%, white); color: var(--brand-strong); }",
    ".state-chip.off { background: color-mix(in srgb, var(--text) 8%, white); color: var(--muted); }",
    ".role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
    ".role-card { color: inherit; transition: transform 0.2s ease, border-color 0.2s ease; }",
    ".role-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--brand) 28%, transparent); }",
    ".role-card span { color: var(--brand-strong); font-weight: 700; }",
    ".lower-grid { grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.85fr); }",
    ".timeline-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }",
    ".timeline-card { min-height: 205px; background: linear-gradient(180deg, color-mix(in srgb, var(--brand-contrast) 36%, white) 0%, #ffffff 100%); }",
    ".timeline-index { display: inline-flex; margin-bottom: 0.9rem; padding: 0.3rem 0.55rem; border-radius: 999px; background: var(--brand-soft); color: var(--brand-strong); font-size: 0.74rem; font-weight: 700; }",
    "@media (max-width: 1180px) { .executive-hero, .board-grid, .lower-grid, .capability-grid, .role-grid, .timeline-grid, .hero-points { grid-template-columns: 1fr; } .hero-main h1 { max-width: none; } }",
    "@media (max-width: 720px) { .metric-grid { grid-template-columns: 1fr; } .hero-actions { flex-direction: column; } .primary-cta, .secondary-cta { width: 100%; } .fleet-card, .role-card { flex-direction: column; align-items: flex-start; } .hero-main, .side-panel, .wide-panel, .narrow-panel, .role-surface { padding: 1.2rem; } }"
  ]
})
export class HomeExecutiveComponent {
  constructor(
    private readonly profileConfig: AppProfileConfigService,
    private readonly vehicleService: VehicleService,
    private readonly bookingService: BookingService,
    private readonly pricingService: PricingService
  ) {}

  get homeContent() {
    return this.profileConfig.appConfig.home;
  }

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
