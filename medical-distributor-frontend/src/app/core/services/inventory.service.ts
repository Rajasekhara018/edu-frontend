import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './page-response';

export interface InventoryBatch {
  id: string;
  productId: string;
  productName: string;
  batchNo: string;
  expiryDate: string;
  mrp: number;
  qtyAvailable: number;
  qtyReserved: number;
  branchCode: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listBatches(productId: string | null, page: number, size: number, sort?: string): Observable<PageResponse<InventoryBatch>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (productId) params = params.set('productId', productId);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<InventoryBatch>>(`${this.baseUrl}/inventory/batches`, { params });
  }

  nearExpiry(days: number, page: number, size: number, sort?: string): Observable<PageResponse<InventoryBatch>> {
    let params = new HttpParams().set('days', days).set('page', page).set('size', size);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<InventoryBatch>>(`${this.baseUrl}/inventory/batches/near-expiry`, { params });
  }
}
