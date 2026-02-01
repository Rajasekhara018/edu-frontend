import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CUSTOMERS } from '../data/seeds';

export interface SalesOrderLineRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface SalesOrderRequest {
  customerId: string;
  orderDate?: string;
  branchCode?: string;
  lines: SalesOrderLineRequest[];
}

export interface SalesOrderLineResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  netAmount: number;
}

export interface SalesOrderResponse {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  status: string;
  allocationStatus: string;
  orderDate: string;
  branchCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  netTotal: number;
  lines: SalesOrderLineResponse[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'md_orders';
  private orders: SalesOrderResponse[] = [];
  private sequence = 1000;

  constructor() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.orders = JSON.parse(stored);
        this.sequence = this.orders.length + 1000;
      } catch {
        this.orders = [];
      }
    } else {
      this.orders = [];
    }
  }

  create(order: SalesOrderRequest): Observable<SalesOrderResponse> {
    const response = this.buildOrder(order);
    this.orders.unshift(response);
    this.persist();
    return of(response);
  }

  allocate(orderId: string): Observable<SalesOrderResponse> {
    const order = this.orders.find(item => item.id === orderId);
    if (order) {
      order.allocationStatus = 'Allocated';
      order.status = 'Allocated';
      this.persist();
      return of(order);
    }
    return of(this.seedSampleOrder());
  }

  get(orderId: string): Observable<SalesOrderResponse> {
    const order = this.orders.find(item => item.id === orderId);
    if (order) {
      return of(order);
    }
    return of(this.seedSampleOrder());
  }

  listOrders(): SalesOrderResponse[] {
    return [...this.orders];
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
  }

  private seedSampleOrder(): SalesOrderResponse {
    if (this.orders.length > 0) {
      return this.orders[0];
    }
    const payload: SalesOrderRequest = {
      customerId: CUSTOMERS[0].id,
      lines: [
        {
          productId: 'MED-001',
          quantity: 100,
          unitPrice: 68,
          discount: 120,
          taxRate: 5
        }
      ]
    };
    const order = this.buildOrder(payload);
    this.orders.unshift(order);
    this.persist();
    return order;
  }

  private buildOrder(payload: SalesOrderRequest, existing?: SalesOrderResponse): SalesOrderResponse {
    const customer = CUSTOMERS.find(c => c.id === payload.customerId);
    const lines: SalesOrderLineResponse[] = payload.lines.map((line, index) => {
      const net =
        line.quantity * line.unitPrice - line.discount +
        ((line.quantity * line.unitPrice - line.discount) * line.taxRate) / 100;
      return {
        id: `L-${Date.now()}-${index}`,
        productId: line.productId,
        productName: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: line.discount,
        taxRate: line.taxRate,
        netAmount: Number(net.toFixed(2))
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const discountTotal = lines.reduce((sum, line) => sum + line.discount, 0);
    const taxTotal = lines.reduce((sum, line) => sum + ((line.quantity * line.unitPrice - line.discount) * line.taxRate) / 100, 0);
    const orderNo = existing?.orderNo ?? `MD${++this.sequence}`;
    return {
      id: existing?.id ?? `ORD-${Date.now()}`,
      orderNo,
      customerId: payload.customerId,
      customerName: customer?.name ?? 'Retail customer',
      status: existing?.status ?? 'Draft',
      allocationStatus: existing?.allocationStatus ?? 'Unallocated',
      orderDate: payload.orderDate ?? new Date().toISOString(),
      branchCode: payload.branchCode ?? 'HQ',
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      netTotal: Number((subtotal - discountTotal + taxTotal).toFixed(2)),
      lines
    };
  }

}
