import { Component, signal } from '@angular/core';
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
  constructor(public postService: PayeaseRestservice, public authService: PayeaseAuthService,public themeService: PayeaseThemeService
  ) {
  }
  // get textDirection(): 'rtl' | 'ltr' | 'auto' {
  //   return this.languageService.localeLanguage === 'ar' ? 'rtl' : 'ltr';
  // }
  trackById(index: number, item: ToastMessage): number {
    return item.id;
  }
}
