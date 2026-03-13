import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { inject, provideAppInitializer } from '@angular/core';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { AppProfileConfigService } from './app/core/app-profile-config.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes, withHashLocation()),
    provideAppInitializer(() => inject(AppProfileConfigService).loadConfig())
  ]
}).catch((err) => console.error(err));
