import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastMessage } from './shared/model';
import { PayeaseAuthService } from './shared/services/payease-auth-service';
import { PayeaseRestservice } from './shared/services/payease-restservice';
import { PayeaseThemeService } from './shared/services/payease-theme-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pay-ease-web');
  showWorkspaceShell = false;
  private readonly publicRoutePrefixes = ['/auth'];
  private readonly publicRoutes = new Set(['', '/', '/login', '/register', '/reset-password']);

  constructor(
    public postService: PayeaseRestservice,
    public authService: PayeaseAuthService,
    public themeService: PayeaseThemeService,
    private readonly router: Router
  ) {
    this.syncShellMode(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncShellMode(event.urlAfterRedirects));
  }
  // get textDirection(): 'rtl' | 'ltr' | 'auto' {
  //   return this.languageService.localeLanguage === 'ar' ? 'rtl' : 'ltr';
  // }
  trackById(index: number, item: ToastMessage): number {
    return item.id;
  }

  private syncShellMode(url: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    const isPublicRoute = this.publicRoutes.has(normalizedUrl)
      || this.publicRoutePrefixes.some((prefix) => normalizedUrl.startsWith(prefix));

    this.showWorkspaceShell = this.authService.isloggedin() && !isPublicRoute;
  }

  private normalizeUrl(url: string): string {
    const withoutQuery = url.split('?')[0]?.split('#')[0] ?? '';
    return withoutQuery.endsWith('/') && withoutQuery.length > 1
      ? withoutQuery.slice(0, -1)
      : withoutQuery;
  }
}
