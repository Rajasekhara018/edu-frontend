import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './product.model';
import { SalesConfig, SalesThemeConfig } from './sales-config.model';

const DEFAULT_THEME: SalesThemeConfig = {
  bodyBackground: 'radial-gradient(circle at top, #fff4ea 0%, #f7efe6 45%, #f2ebe2 100%)',
  ink: '#1b1a1f',
  muted: '#5c5551',
  accent: '#e4573b',
  accentStrong: '#b54732',
  neon: '#f4b860',
  mint: '#fde6d8',
  cream: '#fffaf6',
  panel: '#ffffff',
  border: 'rgba(27, 26, 31, 0.12)',
  shadow: '0 18px 40px rgba(23, 18, 20, 0.12)',
  headerGradient: 'radial-gradient(circle at top left, #fff4ea 0%, #ffe2d2 45%, #ffd2b1 100%)',
  headerBorder: 'rgba(20, 16, 18, 0.08)',
  darkSurface: '#1b1a1f',
  darkSurfaceAlt: '#2a1e22',
  onDark: '#fef4ea',
  onDarkMuted: '#d6c6bc',
  focusRing: 'rgba(228, 87, 59, 0.18)'
};

const DEFAULT_CONFIG: SalesConfig = {
  branding: {
    name: 'ElectraMart Supply',
    tagline: 'Reliable electrical distribution for homes, projects, and trade counters.',
    logoMark: 'EM',
    logoText: 'ElectraMart',
    logoDot: '.pro',
    favicon: 'favicon.ico',
    pageTitle: 'ElectraMart Supply',
    locationLabel: 'Warehouse hub: Jeedimetla, Hyderabad',
    locationAction: 'Change warehouse',
    searchPlaceholder: 'Search panels, lights, cables, tools...',
    accountGreeting: 'Welcome back',
    accountLabel: 'Trade account',
    ordersSmall: 'Track',
    ordersLabel: 'Orders & invoices',
    footerTagline: 'Reliable electrical distribution for homes, projects, and trade counters.',
    footerCopyright: '© 2026 ElectraMart Supply. All rights reserved.'
  },
  theme: DEFAULT_THEME,
  about: {
    eyebrow: 'Trusted Electrical Partner',
    title: 'Powering projects with dependable electrical essentials.',
    description: 'Shop certified lighting, wiring, safety devices, batteries, inverters, and appliances with fast dispatch and trade-ready pricing.',
    primaryCta: 'Browse Products',
    secondaryCta: 'Talk to Sales',
    highlights: [
      { icon: 'bi-patch-check', title: 'Certified Brands', description: 'Only genuine, warranty-backed products from trusted electrical brands.' },
      { icon: 'bi-truck', title: 'Fast Dispatch', description: 'Same-day processing for stocked items and dependable regional shipping.' },
      { icon: 'bi-headset', title: 'Project Support', description: 'Guidance for product selection, installation, and replacement planning.' }
    ],
    stats: [
      { value: '12k+', label: 'Active Customers' },
      { value: '98%', label: 'On-time Delivery' },
      { value: '320+', label: 'Products in Stock' },
      { value: '24x7', label: 'Support Coverage' }
    ]
  },
  contact: {
    eyebrow: 'Connect With Us',
    title: 'Need pricing or project guidance?',
    description: 'Our team helps with quotations, product selection, bulk orders, and delivery coordination.',
    ctaLabel: 'Request a Call Back',
    infoCards: [
      { icon: 'bi-telephone', title: 'Phone', lines: ['+91 (800) 123-4567', '+91 (800) 987-6543'] },
      { icon: 'bi-envelope', title: 'Email', lines: ['sales@electramart.pro', 'support@electramart.pro'] },
      { icon: 'bi-geo-alt', title: 'Address', lines: ['ElectraMart Supply Hub', 'Jeedimetla, Hyderabad', 'India - 500055'] },
      { icon: 'bi-clock', title: 'Business Hours', lines: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: Emergency desk only'] }
    ],
    formTitle: 'Send us a Message',
    formNote: 'By submitting, you agree to be contacted regarding your inquiry.'
  },
  footer: {
    shopLinks: ['All Products', 'Best Sellers', 'New Arrivals', 'Deals'],
    supportLinks: ['Contact Us', 'Bulk Orders', 'Installation Help', 'Warranty'],
    companyLinks: ['About', 'Careers', 'Partners', 'News'],
    socialLinks: [
      { icon: 'bi-facebook', label: 'Facebook', href: '#' },
      { icon: 'bi-twitter-x', label: 'Twitter', href: '#' },
      { icon: 'bi-instagram', label: 'Instagram', href: '#' },
      { icon: 'bi-linkedin', label: 'LinkedIn', href: '#' }
    ],
    contactLines: ['+91 (800) 123-4567', 'support@electramart.pro', 'Jeedimetla, Hyderabad'],
    appCtaLabel: 'Get a Quote'
  },
  hero: {
    eyebrow: 'ElectraMart Supply',
    title: 'Power-ready supplies for homes, projects, and businesses.',
    subtitle: 'Shop certified lighting, wiring, safety gear, and power solutions with dependable dispatch and transparent pricing.',
    tags: ['Verified brands', 'Bulk pricing', 'Fast dispatch'],
    cardTitle: 'This week\'s focus',
    cardItems: ['LED panels and smart lighting', 'Industrial-grade switches', 'Inverters and surge protection'],
    deliveryLine: 'Dispatch in 24-48 hrs',
    detailDeliveryLine: 'Dispatch in 24-48 hrs',
    relatedTitle: 'Related Products'
  },
  searchCategories: ['All', 'Lighting', 'Power Solutions', 'Cables', 'Switches', 'Safety', 'Tools', 'Fans', 'Appliances'],
  navLinks: ['Fresh', 'Best Sellers', 'Deals', 'Lighting', 'Power', 'Safety', 'Tools', 'Trade desk', 'Help'],
  mobileLinks: ['All', 'Deals', 'Lighting', 'Power', 'Safety', 'Tools', 'Trade desk', 'Account', 'Orders', 'Cart'],
  promoMessages: ['Free delivery above Rs 1499', 'Trade quotations in under 30 minutes'],
  catalog: {
    seedProducts: [],
    generation: {
      minProductCount: 320,
      brands: ['Havells', 'Philips', 'Polycab', 'Luminous', 'Schneider', 'Finolex', 'Anchor', 'Crompton', 'Legrand', 'Syska'],
      categories: ['Lighting', 'Cables', 'Switches', 'Power Solutions', 'Fans', 'Safety', 'Tools', 'Appliances', 'Panels', 'Batteries'],
      categorySpecifications: {
        Lighting: { Power: '12W', Color: 'Cool White', Lifespan: '25,000 hrs', Warranty: '2 years' },
        Cables: { Length: '90 m', Gauge: '1.5 sq mm', Insulation: 'PVC', FlameRetardant: 'Yes' },
        Switches: { Type: 'Modular', Current: '10A', Finish: 'Matte', Warranty: '5 years' },
        'Power Solutions': { Capacity: '1100 VA', Output: 'Pure sine wave', Backup: '2-4 hrs', Protection: 'AVR' },
        Fans: { Sweep: '1200 mm', Power: '70W', Speed: '3 step', Warranty: '2 years' },
        Safety: { Rating: 'IP65', Material: 'ABS', Compliance: 'ISI', Warranty: '1 year' },
        Tools: { Power: '650W', Speed: '3000 RPM', Chuck: '13 mm', Warranty: '1 year' },
        Appliances: { Power: '1500W', Body: 'Steel', Voltage: '230V', Warranty: '2 years' },
        Panels: { Poles: '8-way', Material: 'CRCA', Finish: 'Powder-coated', Warranty: '5 years' },
        Batteries: { Capacity: '150 Ah', Type: 'Tubular', Backup: 'Long', Warranty: '36 months' }
      },
      basePriceStart: 349,
      priceStep: 43,
      priceModulo: 48000,
      categoryPriceFactor: 18,
      discountEvery: 3,
      discountRate: 0.2
    }
  }
};

@Injectable({ providedIn: 'root' })
export class SalesConfigService {
  private config: SalesConfig = DEFAULT_CONFIG;

  constructor(
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  async loadConfig(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.http.get<Partial<SalesConfig>>(environment.configFile));
      this.config = this.mergeConfig(remote);
    } catch (error) {
      console.error(`Failed to load sales config from ${environment.configFile}`, error);
      this.config = DEFAULT_CONFIG;
    }

    this.applyTheme();
    this.applyBranding();
  }

  get salesConfig(): SalesConfig {
    return this.config;
  }

  get seedProducts(): Product[] {
    return this.config.catalog.seedProducts;
  }

  private mergeConfig(remote?: Partial<SalesConfig>): SalesConfig {
    return {
      branding: { ...DEFAULT_CONFIG.branding, ...(remote?.branding ?? {}) },
      theme: this.buildTheme(remote?.theme),
      about: {
        ...DEFAULT_CONFIG.about,
        ...(remote?.about ?? {}),
        highlights: remote?.about?.highlights?.length ? remote.about.highlights : DEFAULT_CONFIG.about.highlights,
        stats: remote?.about?.stats?.length ? remote.about.stats : DEFAULT_CONFIG.about.stats
      },
      contact: {
        ...DEFAULT_CONFIG.contact,
        ...(remote?.contact ?? {}),
        infoCards: remote?.contact?.infoCards?.length ? remote.contact.infoCards : DEFAULT_CONFIG.contact.infoCards
      },
      footer: {
        ...DEFAULT_CONFIG.footer,
        ...(remote?.footer ?? {}),
        shopLinks: remote?.footer?.shopLinks?.length ? remote.footer.shopLinks : DEFAULT_CONFIG.footer.shopLinks,
        supportLinks: remote?.footer?.supportLinks?.length ? remote.footer.supportLinks : DEFAULT_CONFIG.footer.supportLinks,
        companyLinks: remote?.footer?.companyLinks?.length ? remote.footer.companyLinks : DEFAULT_CONFIG.footer.companyLinks,
        socialLinks: remote?.footer?.socialLinks?.length ? remote.footer.socialLinks : DEFAULT_CONFIG.footer.socialLinks,
        contactLines: remote?.footer?.contactLines?.length ? remote.footer.contactLines : DEFAULT_CONFIG.footer.contactLines
      },
      hero: {
        ...DEFAULT_CONFIG.hero,
        ...(remote?.hero ?? {}),
        tags: remote?.hero?.tags?.length ? remote.hero.tags : DEFAULT_CONFIG.hero.tags,
        cardItems: remote?.hero?.cardItems?.length ? remote.hero.cardItems : DEFAULT_CONFIG.hero.cardItems
      },
      searchCategories: remote?.searchCategories?.length ? remote.searchCategories : DEFAULT_CONFIG.searchCategories,
      navLinks: remote?.navLinks?.length ? remote.navLinks : DEFAULT_CONFIG.navLinks,
      mobileLinks: remote?.mobileLinks?.length ? remote.mobileLinks : DEFAULT_CONFIG.mobileLinks,
      promoMessages: remote?.promoMessages?.length ? remote.promoMessages : DEFAULT_CONFIG.promoMessages,
      catalog: {
        seedProducts: remote?.catalog?.seedProducts?.length ? remote.catalog.seedProducts : DEFAULT_CONFIG.catalog.seedProducts,
        generation: {
          ...DEFAULT_CONFIG.catalog.generation,
          ...(remote?.catalog?.generation ?? {}),
          brands: remote?.catalog?.generation?.brands?.length ? remote.catalog.generation.brands : DEFAULT_CONFIG.catalog.generation.brands,
          categories: remote?.catalog?.generation?.categories?.length ? remote.catalog.generation.categories : DEFAULT_CONFIG.catalog.generation.categories,
          categorySpecifications: {
            ...DEFAULT_CONFIG.catalog.generation.categorySpecifications,
            ...(remote?.catalog?.generation?.categorySpecifications ?? {})
          }
        }
      }
    };
  }

  private buildTheme(remote?: Partial<SalesThemeConfig>): SalesThemeConfig {
    const base: SalesThemeConfig = {
      ...DEFAULT_THEME,
      ...(remote ?? {})
    };

    return {
      ...base,
      panel: remote?.panel ?? `color-mix(in srgb, ${base.cream} 82%, white)`,
      border: remote?.border ?? `color-mix(in srgb, ${base.ink} 12%, transparent)`,
      shadow: remote?.shadow ?? `0 18px 40px color-mix(in srgb, ${base.ink} 12%, transparent)`,
      headerBorder: remote?.headerBorder ?? `color-mix(in srgb, ${base.ink} 10%, transparent)`,
      focusRing: remote?.focusRing ?? `color-mix(in srgb, ${base.accent} 18%, transparent)`
    };
  }

  private applyTheme(): void {
    const root = this.document.documentElement;
    const theme = this.config.theme;
    root.style.setProperty('--body-bg', theme.bodyBackground);
    root.style.setProperty('--ink', theme.ink);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-strong', theme.accentStrong);
    root.style.setProperty('--neon', theme.neon);
    root.style.setProperty('--mint', theme.mint);
    root.style.setProperty('--cream', theme.cream);
    root.style.setProperty('--panel', theme.panel);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--shadow', theme.shadow);
    root.style.setProperty('--header-gradient', theme.headerGradient);
    root.style.setProperty('--header-border', theme.headerBorder);
    root.style.setProperty('--dark-surface', theme.darkSurface);
    root.style.setProperty('--dark-surface-alt', theme.darkSurfaceAlt);
    root.style.setProperty('--on-dark', theme.onDark);
    root.style.setProperty('--on-dark-muted', theme.onDarkMuted);
    root.style.setProperty('--focus-ring', theme.focusRing);
  }

  private applyBranding(): void {
    this.document.title = this.config.branding.pageTitle;
    const faviconLink = this.document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (faviconLink) {
      faviconLink.href = this.config.branding.favicon;
    }
  }
}
