import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { PharmaProduct } from '../../core/models/pharma-product.model';
import { InventoryService, InventoryBatch } from '../../core/services/inventory.service';

@Component({
  selector: 'app-inventory-page',
  standalone: false,
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.scss'
})
export class InventoryPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);

  filterForm = this.fb.group({
    productId: ['']
  });

  products: PharmaProduct[] = [];
  batches: InventoryBatch[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.list('', 0, 50).subscribe(response => {
      this.products = response.data;
      if (this.products.length) {
        this.filterForm.patchValue({ productId: String(this.products[0].id) });
        this.loadBatches();
      }
    });
  }

  loadBatches(): void {
    const productId = this.filterForm.value.productId ?? '';
    if (!productId) {
      return;
    }
    this.loading = true;
    this.inventoryService.listBatches(productId, 0, 200).subscribe({
      next: response => {
        this.batches = response.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get selectedProduct(): PharmaProduct | undefined {
    const id = this.filterForm.value.productId;
    const numId = Number(id);
    return this.products.find(p => p.id === numId);
  }

  isNearExpiry(expiryDate: string): boolean {
    const expiry = new Date(expiryDate).getTime();
    const now = Date.now();
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 60 && diffDays >= 0;
  }

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate).getTime() < Date.now();
  }
}



