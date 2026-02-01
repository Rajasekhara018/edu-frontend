import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { TopbarComponent } from './layout/topbar.component';
import { SidenavComponent } from './layout/sidenav.component';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { PublicTopbarComponent } from './layout/public-topbar.component';
import { LoginPageComponent } from './pages/auth/login-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { CustomersPageComponent } from './pages/customers/customers-page.component';
import { CustomerDetailPageComponent } from './pages/customers/customer-detail-page.component';
import { InventoryPageComponent } from './pages/inventory/inventory-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { ProductDetailDialogComponent } from './pages/products/product-detail-dialog.component';
import { OrderCreatePageComponent } from './pages/orders/order-create-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page.component';
import { PaymentsPageComponent } from './pages/payments/payments-page.component';
import { PaymentAllocationDialogComponent } from './pages/payments/payment-allocation-dialog.component';
import { ReturnsPageComponent } from './pages/returns/returns-page.component';
import { ReportsPageComponent } from './pages/reports/reports-page.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App,
    LayoutComponent,
    TopbarComponent,
    SidenavComponent,
    PublicLayoutComponent,
    PublicTopbarComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CustomersPageComponent,
    CustomerDetailPageComponent,
    InventoryPageComponent,
    ProductsPageComponent,
    ProductDetailDialogComponent,
    OrderCreatePageComponent,
    CheckoutPageComponent,
    PaymentsPageComponent,
    PaymentAllocationDialogComponent,
    ReturnsPageComponent,
    ReportsPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule {}
