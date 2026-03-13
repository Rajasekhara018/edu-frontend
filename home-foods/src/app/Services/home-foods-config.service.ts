import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './product.model';
import { HomeFoodsConfig, HomeFoodsThemeConfig } from './home-foods-config.model';

const DEFAULT_THEME: HomeFoodsThemeConfig = {
  bodyBackground: 'radial-gradient(circle at top, #fff6e8 0%, #fff0dc 40%, #ffe6ca 100%)',
  ink: '#2f1d12',
  muted: '#71584a',
  accent: '#c86b2a',
  accentStrong: '#a64f18',
  neon: '#ffd166',
  mint: '#ffe8d2',
  cream: '#fffaf4',
  panel: '#ffffff',
  border: 'rgba(47, 29, 18, 0.12)',
  shadow: '0 18px 40px rgba(47, 29, 18, 0.14)',
  headerGradient: 'radial-gradient(circle at top left, #fff7ea 0%, #ffeacc 45%, #ffd5a8 100%)',
  headerBorder: 'rgba(47, 29, 18, 0.08)',
  darkSurface: '#2f1d12',
  darkSurfaceAlt: '#4b2b17',
  onDark: '#fff8f0',
  onDarkMuted: '#f0dcc8',
  focusRing: 'rgba(200, 107, 42, 0.18)'
};

const DEFAULT_CONFIG: HomeFoodsConfig = {
  branding: {
    name: 'HomeFoods Market',
    tagline: 'Pickles, sweets, snacks, and festive pantry staples from trusted home kitchens.',
    logoMark: 'HF',
    logoText: 'HomeFoods',
    logoDot: '.market',
    favicon: 'favicon.ico',
    pageTitle: 'HomeFoods Market',
    locationLabel: 'Delivering to Jubilee Hills, Hyderabad',
    locationAction: 'Update area',
    searchPlaceholder: 'Search pickles, sweets, snacks...',
    accountGreeting: 'Welcome back',
    accountLabel: 'Family pantry',
    ordersSmall: 'Track',
    ordersLabel: 'Orders & gifting',
    footerTagline: 'Traditional recipes, pantry staples, and festive assortments packed fresh every week.',
    footerCopyright: '(C) 2026 HomeFoods Market. All rights reserved.'
  },
  theme: DEFAULT_THEME,
  about: {
    eyebrow: 'Crafted in home kitchens',
    title: 'Traditional pickles, sweets, savories, and mixes curated for everyday meals and festive gifting.',
    description: 'We partner with home cooks and artisan makers to deliver fresh batches of regional favorites, pantry staples, and celebration boxes with dependable packing and fast dispatch.',
    primaryCta: 'Browse products',
    secondaryCta: 'Plan a pantry order',
    highlights: [
      { icon: 'bi-basket2', title: 'Small-Batch Recipes', description: 'Made in measured batches for steady flavor and freshness.' },
      { icon: 'bi-stars', title: 'Festive Assortments', description: 'Gift boxes and celebration hampers packed for families and teams.' },
      { icon: 'bi-box-seam', title: 'Safe Packing', description: 'Leak-safe jars, crisp snack packs, and reliable courier dispatch.' }
    ],
    stats: [
      { value: '320+', label: 'Products Listed' },
      { value: '40+', label: 'Kitchen Partners' },
      { value: '12k+', label: 'Orders Delivered' },
      { value: '48 hrs', label: 'Dispatch Promise' }
    ]
  },
  contact: {
    eyebrow: 'Need a curated order?',
    title: 'Questions about gifting, spice levels, or bulk pantry deliveries?',
    description: 'Reach out for family combo packs, festival hampers, custom assortments, or recurring pantry boxes.',
    ctaLabel: 'Request a callback',
    infoCards: [
      { icon: 'bi-telephone', title: 'Call us', lines: ['+91 (800) 222-1010', 'WhatsApp: +91 90000 10101'] },
      { icon: 'bi-envelope', title: 'Email', lines: ['hello@homefoods.market', 'support@homefoods.market'] },
      { icon: 'bi-geo-alt', title: 'Kitchen hub', lines: ['12 Market Lane', 'Jubilee Hills, Hyderabad - 500033'] },
      { icon: 'bi-clock', title: 'Hours', lines: ['Mon - Sat: 8:00 AM - 8:00 PM', 'Sunday: 9:00 AM - 2:00 PM'] }
    ],
    formTitle: 'Send us a Message',
    formNote: 'By submitting, you agree to be contacted regarding your inquiry.'
  },
  footer: {
    shopLinks: ['Pickles', 'Sweets', 'Snacks', 'Ready Mixes'],
    supportLinks: ['Delivery info', 'Bulk orders', 'Gifting', 'Returns'],
    companyLinks: ['Our story', 'Kitchen partners', 'Careers', 'Journal'],
    socialLinks: [
      { icon: 'bi-facebook', label: 'Facebook', href: '#' },
      { icon: 'bi-twitter-x', label: 'Twitter', href: '#' },
      { icon: 'bi-instagram', label: 'Instagram', href: '#' },
      { icon: 'bi-youtube', label: 'YouTube', href: '#' }
    ],
    contactLines: ['+91 (800) 222-1010', 'hello@homefoods.market', 'Jubilee Hills, Hyderabad'],
    appCtaLabel: 'Request catalog'
  },
  hero: {
    eyebrow: 'HomeFoods Market',
    title: 'Freshly packed pickles, sweets, snacks, and pantry staples from trusted home kitchens.',
    subtitle: 'Shop regional specialties, festive assortments, and everyday favorites with clear prices and dependable dispatch.',
    tags: ['Fresh batches weekly', 'Gift-ready packs', 'Regional favorites'],
    cardTitle: 'Pantry must-haves',
    cardItems: ['Classic avakaya and gongura jars', 'Ghee sweets and festival assortments', 'Snacks, podis, papads, and ready mixes'],
    deliveryLine: 'Dispatch in 24-48 hrs',
    detailDeliveryLine: 'Dispatch in 24-48 hrs',
    relatedTitle: 'Related Products'
  },
  searchCategories: ['All', 'Pickles', 'Sweets', 'Savories', 'Snacks', 'Ready Mixes', 'Spice Powders', 'Papads & Fryums', 'Oils & Ghee', 'Beverages'],
  navLinks: ['Pickles', 'Sweets', 'Savories', 'Snacks', 'Ready Mixes', 'Papads', 'Oils & Ghee', 'Gifting', 'Contact'],
  mobileLinks: ['All items', 'Pickles', 'Sweets', 'Savories', 'Snacks', 'Ready Mixes', 'Papads & Fryums', 'Gifting', 'Contact'],
  promoMessages: ['Fresh batches every week', 'Free delivery over Rs 999'],
  catalog: {
    seedProducts: [],
    generation: {
      minProductCount: 320,
      brands: ['Ammamma', 'StonePot', 'TeluguTaste', 'VillageJar', 'FestiveLeaf', 'SpiceTrail', 'BrassBowl', 'HeritagePantry', 'GheeCraft', 'MilletMorsel'],
      categories: ['Pickles', 'Sweets', 'Savories', 'Snacks', 'Ready Mixes', 'Spice Powders', 'Papads & Fryums', 'Oils & Ghee', 'Beverages', 'Health & Herbal', 'Millet Mixes', 'Festival Boxes'],
      categorySpecifications: {
        Pickles: { 'Net Weight': '500 g', 'Flavor Base': 'Traditional spice blend', 'Shelf Life': '6 months', Storage: 'Cool and dry' },
        Sweets: { 'Net Weight': '300 g', Sweetener: 'Sugar or jaggery', 'Shelf Life': '7-10 days', Storage: 'Airtight container' },
        Savories: { 'Net Weight': '250 g', Texture: 'Crunchy snack', 'Shelf Life': '20 days', Storage: 'Airtight container' },
        Snacks: { 'Net Weight': '200 g', Style: 'Tea-time snack', 'Shelf Life': '20 days', Storage: 'Cool and dry' },
        'Ready Mixes': { 'Net Weight': '500 g', Use: 'Quick preparation', 'Shelf Life': '4 months', Storage: 'Dry place' },
        'Spice Powders': { 'Net Weight': '250 g', Roast: 'Small-batch roasted', 'Shelf Life': '4 months', Storage: 'Airtight container' },
        'Papads & Fryums': { 'Net Weight': '250 g', Preparation: 'Fry or roast', 'Shelf Life': '6 months', Storage: 'Dry place' },
        'Oils & Ghee': { Volume: '500 ml', Source: 'Cold pressed or pure ghee', 'Shelf Life': '6 months', Storage: 'Cool and dry' },
        Beverages: { Volume: '750 ml', Serve: 'Chill and serve', 'Shelf Life': '3 months', Storage: 'Refrigerate after opening' },
        'Health & Herbal': { 'Net Weight': '250 g', Benefit: 'Wellness pantry item', 'Shelf Life': '4 months', Storage: 'Cool and dry' },
        'Millet Mixes': { 'Net Weight': '500 g', Grain: 'Millet blend', 'Shelf Life': '4 months', Storage: 'Dry place' },
        'Festival Boxes': { Contents: 'Assorted box', Packing: 'Gift-ready', 'Shelf Life': 'Varies by item', Storage: 'Room temperature' }
      },
      basePriceStart: 120,
      priceStep: 35,
      priceModulo: 2200,
      categoryPriceFactor: 22,
      discountEvery: 3,
      discountRate: 0.18
    }
  }
};

@Injectable({ providedIn: 'root' })
export class HomeFoodsConfigService {
  private config: HomeFoodsConfig = DEFAULT_CONFIG;

  constructor(private readonly http: HttpClient, @Inject(DOCUMENT) private readonly document: Document) {}

  async loadConfig(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.http.get<Partial<HomeFoodsConfig>>(environment.configFile));
      this.config = this.mergeConfig(remote);
    } catch (error) {
      console.error(`Failed to load home-foods config from ${environment.configFile}`, error);
      this.config = DEFAULT_CONFIG;
    }
    this.applyTheme();
    this.applyBranding();
  }

  get homeFoodsConfig(): HomeFoodsConfig {
    return this.config;
  }

  get seedProducts(): Product[] {
    return this.config.catalog.seedProducts;
  }

  private mergeConfig(remote?: Partial<HomeFoodsConfig>): HomeFoodsConfig {
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

  private buildTheme(remote?: Partial<HomeFoodsThemeConfig>): HomeFoodsThemeConfig {
    const base: HomeFoodsThemeConfig = { ...DEFAULT_THEME, ...(remote ?? {}) };
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
