import { NgModule } from '@angular/core';
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
import { Profile } from './profile/profile';
import { Settings } from './settings/settings';
import { Sidenav } from './sidenav/sidenav';
import { LucideAngularModule, Home, FileText, CheckCircle, Clock, FolderOpen, Users, BarChart3, Settings as SettingsIcon, Trash, CreditCard } from 'lucide-angular';
@NgModule({
  declarations: [
    App,
    Header,
    Landing,
    Profile,
    Settings,
    Sidenav
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    LucideAngularModule.pick({
      Home,
      FileText,
      CheckCircle,
      Clock,
      FolderOpen,
      Users,
      BarChart3,
      SettingsIcon,
      Trash,
      CreditCard
    }),
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    provideAnimationsAsync()
  ],
  bootstrap: [App]
})
export class AppModule { }
