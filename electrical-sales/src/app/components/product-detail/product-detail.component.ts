import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../Services/product.model';
import { ProductsService } from '../../Services/products.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product: Product | undefined;
  relatedProducts: Product[] = [];
  isLoading: boolean = false;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        if (product) {
          this.loadRelatedProducts(product.category);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  loadRelatedProducts(category: string): void {
    this.productsService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.relatedProducts = products.filter(p => p.id !== this.product?.id).slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem(this.product, this.quantity);
    }
  }

  buyNow(): void {
    if (this.product) {
      console.log(`Buy ${this.quantity} of ${this.product.name} now`);
      // Checkout logic will be implemented here
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  viewRelatedProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  getDiscountPercentage(): number {
    if (this.product && this.product.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }
}
