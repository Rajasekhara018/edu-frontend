import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartService } from '../../Services/cart.service';

interface CartSummary {
  itemsCount: number;
  subtotal: number;
  savings: number;
  tax: number;
  shipping: number;
  total: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
  summary$: Observable<CartSummary> = this.cartItems$.pipe(
    map(items => {
      const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const savings = items.reduce((sum, item) => {
        const original = item.product.originalPrice || item.product.price;
        return sum + (original - item.product.price) * item.quantity;
      }, 0);
      const tax = subtotal * 0.18;
      const shipping = subtotal > 0 ? 0 : 0;
      return {
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        savings,
        tax,
        shipping,
        total: subtotal + tax + shipping
      };
    })
  );

  constructor(private cartService: CartService) {}

  updateQuantity(item: CartItem, delta: number): void {
    const nextQty = item.quantity + delta;
    if (nextQty < 1) {
      return;
    }
    this.cartService.updateQuantity(item.product.id, nextQty);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
