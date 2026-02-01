import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './layout/layout.component';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { LoginPageComponent } from './pages/auth/login-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { CustomersPageComponent } from './pages/customers/customers-page.component';
import { CustomerDetailPageComponent } from './pages/customers/customer-detail-page.component';
import { InventoryPageComponent } from './pages/inventory/inventory-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { OrderCreatePageComponent } from './pages/orders/order-create-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page.component';
import { PaymentsPageComponent } from './pages/payments/payments-page.component';
import { ReturnsPageComponent } from './pages/returns/returns-page.component';
import { ReportsPageComponent } from './pages/reports/reports-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'shop',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: ProductsPageComponent },
      { path: 'checkout', component: CheckoutPageComponent }
    ]
  },
  { path: 'products', redirectTo: 'shop', pathMatch: 'full' },
  { path: 'checkout', redirectTo: 'shop/checkout', pathMatch: 'full' },
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'customers', component: CustomersPageComponent },
      { path: 'customers/:id', component: CustomerDetailPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'inventory', component: InventoryPageComponent },
      {
        path: 'orders/new',
        component: OrderCreatePageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SALES_REP', 'SALES_MANAGER'] }
      },
      {
        path: 'checkout',
        component: CheckoutPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['WAREHOUSE', 'FINANCE'] }
      },
      {
        path: 'checkout/:id',
        component: CheckoutPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['WAREHOUSE', 'FINANCE'] }
      },
      {
        path: 'payments',
        component: PaymentsPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['FINANCE'] }
      },
      {
        path: 'returns',
        component: ReturnsPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SUPPORT', 'FINANCE'] }
      },
      {
        path: 'reports',
        component: ReportsPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SALES_MANAGER', 'FINANCE', 'AUDITOR'] }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
