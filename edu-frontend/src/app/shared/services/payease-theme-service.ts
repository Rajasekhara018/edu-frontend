import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppThemeOption {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  accent: string;
  surface: string;
  sidebar: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayeaseThemeService {
  readonly themeOptions: AppThemeOption[] = [
    { id: 'theme-sunrise', name: 'Sunrise', mode: 'light', accent: '#2563eb', surface: '#fff8f1', sidebar: '#1f2937' },
    { id: 'theme-midnight', name: 'Midnight', mode: 'dark', accent: '#60a5fa', surface: '#0f172a', sidebar: '#020617' },
    { id: 'theme-emerald', name: 'Emerald', mode: 'light', accent: '#059669', surface: '#f2fbf7', sidebar: '#163b35' },
    { id: 'theme-royal', name: 'Royal', mode: 'dark', accent: '#8b5cf6', surface: '#1b1534', sidebar: '#120f24' },
    { id: 'theme-coral', name: 'Coral', mode: 'light', accent: '#f97316', surface: '#fff5ef', sidebar: '#3a2418' },
    { id: 'theme-teal', name: 'Teal', mode: 'light', accent: '#0f766e', surface: '#eefcf9', sidebar: '#16332f' },
    { id: 'theme-slate', name: 'Slate', mode: 'dark', accent: '#94a3b8', surface: '#111827', sidebar: '#030712' },
    { id: 'theme-rose', name: 'Rose', mode: 'light', accent: '#e11d48', surface: '#fff1f5', sidebar: '#3b1523' },
    { id: 'theme-amber', name: 'Amber', mode: 'light', accent: '#d97706', surface: '#fff8eb', sidebar: '#382515' },
    { id: 'theme-ocean', name: 'Ocean', mode: 'dark', accent: '#06b6d4', surface: '#082f49', sidebar: '#072033' },
    { id: 'theme-forest', name: 'Forest', mode: 'dark', accent: '#22c55e', surface: '#0f2418', sidebar: '#08130d' },
    { id: 'theme-graphite', name: 'Graphite', mode: 'dark', accent: '#f59e0b', surface: '#171717', sidebar: '#09090b' }
  ];

  private readonly storageKey = 'appTheme';
  private readonly themeIds = this.themeOptions.map((theme) => theme.id);
  private readonly defaultTheme = this.themeOptions[0];

  readonly themeSubject = new BehaviorSubject<string>(this.defaultTheme.id);
  readonly theme$ = this.themeSubject.asObservable();
  themeType = this.defaultTheme.id;

  constructor(
    public overlayContainer: OverlayContainer,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.setInitialTheme();
  }

  get currentTheme(): AppThemeOption {
    return this.themeOptions.find((theme) => theme.id === this.themeType) ?? this.defaultTheme;
  }

  setInitialTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
    this.applyTheme(savedTheme && this.themeIds.includes(savedTheme) ? savedTheme : this.defaultTheme.id);
  }

  changeTheme(): void {
    const darkFallback = this.themeOptions.find((theme) => theme.mode === 'dark') ?? this.defaultTheme;
    const nextTheme = this.currentTheme.mode === 'dark' ? this.defaultTheme.id : darkFallback.id;
    this.applyTheme(nextTheme);
  }

  switchTheme(theme: string): void {
    this.applyTheme(theme);
  }

  private applyTheme(themeId: string): void {
    const nextTheme = this.themeOptions.find((theme) => theme.id === themeId) ?? this.defaultTheme;
    this.themeIds.forEach((id) => {
      this.document.body.classList.remove(id);
      this.overlayContainer.getContainerElement().classList.remove(id);
    });
    this.document.body.classList.toggle('dark-theme', nextTheme.mode === 'dark');
    this.overlayContainer.getContainerElement().classList.toggle('dark-theme', nextTheme.mode === 'dark');
    this.document.body.classList.add(nextTheme.id);
    this.overlayContainer.getContainerElement().classList.add(nextTheme.id);
    this.themeSubject.next(nextTheme.id);
    this.themeType = nextTheme.id;
    localStorage.setItem(this.storageKey, nextTheme.id);
    sessionStorage.setItem(this.storageKey, nextTheme.id);
  }
}

