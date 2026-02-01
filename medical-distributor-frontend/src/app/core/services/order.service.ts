import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  create(order: SalesOrderRequest): Observable<SalesOrderResponse> {
    return this.http.post<SalesOrderResponse>(`${this.baseUrl}/orders`, order);
  }

  allocate(orderId: string): Observable<SalesOrderResponse> {
    return this.http.post<SalesOrderResponse>(`${this.baseUrl}/orders/${orderId}/allocate`, {});
  }

  get(orderId: string): Observable<SalesOrderResponse> {
    return this.http.get<SalesOrderResponse>(`${this.baseUrl}/orders/${orderId}`);
  }
}
