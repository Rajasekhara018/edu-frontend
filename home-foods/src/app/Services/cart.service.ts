import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'electro_cart_items';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readStorage());

  readonly cartItems$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  readonly cartCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  addItem(product: Product, quantity: number = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.persist(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = [...this.itemsSubject.value];
    const target = items.find(item => item.product.id === productId);
    if (!target) {
      return;
    }

    target.quantity = Math.max(1, quantity);
    this.persist(items);
  }

  removeItem(productId: number): void {
    const items = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.persist(items);
  }

  clearCart(): void {
    this.persist([]);
  }

  private persist(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.writeStorage(items);
  }

  private readStorage(): CartItem[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private writeStorage(items: CartItem[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage errors to avoid breaking the UI.
    }
  }
}
