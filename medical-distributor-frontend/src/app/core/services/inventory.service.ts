import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PageResponse } from './page-response';
import { PharmaProductsService } from './pharma-products.service';

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
  constructor(private pharmaProducts: PharmaProductsService) {}

  listBatches(productId: string | null, page: number, size: number): Observable<PageResponse<InventoryBatch>> {
    return this.pharmaProducts.getAllProducts().pipe(
      map(products => this.buildPage(products, productId, page, size))
    );
  }

  nearExpiry(days: number, page: number, size: number): Observable<PageResponse<InventoryBatch>> {
    return this.pharmaProducts.getAllProducts().pipe(
      map(products => {
        const threshold = Date.now() + days * 24 * 60 * 60 * 1000;
        const filtered = this.buildBatches(products).filter(batch => new Date(batch.expiryDate).getTime() <= threshold);
        const totalElements = filtered.length;
        return {
          data: filtered.slice(page * size, page * size + size),
          totalElements,
          page,
          size,
          totalPages: size ? Math.ceil(totalElements / size) : 0
        };
      })
    );
  }

  private buildPage(products: any[], productId: string | null, page: number, size: number): PageResponse<InventoryBatch> {
    const batches = this.buildBatches(products);
    const filtered = productId ? batches.filter(batch => batch.productId === productId) : batches;
    const totalElements = filtered.length;
    return {
      data: filtered.slice(page * size, page * size + size),
      totalElements,
      page,
      size,
      totalPages: size ? Math.ceil(totalElements / size) : 0
    };
  }

  private buildBatches(products: any[]): InventoryBatch[] {
    return products.map((product, index) => {
      const daysAhead = 30 + (index % 90);
      return {
        id: `BATCH-${index + 1}`,
        productId: product.id,
        productName: product.name,
        batchNo: `BCH-${1000 + index}`,
        expiryDate: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString(),
        mrp: product.price + ((index % 5) * 15),
        qtyAvailable: 200 - (index % 120),
        qtyReserved: index % 40,
        branchCode: 'HQ'
      };
    });
  }
}
