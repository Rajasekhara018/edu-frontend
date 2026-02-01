import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: 'PAY-001',
    customerId: 'CUST-101',
    customerName: 'Allied Pharma Distributors',
    amount: 68000,
    method: 'Bank',
    status: 'Completed',
    paymentDate: new Date().toISOString(),
    reference: 'NEFT-1234'
  },
  {
    id: 'PAY-002',
    customerId: 'CUST-103',
    customerName: 'CarePath Hospitals',
    amount: 42000,
    method: 'Cheque',
    status: 'Pending',
    paymentDate: new Date().toISOString(),
    reference: 'CHQ-4555'
  }
];

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  list(customerId: string | null, page: number, size: number): Observable<PageResponse<Payment>> {
    const filtered = customerId ? SAMPLE_PAYMENTS.filter(p => p.customerId === customerId) : SAMPLE_PAYMENTS;
    const totalElements = filtered.length;
    return of({
      data: filtered.slice(page * size, page * size + size),
      totalElements,
      page,
      size,
      totalPages: size ? Math.ceil(totalElements / size) : 0
    });
  }

  allocate(payload: any): Observable<Payment> {
    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      customerId: payload.customerId ?? 'CUST-101',
      customerName: payload.customerName ?? 'Customer',
      amount: payload.amount ?? 0,
      method: payload.method ?? 'Unknown',
      status: 'Allocated',
      paymentDate: new Date().toISOString(),
      reference: payload.reference
    };
    return of(payment);
  }
}
