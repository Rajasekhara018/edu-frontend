import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './product.model';
import { GroceryConfig, GroceryThemeConfig } from './grocery-config.model';

const DEFAULT_THEME: GroceryThemeConfig = {
  bodyBackground: 'radial-gradient(circle at top, #f4fff1 0%, #edf9e8 45%, #e7f3e1 100%)',
  ink: '#19311d',
  muted: '#546a57',
  accent: '#2f9e44',
  accentStrong: '#247a34',
  neon: '#f4d35e',
  mint: '#dff4d8',
  cream: '#fbfff8',
  panel: '#ffffff',
  border: 'rgba(25, 49, 29, 0.12)',
  shadow: '0 18px 40px rgba(25, 49, 29, 0.12)',
  headerGradient: 'radial-gradient(circle at top left, #f5fff2 0%, #e2f7d8 45%, #c5ebb7 100%)',
  headerBorder: 'rgba(25, 49, 29, 0.08)',
  darkSurface: '#19311d',
  darkSurfaceAlt: '#24482a',
  onDark: '#f8fff6',
  onDarkMuted: '#d2e4d0',
  focusRing: 'rgba(47, 158, 68, 0.18)'
};

const DEFAULT_CONFIG: GroceryConfig = {
  branding: {
    name: 'ZipGrocer Now',
    tagline: 'Daily essentials, fresh produce, and pantry staples delivered fast.',
    logoMark: 'ZG',
    logoText: 'ZipGrocer',
    logoDot: '.now',
    favicon: 'favicon.ico',
    pageTitle: 'ZipGrocer Now',
    locationLabel: 'Delivering to Madhapur, Hyderabad',
    locationAction: 'Change location',
    searchPlaceholder: 'Search milk, fruits, snacks...',
    accountGreeting: 'Good morning',
    accountLabel: 'Family account',
    ordersSmall: 'Track',
    ordersLabel: 'Orders & returns',
    footerTagline: 'Daily essentials, fresh produce, and pantry staples delivered fast.',
    footerCopyright: '(C) 2026 ZipGrocer Now. All rights reserved.'
  },
  theme: DEFAULT_THEME,
  about: {
    eyebrow: 'Neighborhood grocery partner',
    title: 'Fresh groceries, pantry staples, and home essentials delivered in a few taps.',
    description: 'We bring local produce, trusted dairy, ready-to-cook meals, snacks, and household goods together with reliable slots and fair prices.',
    primaryCta: 'Start shopping',
    secondaryCta: 'Schedule a delivery',
    highlights: [
      { icon: 'bi-basket2', title: 'Fresh Picks', description: 'Fruit, vegetables, herbs, and dairy replenished every day.' },
      { icon: 'bi-truck', title: 'Fast Slots', description: 'Express and same-day delivery windows for urgent baskets.' },
      { icon: 'bi-shield-check', title: 'Trusted Quality', description: 'Cold-chain handling and careful picks for every order.' }
    ],
    stats: [
      { value: '18k+', label: 'Monthly Orders' },
      { value: '98%', label: 'On-time Delivery' },
      { value: '320+', label: 'Products Listed' },
      { value: '7 days', label: 'Support Window' }
    ]
  },
  contact: {
    eyebrow: 'Need help fast?',
    title: 'Questions about delivery, substitutions, or your basket?',
    description: 'Support is available for order edits, replacements, refunds, and recurring grocery schedules.',
    ctaLabel: 'Chat with support',
    infoCards: [
      { icon: 'bi-telephone', title: 'Support line', lines: ['+91 (800) 555-3020', 'WhatsApp: +91 90000 30200'] },
      { icon: 'bi-envelope', title: 'Email', lines: ['care@zipgrocer.now', 'support@zipgrocer.now'] },
      { icon: 'bi-geo-alt', title: 'Dark store', lines: ['Madhapur Fulfilment Hub', 'Hyderabad, India - 500081'] },
      { icon: 'bi-clock', title: 'Hours', lines: ['Mon - Sun: 6:00 AM - 11:00 PM', 'Express desk till midnight'] }
    ],
    formTitle: 'Send us a Message',
    formNote: 'By submitting, you agree to be contacted regarding your inquiry.'
  },
  footer: {
    shopLinks: ['Fresh Produce', 'Dairy & Eggs', 'Staples', 'Household'],
    supportLinks: ['Delivery status', 'Returns', 'Order issues', 'Business'],
    companyLinks: ['About', 'Careers', 'Partners', 'News'],
    socialLinks: [
      { icon: 'bi-facebook', label: 'Facebook', href: '#' },
      { icon: 'bi-twitter-x', label: 'Twitter', href: '#' },
      { icon: 'bi-instagram', label: 'Instagram', href: '#' },
      { icon: 'bi-linkedin', label: 'LinkedIn', href: '#' }
    ],
    contactLines: ['+91 (800) 555-3020', 'support@zipgrocer.now', 'Madhapur, Hyderabad'],
    appCtaLabel: 'Get the app'
  },
  hero: {
    eyebrow: 'ZipGrocer Now',
    title: 'Fresh groceries, pantry staples, and household essentials on your schedule.',
    subtitle: 'Shop produce, dairy, beverages, snacks, and home care with transparent prices and reliable slots.',
    tags: ['Fresh today', 'Express slots', 'Smart savings'],
    cardTitle: 'This week\'s basket',
    cardItems: ['Seasonal fruit and greens', 'Breakfast staples and dairy', 'Quick snacks and beverages'],
    deliveryLine: 'Delivery in 30-60 mins',
    detailDeliveryLine: 'Delivery in 30-60 mins',
    relatedTitle: 'Related Products'
  },
  searchCategories: ['All', 'Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Staples', 'Snacks', 'Beverages', 'Frozen Foods', 'Household'],
  navLinks: ['Fresh', 'Dairy', 'Bakery', 'Staples', 'Snacks', 'Beverages', 'Offers', 'Household', 'Help'],
  mobileLinks: ['All items', 'Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Staples', 'Snacks', 'Household', 'Offers', 'Help'],
  promoMessages: ['Free delivery above Rs 599', 'Fresh picks restocked every morning'],
  catalog: {
    seedProducts: [],
    generation: {
      minProductCount: 320,
      brands: ['FreshFarm', 'DailyDairy', 'CrunchCo', 'PantryPro', 'UrbanHarvest', 'PureSip', 'HomeNest', 'QuickMeal', 'NatureCart', 'HappyRoots'],
      categories: ['Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Staples', 'Snacks', 'Beverages', 'Frozen Foods', 'Personal Care', 'Cleaning', 'Baby Care'],
      categorySpecifications: {
        'Fresh Produce': { Weight: '500 g', Origin: 'Local farm', ShelfLife: '2-4 days', Storage: 'Refrigerate' },
        'Dairy & Eggs': { Weight: '1 pack', Source: 'Daily chilled', ShelfLife: '3-7 days', Storage: 'Keep refrigerated' },
        Bakery: { Weight: '1 pack', Freshness: 'Baked today', ShelfLife: '2-3 days', Storage: 'Cool and dry' },
        Staples: { Weight: '1 kg', Type: 'Household staple', ShelfLife: '6-12 months', Storage: 'Dry place' },
        Snacks: { Weight: '150 g', Type: 'Ready to eat', ShelfLife: '3-6 months', Storage: 'Cool and dry' },
        Beverages: { Volume: '1 L', Type: 'Ready to drink', ShelfLife: '2-6 months', Storage: 'Refrigerate after opening' },
        'Frozen Foods': { Weight: '500 g', Type: 'Frozen pack', ShelfLife: '6 months', Storage: 'Keep frozen' },
        'Personal Care': { Volume: '250 ml', Type: 'Daily care', ShelfLife: '12 months', Storage: 'Room temperature' },
        Cleaning: { Volume: '1 L', Type: 'Home care', ShelfLife: '12 months', Storage: 'Room temperature' },
        'Baby Care': { Count: '1 pack', Type: 'Baby essentials', ShelfLife: '12 months', Storage: 'Cool and dry' }
      },
      basePriceStart: 29,
      priceStep: 9,
      priceModulo: 900,
      categoryPriceFactor: 4,
      discountEvery: 3,
      discountRate: 0.18
    }
  }
};

@Injectable({ providedIn: 'root' })
export class GroceryConfigService {
  private config: GroceryConfig = DEFAULT_CONFIG;

  constructor(private readonly http: HttpClient, @Inject(DOCUMENT) private readonly document: Document) {}

  async loadConfig(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.http.get<Partial<GroceryConfig>>(environment.configFile));
      this.config = this.mergeConfig(remote);
    } catch (error) {
      console.error(`Failed to load grocery config from ${environment.configFile}`, error);
      this.config = DEFAULT_CONFIG;
    }
    this.applyTheme();
    this.applyBranding();
  }

  get groceryConfig(): GroceryConfig {
    return this.config;
  }

  get seedProducts(): Product[] {
    return this.config.catalog.seedProducts;
  }

  private mergeConfig(remote?: Partial<GroceryConfig>): GroceryConfig {
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

  private buildTheme(remote?: Partial<GroceryThemeConfig>): GroceryThemeConfig {
    const base: GroceryThemeConfig = { ...DEFAULT_THEME, ...(remote ?? {}) };
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
    const faviconLink = this.document.querySelector("link[rel*='icon']");
    if (faviconLink) {
      faviconLink.setAttribute('href', this.config.branding.favicon);
    }
  }
}
