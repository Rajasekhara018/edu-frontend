import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { PharmaProduct } from '../../core/models/pharma-product.model';
import { CartService } from '../../core/services/cart.service';
import { CatalogSearchService } from '../../core/services/catalog-search.service';
import { PharmaProductsService } from '../../core/services/pharma-products.service';
import { ProductDetailDialogComponent } from './product-detail-dialog.component';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  private productsService = inject(PharmaProductsService);
  private cartService = inject(CartService);
  private catalogSearch = inject(CatalogSearchService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  products: PharmaProduct[] = [];
  filteredProducts: PharmaProduct[] = [];
  displayedProducts: PharmaProduct[] = [];

  categories: string[] = [];
  brands: string[] = [];
  priceRange: { min: number; max: number } = { min: 0, max: 100000 };

  selectedCategory = '';
  selectedBrands: string[] = [];
  selectedPriceRange: { min: number; max: number } = { min: 0, max: 100000 };
  selectedRating = 0;
  searchTerm = '';
  sortBy = 'relevance';

  isLoading = false;
  showMobileFilters = false;
  resultsPerPage = 50;
  currentPage = 1;

  readonly fallbackImage = '/images/pharma-placeholder.svg';

  ngOnInit(): void {
    this.loadInitialData();

    this.catalogSearch.search$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(term => {
        if (this.searchTerm !== term) {
          this.searchTerm = term;
          this.applyFilters();
        }
      });
  }

  loadInitialData(): void {
    this.isLoading = true;

    this.productsService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.filteredProducts = data;
        this.selectedPriceRange = { ...this.priceRange };
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.productsService.getCategories().subscribe({
      next: data => {
        this.categories = data;
      }
    });

    this.productsService.getBrands().subscribe({
      next: data => {
        this.brands = data;
      }
    });

    this.productsService.getPriceRange().subscribe({
      next: data => {
        this.priceRange = data;
        this.selectedPriceRange = { ...data };
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(product => this.selectedBrands.includes(product.manufacturer));
    }

    filtered = filtered.filter(product =>
      product.price >= this.selectedPriceRange.min &&
      product.price <= this.selectedPriceRange.max
    );

    if (this.selectedRating > 0) {
      filtered = filtered.filter(product => (product.rating || 0) >= this.selectedRating);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.applySort();
    this.updateDisplayedProducts();
    this.closeMobileFiltersIfNeeded();
  }

  applySort(): void {
    const sorted = [...this.filteredProducts];

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

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
    const endIndex = startIndex + this.resultsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.applyFilters();
  }

  onBrandChange(brand: string): void {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onRatingChange(rating: number): void {
    this.selectedRating = this.selectedRating === rating ? 0 : rating;
    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.catalogSearch.setSearch(term);
    this.applyFilters();
  }

  onSortChange(sortOption: string): void {
    this.sortBy = sortOption;
    this.applySort();
    this.updateDisplayedProducts();
  }

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
    for (let i = 1; i <= this.totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedBrands = [];
    this.selectedPriceRange = { ...this.priceRange };
    this.selectedRating = 0;
    this.searchTerm = '';
    this.sortBy = 'relevance';
    this.catalogSearch.setSearch('');
    this.applyFilters();
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  private closeMobileFiltersIfNeeded(): void {
    if (this.showMobileFilters && window.innerWidth < 1280) {
      this.showMobileFilters = false;
    }
  }

  viewProductDetails(product: PharmaProduct): void {
    this.dialog.open(ProductDetailDialogComponent, {
      width: '880px',
      maxWidth: '95vw',
      data: product
    });
  }

  addToCart(product: PharmaProduct): void {
    if (!product.inStock) {
      return;
    }
    this.cartService.addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      qty: 1,
      unit: product.pack
    });
  }

  getDiscountPercentage(product: PharmaProduct): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }

  getBadgeText(product: PharmaProduct): string {
    const discount = this.getDiscountPercentage(product);
    if (discount >= 50) return 'Top Deal';
    if (discount >= 30) return 'Great Deal';
    if (discount >= 10) return 'Sale';
    return product.prescriptionRequired ? 'Rx' : 'New';
  }

  isOutOfStock(product: PharmaProduct): boolean {
    return !product.inStock;
  }

  isBestSeller(product: PharmaProduct): boolean {
    return (product.rating || 0) >= 4.5 && (product.reviews || 0) >= 1000;
  }

  getPopularityText(product: PharmaProduct): string {
    const reviews = product.reviews || 0;
    if (reviews >= 10000) {
      return '10K+ units ordered this month';
    }
    if (reviews >= 5000) {
      return '5K+ units ordered this month';
    }
    if (reviews >= 1000) {
      return '1K+ units ordered this month';
    }
    return '';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.src = this.fallbackImage;
    }
  }
}
