import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReturnLine {
  productId: string;
  batchId: string;
  returnQty: number;
  saleable: boolean;
}

export interface ReturnRequest {
  invoiceId: string;
  reason: string;
  lines: ReturnLine[];
}

export interface CreditNoteResponse {
  id: string;
  creditNoteNo: string;
  invoiceNo: string;
  totalAmount: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ReturnsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createReturn(payload: ReturnRequest): Observable<CreditNoteResponse> {
    return this.http.post<CreditNoteResponse>(`${this.baseUrl}/returns`, payload);
  }

  getCreditNote(id: string): Observable<CreditNoteResponse> {
    return this.http.get<CreditNoteResponse>(`${this.baseUrl}/credit-notes/${id}`);
  }
}
