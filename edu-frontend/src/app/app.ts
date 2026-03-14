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
  showWorkspaceShell = true;

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
    this.showWorkspaceShell = !url.startsWith('/auth');
  }
}
