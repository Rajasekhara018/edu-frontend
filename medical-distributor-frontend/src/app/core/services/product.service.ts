import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PageResponse } from './page-response';
import { PharmaProductsService } from './pharma-products.service';
import { PharmaProduct } from '../models/pharma-product.model';

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
  constructor(private pharmaProducts: PharmaProductsService) {}

  list(search: string, page: number, size: number, sort?: string): Observable<PageResponse<PharmaProduct>> {
    return this.pharmaProducts.getAllProducts().pipe(
      map(products => {
        const filtered = this.applySearch(products, search);
        const slice = filtered.slice(page * size, page * size + size);
        const totalElements = filtered.length;
        return {
          data: slice,
          totalElements,
          page,
          size,
          totalPages: size ? Math.ceil(totalElements / size) : 0
        } satisfies PageResponse<PharmaProduct>;
      })
    );
  }

  private applySearch(products: PharmaProduct[], term: string): PharmaProduct[] {
    if (!term) {
      return products;
    }
    const lowered = term.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowered) ||
      product.description.toLowerCase().includes(lowered) ||
      product.sku.toLowerCase().includes(lowered)
    );
  }
}
