import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './page-response';

export interface Customer {
  id: string;
  name: string;
  gstin: string;
  licenseNo: string;
  territory: string;
  creditLimit: number;
  creditUsed: number;
  status: string;
  primaryContact?: string;
  paymentTermsDays?: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(search: string, page: number, size: number, sort?: string): Observable<PageResponse<Customer>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<Customer>>(`${this.baseUrl}/customers`, { params });
  }

  get(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`);
  }
}
