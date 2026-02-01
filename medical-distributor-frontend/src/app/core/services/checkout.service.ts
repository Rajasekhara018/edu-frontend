import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { OrderService, SalesOrderResponse } from './order.service';

export interface InvoiceResponse {
  id: string;
  invoiceNo: string;
  status: string;
  netTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly storageKey = 'md_invoices';
  private invoices: InvoiceResponse[] = [];
  private sequence = 2000;

  constructor(private orderService: OrderService) {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.invoices = JSON.parse(stored);
        this.sequence = this.invoices.length + 2000;
      } catch {
        this.invoices = [];
      }
    }
  }

  createInvoice(orderId: string): Observable<InvoiceResponse> {
    return this.orderService.get(orderId).pipe(
      map(order => this.buildInvoice(order))
    );
  }

  getInvoicePdf(invoiceId: string): Observable<Blob> {
    const payload = `Invoice ID: ${invoiceId}`;
    return of(new Blob([payload], { type: 'application/pdf' }));
  }

  private buildInvoice(order: SalesOrderResponse): InvoiceResponse {
    let existing = this.invoices.find(invoice => invoice.id === order.id);
    if (existing) {
      existing.netTotal = order.netTotal;
      existing.status = 'Updated';
    } else {
      existing = {
        id: order.id,
        invoiceNo: `INV-${++this.sequence}`,
        status: 'Issued',
        netTotal: order.netTotal
      };
      this.invoices.push(existing);
    }
    this.persist();
    return existing;
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.invoices));
  }
}
