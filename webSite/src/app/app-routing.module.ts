import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/header/landing/landing.component';
import { JioPgComponent } from './paymentGateways/jio-pg/jio-pg.component';
import { JuspayPgComponent } from './paymentGateways/juspay-pg/juspay-pg.component';
import { RazorpayPgComponent } from './paymentGateways/razorpay-pg/razorpay-pg.component';
import { PaymentGatewayComponent } from './paymentGateways/payment-gateway/payment-gateway.component';
import { PinelabsPgComponent } from './paymentGateways/pinelabs-pg/pinelabs-pg.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
   { path: '', component: LandingComponent },
   { path: 'jio', component: JioPgComponent},
   { path: 'razorpay', component: RazorpayPgComponent},
   { path: 'juspay', component: JuspayPgComponent},
   { path: 'pinelabs', component: PinelabsPgComponent},
   { path: 'pg', component: PaymentGatewayComponent},
   { path: 'checkout', component: CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
