import { Product } from './product.model';

export interface GroceryThemeConfig {
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

export interface GroceryBrandingConfig {
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

export interface GroceryAboutConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  highlights: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
}

export interface GroceryContactConfig {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  infoCards: { icon: string; title: string; lines: string[] }[];
  formTitle: string;
  formNote: string;
}

export interface GroceryFooterConfig {
  shopLinks: string[];
  supportLinks: string[];
  companyLinks: string[];
  socialLinks: { icon: string; label: string; href: string }[];
  contactLines: string[];
  appCtaLabel: string;
}

export interface GroceryHeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: string[];
  cardTitle: string;
  cardItems: string[];
  deliveryLine: string;
  detailDeliveryLine: string;
  relatedTitle: string;
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

export interface GroceryConfig {
  branding: GroceryBrandingConfig;
  theme: GroceryThemeConfig;
  about: GroceryAboutConfig;
  contact: GroceryContactConfig;
  footer: GroceryFooterConfig;
  hero: GroceryHeroConfig;
  searchCategories: string[];
  navLinks: string[];
  mobileLinks: string[];
  promoMessages: string[];
  catalog: {
    seedProducts: Product[];
    generation: CatalogGenerationConfig;
  };
}
