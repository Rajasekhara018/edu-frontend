import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: 'wizard',
    loadComponent: () => import('./booking-wizard.component').then((m) => m.BookingWizardComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./booking-detail.component').then((m) => m.BookingDetailComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'wizard' }
];
