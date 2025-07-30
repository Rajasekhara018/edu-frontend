import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayEaseCommonTable } from './shared/pay-ease-common-table/pay-ease-common-table';
import { authGuard } from './auth/auth.guard';
import { Landing } from './landing/landing';
import { Profile } from './profile/profile';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('../app/auth/auth-module').then(p => p.AuthModule) },
  { path: 'dashboard', loadChildren: () => import('../app/dashboard/dashboard-module').then(p => p.DashboardModule) },
  { path: 'csearch/:id', component: PayEaseCommonTable, canActivate: [authGuard] },
  { path: 'home', component: Landing },
  { path: 'profile', component: Profile },
  { path: '', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
