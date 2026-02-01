import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PageResponse } from './page-response';
import { CUSTOMERS } from '../data/seeds';

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
  list(search: string, page: number, size: number): Observable<PageResponse<Customer>> {
    const filtered = this.applySearch(CUSTOMERS, search);
    const slice = filtered.slice(page * size, page * size + size);
    const totalElements = filtered.length;
    return of({
      data: slice,
      totalElements,
      page,
      size,
      totalPages: size ? Math.ceil(totalElements / size) : 0
    });
  }

  get(id: string): Observable<Customer | undefined> {
    return of(CUSTOMERS.find(customer => customer.id === id));
  }

  private applySearch(customers: Customer[], term: string): Customer[] {
    if (!term) {
      return customers;
    }
    const lowered = term.toLowerCase();
    return customers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(lowered) ||
        customer.gstin.toLowerCase().includes(lowered) ||
        customer.territory.toLowerCase().includes(lowered)
      );
    });
  }
}
