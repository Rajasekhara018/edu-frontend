import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';

export interface CartItem {
  key: string;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedWeight: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'fof_cart_items';
  private readonly drawerSubject = new BehaviorSubject<boolean>(false);
  private readonly checkoutSubject = new BehaviorSubject<boolean>(false);
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readStorage());

  readonly cartItems$ = this.itemsSubject.asObservable();
  readonly isDrawerOpen$ = this.drawerSubject.asObservable();
  readonly isCheckoutOpen$ = this.checkoutSubject.asObservable();

  openDrawer(): void {
    this.drawerSubject.next(true);
  }

  closeDrawer(): void {
    this.drawerSubject.next(false);
  }

  openCheckout(): void {
    this.drawerSubject.next(false);
    this.checkoutSubject.next(true);
  }

  closeCheckout(): void {
    this.checkoutSubject.next(false);
  }

  addItem(product: Product, selectedWeight: string, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const key = `${product.id}-${selectedWeight}`;
    const existing = items.find(item => item.key === key);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        key,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        selectedWeight
      });
    }

    this.persist(items);
  }

  updateQuantity(key: string, quantity: number): void {
    const items = [...this.itemsSubject.value];
    const found = items.find(item => item.key === key);
    if (!found) {
      return;
    }

    found.quantity = Math.max(1, quantity);
    this.persist(items);
  }

  removeItem(key: string): void {
    this.persist(this.itemsSubject.value.filter(item => item.key !== key));
  }

  clearCart(): void {
    this.persist([]);
    this.checkoutSubject.next(false);
  }

  getItemsSnapshot(): CartItem[] {
    return [...this.itemsSubject.value];
  }

  getSummary(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 1200 || subtotal === 0 ? 0 : 80;
    const tax = subtotal * 0.05;

    return {
      itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax
    };
  }

  private persist(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.writeStorage(items);
  }

  private readStorage(): CartItem[] {
    if (typeof window === 'undefined') {
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
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
