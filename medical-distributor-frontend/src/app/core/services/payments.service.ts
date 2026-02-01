import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './page-response';

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
  reference?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(customerId: string | null, page: number, size: number): Observable<PageResponse<Payment>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (customerId) {
      params = params.set('customerId', customerId);
    }
    return this.http.get<PageResponse<Payment>>(`${this.baseUrl}/payments`, { params });
  }

  allocate(payload: any): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/payments/allocate`, payload);
  }
}
