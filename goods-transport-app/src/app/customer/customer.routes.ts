import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./customer-dashboard.component').then((m) => m.CustomerDashboardComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./customer-bookings.component').then((m) => m.CustomerBookingsComponent)
  }
];
