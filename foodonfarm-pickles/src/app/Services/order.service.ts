import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  billingAddress?: CustomerDetails;
  paymentMethod: string;
  summary: {
    itemsCount: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'fof_orders';

  placeOrder(orderInput: Omit<Order, 'id' | 'createdAt'>): Order {
    const nextOrder: Order = {
      ...orderInput,
      id: `FOF-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const orders = this.getOrders();
    window.localStorage.setItem(this.storageKey, JSON.stringify([nextOrder, ...orders]));
    return nextOrder;
  }

  getOrders(): Order[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
      return [];
    }
  }
}
