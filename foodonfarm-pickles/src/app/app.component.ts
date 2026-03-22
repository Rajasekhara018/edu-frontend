import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CartItem, CartService } from './Services/cart.service';
import { Product } from './Services/product.model';
import { ProductsService } from './Services/products.service';
import { ImageFallbackUtil } from './Services/image-fallback.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly cartItems$ = this.cartService.cartItems$;
  readonly isDrawerOpen$ = this.cartService.isDrawerOpen$;
  readonly isCheckoutOpen$ = this.cartService.isCheckoutOpen$;
  readonly summary$ = this.cartItems$.pipe(map(items => this.cartService.getSummary(items)));
  couponCode = '';
  readonly upsellProducts: Product[];
  readonly rewardMilestones = [750, 1199, 1500];

  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService
  ) {
    this.upsellProducts = this.productsService.getCurrentProducts().slice(0, 6);
  }

  closeDrawer(): void {
    this.cartService.closeDrawer();
  }

  openCheckout(): void {
    this.cartService.openCheckout();
  }

  closeCheckout(): void {
    this.cartService.closeCheckout();
  }

  updateQuantity(item: CartItem, delta: number): void {
    const next = item.quantity + delta;
    if (next < 1) {
      return;
    }

    this.cartService.updateQuantity(item.key, next);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.key);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, product.weightOptions[0] || '250g', 1);
  }

  getProgressPercent(subtotal: number): number {
    const max = this.rewardMilestones[this.rewardMilestones.length - 1];
    if (!max) {
      return 0;
    }

    return Math.min(100, Math.max(0, (subtotal / max) * 100));
  }

  getProgressMessage(subtotal: number): string {
    if (subtotal >= 1500) {
      return 'All rewards unlocked. You qualify for the highest order benefit.';
    }

    if (subtotal >= 750) {
      const remaining = Math.max(0, 1500 - subtotal);
      return `Add Rs. ${remaining.toFixed(0)} more to unlock the 10% offer milestone.`;
    }

    const remaining = Math.max(0, 750 - subtotal);
    return `Add Rs. ${remaining.toFixed(0)} more to unlock the free sample milestone.`;
  }

  getSafeImage(url: string | undefined, label: string, context: string): string {
    return ImageFallbackUtil.ensureImage(url, label, context);
  }

  onImageError(event: Event, label: string, context: string): void {
    ImageFallbackUtil.handleImageError(event, label, context);
  }
}
