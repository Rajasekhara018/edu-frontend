import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvoiceResponse {
  id: string;
  invoiceNo: string;
  status: string;
  netTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createInvoice(orderId: string): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.baseUrl}/checkout/${orderId}/invoice`, {});
  }

  getInvoicePdf(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
  }
}
