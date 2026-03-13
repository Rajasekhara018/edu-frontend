export interface WebsiteThemeConfig {
  bodyBackground: string;
  headerBackground: string;
  headerBorder: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  gold: string;
  darkSurface: string;
  darkSurfaceAlt: string;
  onDark: string;
  onDarkMuted: string;
  border: string;
  focusRing: string;
}

export interface WebsiteBrandingConfig {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  pageTitle: string;
  footerSummary: string;
  footerCopyright: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
}

export interface WebsiteContactConfig {
  phone: string;
  hours: string;
  primaryEmail: string;
  secondaryEmail: string;
}

export interface WebsiteCourseConfig {
  slug: string;
  name: string;
  price: number;
  image: string;
  level: string;
  duration: string;
  summary: string;
  syllabus: string[];
}

export interface WebsiteConfig {
  branding: WebsiteBrandingConfig;
  contact: WebsiteContactConfig;
  theme: WebsiteThemeConfig;
  courses: WebsiteCourseConfig[];
}
