import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './Services/material.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroceryConfigService } from './Services/grocery-config.service';

function initializeGroceryConfig(configService: GroceryConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, ProductsListComponent, ProductDetailComponent, CartComponent],
  imports: [BrowserAnimationsModule, BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, MaterialModule],
  providers: [
    DatePipe,
    CurrencyPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeGroceryConfig,
      deps: [GroceryConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
