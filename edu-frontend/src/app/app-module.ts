import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Landing } from './landing/landing';

@NgModule({
  declarations: [
    App,
    Header,
    Landing
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    provideAnimationsAsync()
  ],
  bootstrap: [App]
})
export class AppModule { }
