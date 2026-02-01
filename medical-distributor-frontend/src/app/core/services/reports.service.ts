import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { PageResponse } from './page-response';
import { OrderService } from './order.service';
import { InventoryService, InventoryBatch } from './inventory.service';

export interface SalesReportRow {
  invoiceId: string;
  invoiceNo: string;
  invoiceDate: string;
  customerId: string;
  customerName: string;
  netTotal: number;
}

export interface OutstandingAgingRow {
  customerId: string;
  customerName: string;
  bucket0to30: number;
  bucket31to60: number;
  bucket61to90: number;
  bucket90plus: number;
  totalOutstanding: number;
}

export interface NearExpiryRow {
  batchId: string;
  productId: string;
  productName: string;
  batchNo: string;
  expiryDate: string;
  qtyAvailable: number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private orderService: OrderService, private inventoryService: InventoryService) {}

  salesReport(from: string | null, to: string | null, page: number, size: number): Observable<PageResponse<SalesReportRow>> {
    const orders = this.orderService.listOrders();
    const rows = orders
      .filter(order => this.inRange(order.orderDate, from, to))
      .map(order => ({
        invoiceId: order.id,
        invoiceNo: order.orderNo,
        invoiceDate: order.orderDate,
        customerId: order.customerId,
        customerName: order.customerName,
        netTotal: order.netTotal
      }));
    const totalElements = rows.length;
    return of({
      data: rows.slice(page * size, page * size + size),
      totalElements,
      page,
      size,
      totalPages: size ? Math.ceil(totalElements / size) : 0
    });
  }

  outstandingAging(): Observable<OutstandingAgingRow[]> {
    const orders = this.orderService.listOrders();
    return of(
      orders.map(order => ({
        customerId: order.customerId,
        customerName: order.customerName,
        bucket0to30: order.netTotal * 0.4,
        bucket31to60: order.netTotal * 0.3,
        bucket61to90: order.netTotal * 0.2,
        bucket90plus: order.netTotal * 0.1,
        totalOutstanding: order.netTotal
      }))
    );
  }

  nearExpiry(days: number, page: number, size: number): Observable<PageResponse<NearExpiryRow>> {
    return this.inventoryService.nearExpiry(days, page, size).pipe(
      map(batchPage => ({
        ...batchPage,
        data: batchPage.data.map(batch => ({
          batchId: batch.id,
          productId: batch.productId,
          productName: batch.productName,
          batchNo: batch.batchNo,
          expiryDate: batch.expiryDate,
          qtyAvailable: batch.qtyAvailable
        }))
      }))
    );
  }

  private inRange(date: string, from: string | null, to: string | null): boolean {
    const value = new Date(date).getTime();
    if (from && value < new Date(from).getTime()) {
      return false;
    }
    if (to && value > new Date(to).getTime()) {
      return false;
    }
    return true;
  }
}
