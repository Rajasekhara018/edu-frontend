import { Product } from './product.model';

export interface StoreThemeConfig {
  bodyBackground: string;
  ink: string;
  muted: string;
  accent: string;
  accentStrong: string;
  neon: string;
  mint: string;
  cream: string;
  panel: string;
  border: string;
  shadow: string;
  headerGradient: string;
  headerBorder: string;
  darkSurface: string;
  darkSurfaceAlt: string;
  onDark: string;
  onDarkMuted: string;
  focusRing: string;
}

export interface StoreBrandingConfig {
  name: string;
  tagline: string;
  logoMark: string;
  logoText: string;
  logoDot: string;
  favicon: string;
  pageTitle: string;
  locationLabel: string;
  locationAction: string;
  searchPlaceholder: string;
  accountGreeting: string;
  accountLabel: string;
  ordersSmall: string;
  ordersLabel: string;
  footerTagline: string;
  footerCopyright: string;
}

export interface StoreAboutConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  highlights: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
}

export interface StoreContactConfig {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  infoCards: { icon: string; title: string; lines: string[] }[];
  formTitle: string;
  formNote: string;
}

export interface StoreFooterConfig {
  shopLinks: string[];
  supportLinks: string[];
  companyLinks: string[];
  socialLinks: { icon: string; label: string; href: string }[];
  contactLines: string[];
  appCtaLabel: string;
}

export interface CatalogGenerationConfig {
  minProductCount: number;
  brands: string[];
  categories: string[];
  categorySpecifications: Record<string, { [key: string]: string }>;
  basePriceStart: number;
  priceStep: number;
  priceModulo: number;
  categoryPriceFactor: number;
  discountEvery: number;
  discountRate: number;
}

export interface StoreConfig {
  branding: StoreBrandingConfig;
  theme: StoreThemeConfig;
  about: StoreAboutConfig;
  contact: StoreContactConfig;
  footer: StoreFooterConfig;
  searchCategories: string[];
  navLinks: string[];
  mobileLinks: string[];
  promoMessages: string[];
  catalog: {
    seedProducts: Product[];
    generation: CatalogGenerationConfig;
  };
}
