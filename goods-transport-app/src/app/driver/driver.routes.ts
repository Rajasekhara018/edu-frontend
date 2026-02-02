import { Routes } from '@angular/router';

export const driverRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./driver-dashboard.component').then((m) => m.DriverDashboardComponent)
  },
  {
    path: 'job/:id',
    loadComponent: () => import('./driver-job.component').then((m) => m.DriverJobComponent)
  }
];
