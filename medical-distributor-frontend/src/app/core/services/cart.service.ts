import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit?: string;
}

export interface CartSummary {
  count: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  summary$ = this.items$.pipe(
    map(items => ({
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.qty * item.price, 0)
    }))
  );

  addItem(item: CartItem, qty = 1): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex(existing => existing.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], qty: items[index].qty + qty };
    } else {
      items.push({ ...item, qty });
    }
    this.itemsSubject.next(items);
  }

  setQty(id: string, qty: number): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex(existing => existing.id === id);
    if (index === -1) {
      return;
    }
    if (qty <= 0) {
      items.splice(index, 1);
    } else {
      items[index] = { ...items[index], qty };
    }
    this.itemsSubject.next(items);
  }

  getQty(id: string): number {
    return this.itemsSubject.value.find(item => item.id === id)?.qty ?? 0;
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
