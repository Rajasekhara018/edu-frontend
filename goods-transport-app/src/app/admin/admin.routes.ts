import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  }
];
