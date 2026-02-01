import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PharmaProduct } from '../../core/models/pharma-product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: false,
  templateUrl: './product-detail-dialog.component.html',
  styleUrl: './product-detail-dialog.component.scss'
})
export class ProductDetailDialogComponent {
  readonly fallbackImage = '/images/pharma-placeholder.svg';
  readonly specEntries: Array<{ key: string; value: string }>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PharmaProduct,
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    private cartService: CartService
  ) {
    this.specEntries = Object.entries(this.data.specifications ?? {}).map(([key, value]) => ({
      key,
      value
    }));
  }

  addToCart(): void {
    if (!this.data.inStock) {
      return;
    }
    this.cartService.addItem({
      id: String(this.data.id),
      name: this.data.name,
      price: this.data.price,
      qty: 1,
      unit: this.data.pack
    });
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.src = this.fallbackImage;
    }
  }
}
