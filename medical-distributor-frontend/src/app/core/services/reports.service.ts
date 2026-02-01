import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './page-response';

export interface SalesReportRow {
  invoiceId: string;
  invoiceNo: string;
  invoiceDate: string;
  customerId: string;
  customerName: string;
  netTotal: number;
}

export interface OutstandingAgingRow {
  customerId: string;
  customerName: string;
  bucket0to30: number;
  bucket31to60: number;
  bucket61to90: number;
  bucket90plus: number;
  totalOutstanding: number;
}

export interface NearExpiryRow {
  batchId: string;
  productId: string;
  productName: string;
  batchNo: string;
  expiryDate: string;
  qtyAvailable: number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  salesReport(from: string | null, to: string | null, page: number, size: number, sort?: string): Observable<PageResponse<SalesReportRow>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<SalesReportRow>>(`${this.baseUrl}/reports/sales`, { params });
  }

  outstandingAging(): Observable<OutstandingAgingRow[]> {
    return this.http.get<OutstandingAgingRow[]>(`${this.baseUrl}/reports/outstanding-aging`);
  }

  nearExpiry(days: number, page: number, size: number, sort?: string): Observable<PageResponse<NearExpiryRow>> {
    let params = new HttpParams().set('days', days).set('page', page).set('size', size);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<NearExpiryRow>>(`${this.baseUrl}/reports/near-expiry`, { params });
  }
}
