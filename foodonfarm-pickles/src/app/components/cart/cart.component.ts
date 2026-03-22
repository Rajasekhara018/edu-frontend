import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CartItem, CartService } from '../../Services/cart.service';
import { ImageFallbackUtil } from '../../Services/image-fallback.util';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  readonly cartItems$ = this.cartService.cartItems$;
  readonly summary$ = this.cartItems$.pipe(map(items => this.cartService.getSummary(items)));

  constructor(private readonly cartService: CartService) {}

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

  clearCart(): void {
    this.cartService.clearCart();
  }

  openCheckout(): void {
    this.cartService.openCheckout();
  }

  getSafeImage(url: string | undefined, label: string): string {
    return ImageFallbackUtil.ensureImage(url, label, 'Cart Item');
  }

  onImageError(event: Event, label: string): void {
    ImageFallbackUtil.handleImageError(event, label, 'Cart Item');
  }
}
