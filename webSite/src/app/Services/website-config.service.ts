import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  WebsiteConfig,
  WebsiteContactConfig,
  WebsiteCourseConfig,
  WebsiteThemeConfig
} from './website-config.model';

const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  branding: {
    name: 'EduSoft Academy',
    tagline: 'Industry-led learning pathways',
    logo: 'assets/edutech.png',
    favicon: 'favicon.ico',
    pageTitle: 'EduSoft Academy',
    footerSummary: 'Professional training pathways in software engineering, data, and full-stack development.',
    footerCopyright: 'COPYRIGHT (C) 2026 EDUSOFT ACADEMY',
    heroEyebrow: 'Career Track Programs',
    heroTitle: 'Launch Your Career in Tech with Industry Experts',
    heroSubtitle: 'Master real-world skills through hands-on projects, expert mentorship, and career-focused programs designed to make you job-ready.',
    aboutTitle: 'Build career-ready skills with expert-led programs.',
    aboutDescription: 'We are a team of software professionals and educators on a mission to simplify coding education. Whether you are preparing for a tech career or upskilling, we deliver hands-on, project-based training with mentorship that matters.'
  },
  contact: {
    phone: '+91 (800) 555-1212',
    hours: 'Mon - Sat, 9:00 AM - 7:00 PM',
    primaryEmail: 'admissions@edusoft.academy',
    secondaryEmail: 'support@edusoft.academy'
  },
  theme: {
    bodyBackground: 'radial-gradient(circle at top, #f5f8ff 0%, #eef3fb 45%, #e9eff7 100%)',
    headerBackground: 'rgba(255, 255, 255, 0.92)',
    headerBorder: 'rgba(15, 23, 42, 0.08)',
    surface: '#ffffff',
    surfaceAlt: '#f1f5ff',
    textPrimary: '#0f172a',
    textMuted: '#5b677a',
    accent: '#1b4b8b',
    accentStrong: '#133864',
    accentSoft: 'rgba(27, 75, 139, 0.12)',
    gold: '#f2a900',
    darkSurface: '#0f172a',
    darkSurfaceAlt: 'rgba(15, 23, 42, 0.8)',
    onDark: '#f8fafc',
    onDarkMuted: 'rgba(248, 250, 252, 0.72)',
    border: 'rgba(15, 23, 42, 0.12)',
    focusRing: 'rgba(27, 75, 139, 0.15)'
  },
  courses: []
};

@Injectable({
  providedIn: 'root'
})
export class WebsiteConfigService {
  private config: WebsiteConfig = DEFAULT_WEBSITE_CONFIG;

  constructor(
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  async loadConfig(): Promise<void> {
    try {
      const remoteConfig = await firstValueFrom(
        this.http.get<Partial<WebsiteConfig>>(environment.configFile)
      );
      this.config = this.mergeConfig(remoteConfig);
    } catch (error) {
      console.error(`Failed to load website config from ${environment.configFile}`, error);
      this.config = DEFAULT_WEBSITE_CONFIG;
    }

    this.applyTheme(this.config.theme);
    this.applyBranding();
  }

  get siteConfig(): WebsiteConfig {
    return this.config;
  }

  get branding() {
    return this.config.branding;
  }

  get contact(): WebsiteContactConfig {
    return this.config.contact;
  }

  get theme(): WebsiteThemeConfig {
    return this.config.theme;
  }

  get courses(): WebsiteCourseConfig[] {
    return this.config.courses;
  }

  get courseNames(): string[] {
    return this.config.courses.map(course => course.name);
  }

  findCourseBySlug(slug: string | null): WebsiteCourseConfig | undefined {
    if (!slug) {
      return undefined;
    }

    return this.config.courses.find(course => course.slug === slug);
  }

  private mergeConfig(remoteConfig?: Partial<WebsiteConfig>): WebsiteConfig {
    return {
      branding: {
        ...DEFAULT_WEBSITE_CONFIG.branding,
        ...(remoteConfig?.branding ?? {})
      },
      contact: {
        ...DEFAULT_WEBSITE_CONFIG.contact,
        ...(remoteConfig?.contact ?? {})
      },
      theme: {
        ...DEFAULT_WEBSITE_CONFIG.theme,
        ...(remoteConfig?.theme ?? {})
      },
      courses: remoteConfig?.courses?.length ? remoteConfig.courses : DEFAULT_WEBSITE_CONFIG.courses
    };
  }

  private applyTheme(theme: WebsiteThemeConfig): void {
    const root = this.document.documentElement;
    root.style.setProperty('--body-bg', theme.bodyBackground);
    root.style.setProperty('--header-bg', theme.headerBackground);
    root.style.setProperty('--header-border', theme.headerBorder);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--surface-alt', theme.surfaceAlt);
    root.style.setProperty('--ink', theme.textPrimary);
    root.style.setProperty('--muted', theme.textMuted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-strong', theme.accentStrong);
    root.style.setProperty('--accent-soft', theme.accentSoft);
    root.style.setProperty('--gold', theme.gold);
    root.style.setProperty('--dark-surface', theme.darkSurface);
    root.style.setProperty('--dark-surface-alt', theme.darkSurfaceAlt);
    root.style.setProperty('--on-dark', theme.onDark);
    root.style.setProperty('--on-dark-muted', theme.onDarkMuted);
    root.style.setProperty('--border', theme.border);
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
