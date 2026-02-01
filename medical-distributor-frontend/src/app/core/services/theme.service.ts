import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppTheme {
  id: string;
  label: string;
  className: string;
  accent: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'md-theme';
  readonly themes: AppTheme[] = [
    { id: 'emerald', label: 'Emerald Grove', className: 'theme-emerald', accent: '#16a34a' },
    { id: 'azure', label: 'Azure Current', className: 'theme-azure', accent: '#2563eb' },
    { id: 'saffron', label: 'Saffron Ember', className: 'theme-saffron', accent: '#f97316' },
    { id: 'sunrise', label: 'Sunrise Flush', className: 'theme-sunrise', accent: '#fb923c' },
    { id: 'lumina', label: 'Lumina Gold', className: 'theme-lumina', accent: '#facc15' },
    { id: 'rose', label: 'Rosy Horizon', className: 'theme-rose', accent: '#be185d' },
    { id: 'violet', label: 'Violet Pulse', className: 'theme-violet', accent: '#7c3aed' },
    { id: 'teal', label: 'Teal Tide', className: 'theme-teal', accent: '#0ea5e9' }
  ];

  private currentThemeSubject = new BehaviorSubject<AppTheme>(this.themes[0]);
  readonly theme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const stored = this.getStoredThemeId();
    const initial = this.themes.find(theme => theme.id === stored) ?? this.themes[0];
    this.applyTheme(initial);
  }

  setTheme(themeId: string): void {
    const next = this.themes.find(theme => theme.id === themeId);
    if (!next) {
      return;
    }
    this.applyTheme(next);
  }

  private applyTheme(theme: AppTheme): void {
    const classes = this.themes.map(t => t.className);
    document.body.classList.remove(...classes);
    document.body.classList.add(theme.className);
    this.setStoredThemeId(theme.id);
    this.currentThemeSubject.next(theme);
  }

  private getStoredThemeId(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.storageKey);
  }

  private setStoredThemeId(themeId: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.storageKey, themeId);
  }
}
