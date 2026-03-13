import { Routes } from '@angular/router';
import { AuthMatchGuard } from './core/auth-match.guard';
import { RoleMatchGuard } from './core/role-match.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home-executive.component').then((m) => m.HomeExecutiveComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'customer',
    canMatch: [AuthMatchGuard, RoleMatchGuard],
    data: { role: 'CUSTOMER' },
    loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes)
  },
  {
    path: 'driver',
    canMatch: [AuthMatchGuard, RoleMatchGuard],
    data: { role: 'DRIVER' },
    loadChildren: () => import('./driver/driver.routes').then((m) => m.driverRoutes)
  },
  {
    path: 'admin',
    canMatch: [AuthMatchGuard, RoleMatchGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes)
  },
  {
    path: 'booking',
    canMatch: [AuthMatchGuard],
    loadChildren: () => import('./booking/booking.routes').then((m) => m.bookingRoutes)
  },
  { path: '**', redirectTo: '' }
];
