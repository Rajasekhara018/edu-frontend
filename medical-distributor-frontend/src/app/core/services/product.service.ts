import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './page-response';

export interface Product {
  id: string;
  sku: string;
  name: string;
  hsn: string;
  gstRate: number;
  manufacturer: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(search: string, page: number, size: number, sort?: string): Observable<PageResponse<Product>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<Product>>(`${this.baseUrl}/products`, { params });
  }
}
