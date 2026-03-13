import { PricingRule, User, VehicleType } from './models';

export interface AppThemeConfig {
  appBackground: string;
  shellGlowTop: string;
  shellGlowBottom: string;
  headerGradient: string;
  headerBorder: string;
  headerPromoBackground: string;
  panelBackground: string;
  panelMutedBackground: string;
  panelStrongBackground: string;
  border: string;
  shadow: string;
  text: string;
  muted: string;
  inverseText: string;
  inverseMuted: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentContrast: string;
}

export interface AppBrandingConfig {
  key: string;
  name: string;
  logoMark: string;
  logoText: string;
  logoDot: string;
  pageTitle: string;
  footerSummary: string;
  promo: string;
  lookupLabel: string;
  lookupPlaceholder: string;
  lookupMeta: string;
  authTag: string;
  supportEmail: string;
}

export interface AppContentCard {
  title: string;
  text: string;
}

export interface AppSignalCard {
  label: string;
  value: string;
  note: string;
}

export interface AppHomeConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  heroPoints: AppSignalCard[];
  assuranceNotes: AppContentCard[];
  capabilityCards: AppContentCard[];
  roleCards: AppContentCard[];
  lifecycle: AppContentCard[];
  governanceCards: AppContentCard[];
}

export interface AppAuthConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  portalTitle: string;
  portalSubtitle: string;
  roleCards: AppContentCard[];
  driverVehiclePlaceholder: string;
  driverNumberPlaceholder: string;
}

export interface AppDataConfig {
  users: User[];
  vehicleTypes: VehicleType[];
  pricingRules: PricingRule[];
  addresses: { id: string; label: string; address: string }[];
}

export interface AppProfileConfig {
  branding: AppBrandingConfig;
  theme: AppThemeConfig;
  home: AppHomeConfig;
  auth: AppAuthConfig;
  data: AppDataConfig;
}
