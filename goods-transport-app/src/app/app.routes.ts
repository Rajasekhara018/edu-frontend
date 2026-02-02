import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'customer',
    // canMatch: [AuthGuard, RoleGuard],
    // data: { role: 'CUSTOMER' },
    loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes)
  },
  {
    path: 'driver',
    // canMatch: [AuthGuard, RoleGuard],
    // data: { role: 'DRIVER' },
    loadChildren: () => import('./driver/driver.routes').then((m) => m.driverRoutes)
  },
  {
    path: 'admin',
    // canMatch: [AuthGuard, RoleGuard],
    // data: { role: 'ADMIN' },
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes)
  },
  {
    path: 'booking',
    // canMatch: [AuthGuard],
    loadChildren: () => import('./booking/booking.routes').then((m) => m.bookingRoutes)
  },
  { path: '**', redirectTo: 'auth' }
];
