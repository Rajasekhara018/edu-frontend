import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { ShippingPolicyComponent } from './components/shipping-policy/shipping-policy.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsListComponent },
  { path: 'collections/:slug', component: ProductsListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', redirectTo: '/products', pathMatch: 'full' },
  { path: 'order-success/:orderId', component: OrderSuccessComponent },
  { path: 'pages/terms-conditions', component: TermsConditionsComponent },
  { path: 'pages/shipping-delivery-policies', component: ShippingPolicyComponent },
  { path: 'pages/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'pages/contact', component: ContactPageComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
