import { Component, OnInit } from '@angular/core';
import { Product } from '../../Services/product.model';
import { ProductsService } from '../../Services/products.service';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  ordersCount = 0;
  editingId: number | null = null;

  formModel: Omit<Product, 'id'> = {
    name: '',
    description: '',
    category: 'Pickles',
    price: 0,
    originalPrice: 0,
    image: '',
    inStock: true,
    featured: false,
    weightOptions: ['250g', '500g', '1Kg']
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.productsService.products$.subscribe(products => (this.products = products));
    this.ordersCount = this.orderService.getOrders().length;
  }

  submitProduct(): void {
    const sanitized = {
      ...this.formModel,
      image: this.formModel.image.trim() || 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=800&q=80',
      weightOptions: this.formModel.weightOptions.filter(Boolean)
    };

    if (this.editingId) {
      this.productsService.updateProduct({ ...sanitized, id: this.editingId });
    } else {
      this.productsService.addProduct(sanitized);
    }

    this.resetForm();
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.formModel = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      inStock: product.inStock,
      featured: Boolean(product.featured),
      weightOptions: [...product.weightOptions]
    };
  }

  deleteProduct(productId: number): void {
    this.productsService.deleteProduct(productId);
  }

  resetForm(): void {
    this.editingId = null;
    this.formModel = {
      name: '',
      description: '',
      category: 'Pickles',
      price: 0,
      originalPrice: 0,
      image: '',
      inStock: true,
      featured: false,
      weightOptions: ['250g', '500g', '1Kg']
    };
  }

  updateWeightOptions(raw: string): void {
    this.formModel.weightOptions = raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
  }
}
