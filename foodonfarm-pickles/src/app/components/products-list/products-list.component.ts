import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../Services/product.model';
import { CartService } from '../../Services/cart.service';
import { ProductsService } from '../../Services/products.service';
import { ImageFallbackUtil } from '../../Services/image-fallback.util';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @ViewChild('bestSellerRail') bestSellerRail?: ElementRef<HTMLElement>;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  bestSellers: Product[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  sortBy = 'bestSelling';
  viewMode: 'list' | 'grid2' | 'grid3' | 'grid4' = 'grid4';
  search = '';
  inStockOnly = false;
  minPrice = 0;
  maxPrice = 2000;
  heroIndex = 0;
  readonly heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1800&q=80',
      title: 'AUTHENTIC TELUGU STYLE',
      subtitle: 'Handcrafted pickles made in small batches with premium ingredients.'
    },
    {
      image: 'https://images.unsplash.com/photo-1645191105414-d3f0c81f3f4a?auto=format&fit=crop&w=1800&q=80',
      title: 'HOMEMADE PREMIUM INGREDIENTS',
      subtitle: 'No artificial colours or preservatives. Village taste delivered fresh.'
    },
    {
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1800&q=80',
      title: 'FESTIVE GIFT BOXES',
      subtitle: 'Curated assortments for celebrations, families, and special occasions.'
    }
  ];
  readonly spotlightCards = [
    { title: 'Veg Pickles', slug: 'veg-pickles', image: 'https://images.unsplash.com/photo-1645191105414-d3f0c81f3f4a?auto=format&fit=crop&w=900&q=80' },
    { title: 'Nonveg Pickles', slug: 'non-veg-pickles', image: 'https://images.unsplash.com/photo-1571197119282-7c4f4bdfd951?auto=format&fit=crop&w=900&q=80' },
    { title: 'Sweets & Snacks', slug: 'sweets-snacks', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=900&q=80' },
    { title: 'Powders & Masalas', slug: 'masala-kaaram-powders', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80' }
  ];
  readonly widePromos = [
    { title: 'Fryums', slug: 'fryums', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1400&q=80' },
    { title: 'Special Gift Boxes', slug: 'sweets-snacks', image: 'https://images.unsplash.com/photo-1601050690117-24e4cf5b7d87?auto=format&fit=crop&w=1400&q=80' }
  ];
  readonly homeHighlights = [
    { label: 'Small Batch Recipes', value: '100% Traditional' },
    { label: 'Pan-India Shipping', value: 'Trusted Delivery' },
    { label: 'Freshly Packed', value: 'Daily Dispatch' }
  ];
  readonly brandPromises = [
    {
      title: 'Authentic Homemade Taste',
      copy: 'Prepared with traditional methods to retain original regional flavor and texture.'
    },
    {
      title: 'Ingredient Transparency',
      copy: 'Curated ingredients, clear sourcing, and no compromise on food quality standards.'
    },
    {
      title: 'Reliable Customer Experience',
      copy: 'Professional checkout, timely dispatch updates, and responsive order support.'
    }
  ];
  selectedWeights: Record<number, string> = {};
  quantities: Record<number, number> = {};
  collectionSlug = '';
  private heroAutoScrollTimer?: ReturnType<typeof setInterval>;
  private readonly heroAutoScrollMs = 5000;
  private readonly collectionTitles: Record<string, string> = {
    'veg-pickles': 'Vegetarian Pickles',
    'non-veg-pickles': 'Non-Vegetarian Pickles',
    'masala-kaaram-powders': 'Masala And Kaaram Powders',
    'sweets-snacks': 'Sweets And Snacks',
    fryums: 'Fryums',
    'instant-mixes': 'Instant Mixes'
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly route: ActivatedRoute,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe(products => {
      this.products = products;
      this.categories = ['All', ...this.productsService.getCategories()];
      products.forEach(product => {
        this.selectedWeights[product.id] = product.weightOptions[0] || 'Standard';
        this.quantities[product.id] = this.quantities[product.id] || 1;
      });
      this.bestSellers = [...products]
        .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
        .slice(0, 10);
      this.applyFilters();
    });

    this.route.paramMap.subscribe(params => {
      this.collectionSlug = params.get('slug') || '';
      this.applyFilters();
    });

    this.route.queryParams.subscribe(params => {
      this.search = (params['q'] || '').toString();
      this.applyFilters();
    });

    this.startHeroAutoScroll();
  }

  applyFilters(): void {
    let list = [...this.products];

    if (this.collectionSlug) {
      list = list.filter(product => this.getCollectionSlugs(product).includes(this.collectionSlug));
    }

    if (this.selectedCategory !== 'All') {
      list = list.filter(product => product.category === this.selectedCategory);
    }

    if (this.search.trim()) {
      const term = this.search.toLowerCase();
      list = list.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    if (this.inStockOnly) {
      list = list.filter(product => product.inStock);
    }

    list = list.filter(product => product.price >= this.minPrice && product.price <= this.maxPrice);

    switch (this.sortBy) {
      case 'featured':
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      case 'bestSelling':
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
        break;
      case 'alphaAsc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphaDesc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'priceLow':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'dateOld':
        list.sort((a, b) => a.id - b.id);
        break;
      case 'dateNew':
        list.sort((a, b) => b.id - a.id);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    this.filteredProducts = list;
  }

  onLookupChange(term: string): void {
    this.search = term;
    this.applyFilters();
  }

  clearLookup(): void {
    this.search = '';
    this.selectedCategory = 'All';
    this.applyFilters();
  }

  get searchLabel(): string {
    return this.search.trim() ? this.search.toUpperCase() : 'ALL PRODUCTS';
  }

  get pageTitle(): string {
    if (this.collectionSlug && this.collectionTitles[this.collectionSlug]) {
      return this.collectionTitles[this.collectionSlug];
    }
    if (this.selectedCategory !== 'All') {
      return this.selectedCategory;
    }
    if (this.search.trim()) {
      return this.search
        .split(' ')
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    return 'Products';
  }

  private getCollectionSlugs(product: Product): string[] {
    if (product.collectionSlugs?.length) {
      return product.collectionSlugs;
    }

    const category = product.category.toLowerCase();
    if (category.includes('vegetarian pickle')) return ['veg-pickles'];
    if (category.includes('non-vegetarian pickle')) return ['non-veg-pickles'];
    if (category.includes('masala') || category.includes('powder')) return ['masala-kaaram-powders'];
    if (category.includes('sweets') || category.includes('snacks')) return ['sweets-snacks'];
    if (category.includes('fryums')) return ['fryums'];
    if (category.includes('instant')) return ['instant-mixes'];
    if (category.includes('pickle')) return ['veg-pickles'];
    return [];
  }

  changeQuantity(productId: number, delta: number): void {
    const next = (this.quantities[productId] || 1) + delta;
    this.quantities[productId] = Math.max(1, next);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(
      product,
      this.selectedWeights[product.id] || product.weightOptions[0] || 'Standard',
      this.quantities[product.id] || 1
    );
  }

  discountPercent(product: Product): number {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0;
    }

    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  setViewMode(mode: 'list' | 'grid2' | 'grid3' | 'grid4'): void {
    this.viewMode = mode;
  }

  get gridClass(): string {
    return `view-${this.viewMode}`;
  }

  get isHomeExperience(): boolean {
    return !this.collectionSlug && !this.search.trim();
  }

  prevHero(): void {
    this.heroIndex = this.heroIndex === 0 ? this.heroSlides.length - 1 : this.heroIndex - 1;
    this.restartHeroAutoScroll();
  }

  nextHero(): void {
    this.heroIndex = (this.heroIndex + 1) % this.heroSlides.length;
    this.restartHeroAutoScroll();
  }

  scrollBestSellers(direction: 1 | -1): void {
    if (!this.bestSellerRail?.nativeElement) {
      return;
    }

    const rail = this.bestSellerRail.nativeElement;
    rail.scrollBy({ left: direction * 360, behavior: 'smooth' });
  }

  pauseHeroAutoScroll(): void {
    this.stopHeroAutoScroll();
  }

  resumeHeroAutoScroll(): void {
    this.startHeroAutoScroll();
  }

  private startHeroAutoScroll(): void {
    if (this.heroAutoScrollTimer || this.heroSlides.length <= 1) {
      return;
    }

    this.heroAutoScrollTimer = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroSlides.length;
    }, this.heroAutoScrollMs);
  }

  private stopHeroAutoScroll(): void {
    if (!this.heroAutoScrollTimer) {
      return;
    }

    clearInterval(this.heroAutoScrollTimer);
    this.heroAutoScrollTimer = undefined;
  }

  private restartHeroAutoScroll(): void {
    this.stopHeroAutoScroll();
    this.startHeroAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopHeroAutoScroll();
  }

  getSafeImage(url: string | undefined, label: string, context: string): string {
    return ImageFallbackUtil.ensureImage(url, label, context);
  }

  onImageError(event: Event, label: string, context: string): void {
    ImageFallbackUtil.handleImageError(event, label, context);
  }
}
