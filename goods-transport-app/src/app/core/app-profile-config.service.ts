import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { AppProfileConfig, AppThemeConfig } from './app-profile-config.model';

const DEFAULT_THEME: AppThemeConfig = {
  appBackground: 'linear-gradient(180deg, #eef3f9 0%, #f7f9fc 52%, #eef2f7 100%)',
  shellGlowTop: 'rgba(249, 115, 22, 0.14)',
  shellGlowBottom: 'rgba(15, 23, 42, 0.1)',
  headerGradient: 'linear-gradient(135deg, #0f172a 0%, #14213a 55%, #1a2a45 100%)',
  headerBorder: 'rgba(255, 255, 255, 0.08)',
  headerPromoBackground: 'rgba(255, 255, 255, 0.04)',
  panelBackground: 'rgba(255, 255, 255, 0.96)',
  panelMutedBackground: '#fbfdff',
  panelStrongBackground: '#0f172a',
  border: 'rgba(15, 23, 42, 0.1)',
  shadow: '0 20px 48px rgba(15, 23, 42, 0.08)',
  text: '#111827',
  muted: '#667085',
  inverseText: '#ffffff',
  inverseMuted: 'rgba(255, 255, 255, 0.72)',
  accent: '#f97316',
  accentStrong: '#ea580c',
  accentSoft: 'rgba(249, 115, 22, 0.14)',
  accentContrast: '#fff7ed'
};

const DEFAULT_CONFIG: AppProfileConfig = {
  branding: {
    key: 'goodsgo-dev',
    name: 'GoodsGo Control',
    logoMark: 'GG',
    logoText: 'GoodsGo Control',
    logoDot: '.',
    pageTitle: 'GoodsGo Control',
    footerSummary: 'Public home for application overview. Login is required for customer, driver, admin and booking workflows.',
    promo: 'Public overview on home | Secure role-based access for operations',
    lookupLabel: 'Shipment lookup',
    lookupPlaceholder: 'Search by booking ID, address, phone or goods type',
    lookupMeta: 'Secure tracking across customer, driver and admin workspaces',
    authTag: 'Secure login',
    supportEmail: 'admin@goodsgo.control'
  },
  theme: DEFAULT_THEME,
  home: {
    eyebrow: 'Logistics platform',
    title: 'Professional freight booking, shipment visibility and dispatch control.',
    subtitle:
      'GoodsGo is a structured transport operations application for customers, drivers and administrators. The public homepage explains the platform. Secure workspaces open only after login.',
    primaryCta: 'Enter secure workspace',
    secondaryCta: 'View access roles',
    heroPoints: [
      { label: 'Coverage model', value: 'B2B cargo', note: 'Built for structured city and intercity goods movement workflows.' },
      { label: 'Support posture', value: 'Exception ready', note: 'Designed to handle booking clarifications and operational follow-up.' },
      { label: 'Security model', value: 'Role based', note: 'Workspaces are protected and routed after authentication.' }
    ],
    assuranceNotes: [
      { title: 'Public landing only', text: 'This homepage explains the platform. Operational workspaces remain protected.' },
      { title: 'Unified data model', text: 'Vehicles, pricing rules, bookings and milestones operate on one application dataset.' },
      { title: 'Track-first workflow', text: 'Search, booking creation, driver assignment and delivery visibility follow one operational chain.' }
    ],
    capabilityCards: [
      { title: 'Shipment booking', text: 'Customers create freight requests with pickup, drop, goods and vehicle selections in a guided workflow.' },
      { title: 'Tracking and lookup', text: 'Bookings can be located by shipment identifier, route details, contact numbers or goods type.' },
      { title: 'Dispatch administration', text: 'Administrators review demand, assign drivers, maintain vehicle presets and govern pricing configurations.' }
    ],
    roleCards: [
      { title: 'Customer workspace', text: 'Create shipments, review booking history and track active movement records.' },
      { title: 'Driver workspace', text: 'See assigned jobs, update milestones and confirm progress from pickup to delivery.' },
      { title: 'Admin workspace', text: 'Manage dispatch control, vehicle availability and pricing rules from a central console.' }
    ],
    lifecycle: [
      { title: 'Created', text: 'The shipment request is captured and becomes visible for operational review.' },
      { title: 'Driver assigned', text: 'Dispatch allocates a driver and moves the booking into execution readiness.' },
      { title: 'In transit', text: 'The job is active with movement updates and status progression across the route.' },
      { title: 'Delivered', text: 'Completion is recorded and remains visible in booking history and operational reporting.' }
    ],
    governanceCards: [
      { title: 'Support desk discipline', text: 'The data model supports booking clarifications, operational follow-up and route exceptions.' },
      { title: 'Pickup readiness', text: 'Pickup and drop contacts are captured clearly to reduce handoff ambiguity during dispatch.' },
      { title: 'Pricing governance', text: 'Vehicle presets and rate profiles are maintained in a structured administrative flow.' }
    ]
  },
  auth: {
    eyebrow: 'Secure access',
    title: 'Login to open the right operations workspace.',
    subtitle:
      'Customer, driver and admin areas are protected. Use this page to register or resume a locally persisted session and continue into the correct workspace.',
    portalTitle: 'Goods Transportation Portal',
    portalSubtitle: 'Select your role and continue. New users are created locally on first login.',
    roleCards: [
      { title: 'Customer', text: 'Create shipments, review booking history and track movement.' },
      { title: 'Driver', text: 'Open assigned jobs, update milestones and save proof notes.' },
      { title: 'Admin', text: 'Manage fleet types, pricing rules and dispatch assignment decisions.' }
    ],
    driverVehiclePlaceholder: 'Mini truck',
    driverNumberPlaceholder: 'MH12AX3456'
  },
  data: {
    users: [
      { id: 'u-admin', role: 'ADMIN', name: 'System Admin', phone: '555-0001', email: 'admin@goodsgo.control' },
      { id: 'u-customer', role: 'CUSTOMER', name: 'Alice Patel', phone: '555-0101' },
      {
        id: 'u-driver',
        role: 'DRIVER',
        name: 'Ravi Mehta',
        phone: '555-0202',
        vehicleInfo: { type: 'Mini Truck', number: 'MH12AX3456' }
      }
    ],
    vehicleTypes: [
      { id: 'vt-1', name: 'Mini Truck', capacityKg: 1200, baseFare: 700, perKmRate: 28, enabled: true },
      { id: 'vt-2', name: 'Medium Truck', capacityKg: 2500, baseFare: 1100, perKmRate: 45, enabled: true }
    ],
    pricingRules: [
      { id: 'pr-default', name: 'Standard', taxPercent: 12, surgeMultiplier: 1 },
      { id: 'pr-peak', name: 'Peak', taxPercent: 12, surgeMultiplier: 1.2 }
    ],
    addresses: [
      { id: 'addr-1', label: 'Warehouse East', address: '101 East Park Lane' },
      { id: 'addr-2', label: 'North Hub', address: '22 North Drive' },
      { id: 'addr-3', label: 'South Depot', address: '7 South Boulevard' }
    ]
  }
};

@Injectable({ providedIn: 'root' })
export class AppProfileConfigService {
  private config: AppProfileConfig = DEFAULT_CONFIG;
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  constructor() {}

  async loadConfig(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.http.get<Partial<AppProfileConfig>>(environment.configFile));
      this.config = this.mergeConfig(remote);
    } catch (error) {
      console.error(`Failed to load goods transport config from ${environment.configFile}`, error);
      this.config = DEFAULT_CONFIG;
    }

    this.applyTheme();
    this.document.title = this.config.branding.pageTitle;
  }

  get appConfig(): AppProfileConfig {
    return this.config;
  }

  private mergeConfig(remote?: Partial<AppProfileConfig>): AppProfileConfig {
    return {
      branding: { ...DEFAULT_CONFIG.branding, ...(remote?.branding ?? {}) },
      theme: { ...DEFAULT_THEME, ...(remote?.theme ?? {}) },
      home: {
        ...DEFAULT_CONFIG.home,
        ...(remote?.home ?? {}),
        heroPoints: remote?.home?.heroPoints?.length ? remote.home.heroPoints : DEFAULT_CONFIG.home.heroPoints,
        assuranceNotes: remote?.home?.assuranceNotes?.length ? remote.home.assuranceNotes : DEFAULT_CONFIG.home.assuranceNotes,
        capabilityCards: remote?.home?.capabilityCards?.length ? remote.home.capabilityCards : DEFAULT_CONFIG.home.capabilityCards,
        roleCards: remote?.home?.roleCards?.length ? remote.home.roleCards : DEFAULT_CONFIG.home.roleCards,
        lifecycle: remote?.home?.lifecycle?.length ? remote.home.lifecycle : DEFAULT_CONFIG.home.lifecycle,
        governanceCards: remote?.home?.governanceCards?.length ? remote.home.governanceCards : DEFAULT_CONFIG.home.governanceCards
      },
      auth: {
        ...DEFAULT_CONFIG.auth,
        ...(remote?.auth ?? {}),
        roleCards: remote?.auth?.roleCards?.length ? remote.auth.roleCards : DEFAULT_CONFIG.auth.roleCards
      },
      data: {
        users: remote?.data?.users?.length ? remote.data.users : DEFAULT_CONFIG.data.users,
        vehicleTypes: remote?.data?.vehicleTypes?.length ? remote.data.vehicleTypes : DEFAULT_CONFIG.data.vehicleTypes,
        pricingRules: remote?.data?.pricingRules?.length ? remote.data.pricingRules : DEFAULT_CONFIG.data.pricingRules,
        addresses: remote?.data?.addresses?.length ? remote.data.addresses : DEFAULT_CONFIG.data.addresses
      }
    };
  }

  private applyTheme(): void {
    const root = this.document.documentElement;
    const theme = this.config.theme;
    root.style.setProperty('--app-bg', theme.appBackground);
    root.style.setProperty('--shell-glow-top', theme.shellGlowTop);
    root.style.setProperty('--shell-glow-bottom', theme.shellGlowBottom);
    root.style.setProperty('--header-gradient', theme.headerGradient);
    root.style.setProperty('--header-border', theme.headerBorder);
    root.style.setProperty('--header-promo-bg', theme.headerPromoBackground);
    root.style.setProperty('--panel-bg', theme.panelBackground);
    root.style.setProperty('--panel-muted-bg', theme.panelMutedBackground);
    root.style.setProperty('--panel-strong-bg', theme.panelStrongBackground);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--shadow', theme.shadow);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--inverse-text', theme.inverseText);
    root.style.setProperty('--inverse-muted', theme.inverseMuted);
    root.style.setProperty('--brand', theme.accent);
    root.style.setProperty('--brand-strong', theme.accentStrong);
    root.style.setProperty('--brand-soft', theme.accentSoft);
    root.style.setProperty('--brand-contrast', theme.accentContrast);
  }
}
