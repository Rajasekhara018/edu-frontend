import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreConfig } from './store-config.model';
import { Product } from './product.model';

const DEFAULT_THEME = {
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

const DEFAULT_CONFIG: StoreConfig = {
  branding: {
    name: 'Threadline Fashion House',
    tagline: 'Modern wardrobes, curated edits, and premium essentials tailored for every city mood.',
    logoMark: 'TL',
    logoText: 'Threadline',
    logoDot: '.co',
    favicon: 'favicon.ico',
    pageTitle: 'Threadline Fashion House',
    locationLabel: 'Style hub: Jubilee Hills, 500033',
    locationAction: 'Change store',
    searchPlaceholder: 'Search dresses, sneakers, bags...',
    accountGreeting: 'Welcome back',
    accountLabel: 'Style member',
    ordersSmall: 'Track',
    ordersLabel: 'Orders & returns',
    footerTagline: 'Modern wardrobes, curated edits, and premium essentials tailored for every city mood.',
    footerCopyright: '© 2026 Threadline. All rights reserved.'
  },
  theme: DEFAULT_THEME,
  about: {
    eyebrow: 'Threadline Fashion House',
    title: 'Runway-ready looks curated for city wardrobes.',
    description: 'We style seasonal drops, timeless staples, and premium edits from emerging designers. Build outfits with smart bundles, track your size history, and get personalized styling cues.',
    primaryCta: 'Start shopping',
    secondaryCta: 'Book a stylist call',
    highlights: [
      { icon: 'bi-magic', title: 'Trend Edits', description: 'Daily capsules curated by in-house fashion scouts.' },
      { icon: 'bi-scissors', title: 'Tailored Fit', description: 'Size guidance, fit notes, and easy exchanges.' },
      { icon: 'bi-recycle', title: 'Conscious Materials', description: 'Certified blends and transparent supply chains.' }
    ],
    stats: [
      { value: '120+', label: 'Design Partners' },
      { value: '48 hr', label: 'Dispatch Promise' },
      { value: '4.9', label: 'Style Rating' },
      { value: '1M+', label: 'Looks Styled' }
    ]
  },
  contact: {
    eyebrow: '24x7 Style Desk',
    title: 'Need help with a fit?',
    description: 'Reach us for order updates, return pickups, or styling guidance. Our experts reply fast.',
    ctaLabel: 'Chat with a stylist',
    infoCards: [
      { icon: 'bi-telephone', title: 'Instant Support', lines: ['+91 (800) 555-1110', 'WhatsApp: +91 90000 12345'] },
      { icon: 'bi-chat-dots', title: 'Live Chat', lines: ['In-app support, 24x7', 'support@threadline.co'] },
      { icon: 'bi-geo-alt', title: 'Style Studio', lines: ['Sunset Atelier', 'Jubilee Hills, Hyderabad', 'India - 500033'] },
      { icon: 'bi-clock', title: 'Operating Hours', lines: ['Mon - Sun: 9:00 AM - 11:00 PM', 'Stylist sessions every 30 mins'] }
    ],
    formTitle: 'Request a return or exchange',
    formNote: 'We respond within 30 minutes on average.'
  },
  footer: {
    shopLinks: ['Women', 'Men', 'Kids', 'Footwear'],
    supportLinks: ['Order status', 'Returns & exchanges', 'Size help', 'Business'],
    companyLinks: ['Our process', 'Careers', 'Sustainability', 'Press'],
    socialLinks: [
      { icon: 'bi-facebook', label: 'Facebook', href: '#' },
      { icon: 'bi-twitter-x', label: 'Twitter', href: '#' },
      { icon: 'bi-instagram', label: 'Instagram', href: '#' },
      { icon: 'bi-youtube', label: 'YouTube', href: '#' }
    ],
    contactLines: ['+91 (800) 555-1110', 'support@threadline.co', 'Jubilee Hills, Hyderabad'],
    appCtaLabel: 'Get the app'
  },
  searchCategories: ['All', 'Women', 'Men', 'Kids', 'Footwear', 'Accessories', 'Beauty', 'Home', 'Sports'],
  navLinks: ['New In', 'Women', 'Men', 'Kids', 'Footwear', 'Beauty', 'Luxe', 'Sale', 'Style guide', 'Help'],
  mobileLinks: ['New In', 'Women', 'Men', 'Kids', 'Footwear', 'Beauty', 'Sale', 'Style guide', 'Help', 'Bag'],
  promoMessages: ['Free shipping above Rs 999', 'Easy 30-day returns'],
  catalog: {
    seedProducts: [],
    generation: {
      minProductCount: 320,
      brands: ['Aurum', 'Mora', 'Civico', 'Vera', 'Pulse', 'Nomad', 'Lune', 'Atelier', 'StudioLine', 'Streetcraft', 'Velvetry', 'Kora'],
      categories: ['Women', 'Men', 'Kids', 'Footwear', 'Accessories', 'Beauty', 'Home', 'Sports', 'Luxe', 'Streetwear'],
      categorySpecifications: {
        Women: { Fabric: 'Blend', Fit: 'Regular', Length: 'Midi', Care: 'Dry clean' },
        Men: { Fabric: 'Cotton', Fit: 'Regular', Occasion: 'Smart casual', Care: 'Machine wash' },
        Kids: { Fabric: 'Cotton', Age: '2-10 years', Set: '2 pieces', Care: 'Machine wash' },
        Footwear: { Material: 'Mixed', Sole: 'Rubber', Closure: 'Lace-up', Care: 'Wipe clean' },
        Accessories: { Material: 'Vegan leather', Type: 'Accessory', Closure: 'Magnet', Warranty: '6 months' },
        Beauty: { Type: 'Beauty', Finish: 'Matte', Volume: '50 ml', Cruelty: 'Yes' },
        Home: { Material: 'Cotton blend', Size: 'Standard', Room: 'Living', Care: 'Machine wash' },
        Sports: { Fabric: 'Performance knit', Stretch: '4-way', Use: 'Training', Care: 'Machine wash' },
        Luxe: { Fabric: 'Premium blend', Craft: 'Hand-finished', Lining: 'Satin', Care: 'Dry clean' },
        Streetwear: { Fabric: 'Cotton fleece', Fit: 'Oversized', Drop: 'Limited', Care: 'Machine wash' }
      },
      basePriceStart: 590,
      priceStep: 37,
      priceModulo: 5200,
      categoryPriceFactor: 15,
      discountEvery: 3,
      discountRate: 0.2
    }
  }
};

@Injectable({ providedIn: 'root' })
export class StoreConfigService {
  private config: StoreConfig = DEFAULT_CONFIG;

  constructor(
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  async loadConfig(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.http.get<Partial<StoreConfig>>(environment.configFile));
      this.config = this.mergeConfig(remote);
    } catch (error) {
      console.error(`Failed to load store config from ${environment.configFile}`, error);
      this.config = DEFAULT_CONFIG;
    }

    this.applyTheme();
    this.applyBranding();
  }

  get storeConfig(): StoreConfig {
    return this.config;
  }

  get seedProducts(): Product[] {
    return this.config.catalog.seedProducts;
  }

  private mergeConfig(remote?: Partial<StoreConfig>): StoreConfig {
    return {
      branding: {
        ...DEFAULT_CONFIG.branding,
        ...(remote?.branding ?? {})
      },
      theme: {
        ...DEFAULT_THEME,
        ...(remote?.theme ?? {})
      },
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
