import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./admin-command-center.component').then((m) => m.AdminCommandCenterComponent)
  }
];
