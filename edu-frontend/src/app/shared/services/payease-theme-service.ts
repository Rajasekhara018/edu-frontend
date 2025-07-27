import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayeaseThemeService {
 themeSubject = new BehaviorSubject<string>('light_mode');
  theme$ = this.themeSubject.asObservable();
  themeType: string = 'light_mode';

  constructor(public overlayContainer: OverlayContainer, @Inject(DOCUMENT) private document: any) {
    this.setInitialTheme();
  }

  setInitialTheme() {
    if (this.themeType === 'dark_mode') {
      this.document.body.classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('dark_mode');
    } else {
      this.document.body.classList.remove('dark-theme');
      this.overlayContainer.getContainerElement().classList.remove('dark_mode');
    }
  }

  changeTheme() {
    if (this.themeType === 'light_mode') {
      this.themeSubject.next('dark_mode');
      this.themeType = 'dark_mode';
      this.document.body.classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('dark_mode');
    } else {
      this.themeSubject.next('light_mode');
      this.themeType = 'light_mode';
      this.document.body.classList.remove('dark-theme');
      this.overlayContainer.getContainerElement().classList.remove('dark_mode');
    }
  }
  private readonly themes = ['theme1', 'theme2', 'theme3', 'theme4', 'dark-theme', 'theme5', 'theme6']; // Add all theme classes here
  switchTheme(theme: string) {
    this.themeSubject.next(theme);
    this.themeType = theme;
    this.themes.forEach((theme) => {
      this.document.body.classList.remove(theme);
      this.overlayContainer.getContainerElement().classList.remove(theme);
    });
    this.document.body.classList.add(theme);
    this.overlayContainer.getContainerElement().classList.add(theme);
    if(theme === 'dark-theme'){
      this.themeSubject.next('dark-theme');
      this.themeType = 'dark_mode';
      this.document.body.classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('dark_mode');
    }
    localStorage.setItem('appTheme', theme);
    sessionStorage.setItem('appTheme', theme);
  }
}

