import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../Services/product.model';
import { ProductsService } from '../../Services/products.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-products-list',
  standalone: false,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  // Products Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  // Filter Properties
  categories: string[] = [];
  brands: string[] = [];
  priceRange: { min: number, max: number } = { min: 0, max: 100000 };

  // Active Filters
  selectedCategory: string = '';
  selectedBrands: string[] = [];
  selectedPriceRange: { min: number, max: number } = { min: 0, max: 100000 };
  selectedRating: number = 0;
  searchTerm: string = '';
  sortBy: string = 'relevance';

  // UI State
  isLoading: boolean = false;
  showMobileFilters: boolean = false;
  resultsPerPage: number = 50;
  currentPage: number = 1;


  constructor(
    private productsService: ProductsService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.selectedPriceRange = { ...this.priceRange };
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });

    this.productsService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });

    this.productsService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
      }
    });

    this.productsService.getPriceRange().subscribe({
      next: (data) => {
        this.priceRange = data;
        this.selectedPriceRange = { ...data };
      }
    });
  }

  // Apply all active filters
  applyFilters(): void {
    let filtered = [...this.products];

    // Category Filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Brand Filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => {
        const brand = p.name.split(' ')[0];
        return this.selectedBrands.includes(brand);
      });
    }

    // Price Range Filter
    filtered = filtered.filter(p => 
      p.price >= this.selectedPriceRange.min && 
      p.price <= this.selectedPriceRange.max
    );

    // Rating Filter
    if (this.selectedRating > 0) {
      filtered = filtered.filter(p => p.rating && p.rating >= this.selectedRating);
    }

    // Search Term Filter
    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.applySort();
    this.updateDisplayedProducts();
    this.closeMobileFiltersIfNeeded();
  }

  // Apply sorting
  applySort(): void {
    let sorted = [...this.filteredProducts];

    switch (this.sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'relevance':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts = sorted;
  }

  // Update displayed products based on pagination
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
    const endIndex = startIndex + this.resultsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // Category change handler
  onCategoryChange(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.applyFilters();
  }

  // Brand checkbox change handler
  onBrandChange(brand: string): void {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  // Price range change handler
  onPriceRangeChange(): void {
    this.applyFilters();
  }

  // Rating filter change
  onRatingChange(rating: number): void {
    this.selectedRating = this.selectedRating === rating ? 0 : rating;
    this.applyFilters();
  }

  // Search handler
  onSearch(term: any): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  // Sort change handler
  onSortChange(sortOption: string): void {
    this.sortBy = sortOption;
    this.applySort();
    this.updateDisplayedProducts();
  }

  // Pagination
  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.resultsPerPage);
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Clear all filters
  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedBrands = [];
    this.selectedPriceRange = { ...this.priceRange };
    this.selectedRating = 0;
    this.searchTerm = '';
    this.sortBy = 'relevance';
    this.applyFilters();
  }

  // Toggle mobile filters
  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  private closeMobileFiltersIfNeeded(): void {
    if (this.showMobileFilters && window.innerWidth < 1280) {
      this.showMobileFilters = false;
    }
  }

  // View product details
  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    if (!product.inStock) {
      return;
    }
    this.cartService.addItem(product, 1);
  }

  // Calculate discount percentage
  getDiscountPercentage(product: Product): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }

  // Get badge text based on discount
  getBadgeText(product: Product): string {
    const discount = this.getDiscountPercentage(product);
    if (discount >= 50) return 'Flash Deal';
    if (discount >= 30) return 'Hot Drop';
    if (discount >= 10) return 'Bundle';
    return 'New';
  }

  // Check if product is out of stock
  isOutOfStock(product: Product): boolean {
    return !product.inStock;
    // this.sortBy = sortOption;
    // this.sortProducts();
  }

  isBestSeller(product: Product): boolean {
    return (product.rating || 0) >= 4.5 && (product.reviews || 0) >= 1000;
  }

  getPopularityText(product: Product): string {
    const reviews = product.reviews || 0;
    if (reviews >= 10000) {
      return '10K+ ordered this month';
    }
    if (reviews >= 5000) {
      return '5K+ ordered this month';
    }
    if (reviews >= 1000) {
      return '1K+ ordered this month';
    }
    return '';
  }

//   viewProductDetails(productId: number): void {
//     this.router.navigate(['/product', productId]);
//   }

//   getDiscountPercentage(product: Product): number {
//     if (product.originalPrice && product.originalPrice > product.price) {
//       return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
//     }
//     return 0;
//   }
}
