import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { ShippingPolicyComponent } from './components/shipping-policy/shipping-policy.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsListComponent,
    CartComponent,
    CheckoutComponent,
    AdminDashboardComponent,
    OrderSuccessComponent,
    TermsConditionsComponent,
    ShippingPolicyComponent,
    PrivacyPolicyComponent,
    ContactPageComponent
  ],
  imports: [BrowserModule, CommonModule, RouterModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
