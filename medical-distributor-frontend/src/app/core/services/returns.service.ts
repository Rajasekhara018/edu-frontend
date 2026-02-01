import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  private readonly storageKey = 'md_credit_notes';
  private notes: CreditNoteResponse[] = [];

  constructor() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.notes = JSON.parse(stored);
      } catch {
        this.notes = [];
      }
    }
  }

  createReturn(payload: ReturnRequest): Observable<CreditNoteResponse> {
    const amount = payload.lines.reduce((sum, line) => sum + line.returnQty * 10, 0);
    const note: CreditNoteResponse = {
      id: `CRT-${Date.now()}`,
      creditNoteNo: `CN-${this.notes.length + 1}`,
      invoiceNo: payload.invoiceId,
      totalAmount: amount,
      status: 'Issued'
    };
    this.notes.push(note);
    this.persist();
    return of(note);
  }

  getCreditNote(id: string): Observable<CreditNoteResponse | undefined> {
    return of(this.notes.find(note => note.id === id));
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }
}
