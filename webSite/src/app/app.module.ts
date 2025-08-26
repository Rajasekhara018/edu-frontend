import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingComponent } from './components/header/landing/landing.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './Services/material.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JioPgComponent } from './paymentGateways/jio-pg/jio-pg.component';
import { JuspayPgComponent } from './paymentGateways/juspay-pg/juspay-pg.component';
import { RazorpayPgComponent } from './paymentGateways/razorpay-pg/razorpay-pg.component';
import { PaymentGatewayComponent } from './paymentGateways/payment-gateway/payment-gateway.component';
import { PinelabsPgComponent } from './paymentGateways/pinelabs-pg/pinelabs-pg.component';

@NgModule({
  declarations: [ 
  AppComponent,
    HeaderComponent,
    LandingComponent,
    JioPgComponent,
    JuspayPgComponent,
    RazorpayPgComponent,
    PaymentGatewayComponent,
    PinelabsPgComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [DatePipe,CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
