import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import './styles.css';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes)]
});
