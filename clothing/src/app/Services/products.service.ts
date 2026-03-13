import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { StoreConfigService } from './store-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [];

  constructor(private readonly storeConfig: StoreConfigService) {
    this.products = this.storeConfig.seedProducts.map(product => ({
      ...product,
      image: this.buildImageUrl(product.category, product.id)
    }));
    this.ensureMinimumProducts();
  }

  private ensureMinimumProducts(): void {
    const generation = this.storeConfig.storeConfig.catalog.generation;
    const minCount = generation.minProductCount;
    if (this.products.length >= minCount) {
      return;
    }

    let nextId = (this.products.length ? Math.max(...this.products.map(p => p.id)) : 0) + 1;
    let index = 0;

    while (this.products.length < minCount) {
      const category = generation.categories[index % generation.categories.length];
      const brand = generation.brands[index % generation.brands.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = generation.basePriceStart + (index * generation.priceStep) % generation.priceModulo;
      const isDiscounted = generation.discountEvery > 0 && index % generation.discountEvery === 0;
      const price = basePrice + (category.length * generation.categoryPriceFactor);
      const originalPrice = isDiscounted ? price + Math.round(price * generation.discountRate) : undefined;
      const rating = Math.min(5, 3.8 + (index % 10) * 0.12);
      const reviews = 60 + (index * 13) % 3800;
      const inStock = index % 7 !== 0;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const id = nextId++;

      this.products.push({
        id,
        name: `${brand} ${category} Edit ${modelNumber}`,
        description: `Curated ${category.toLowerCase()} drop from ${brand}, shipped within 48 hours.`,
        price,
        originalPrice,
        image: this.buildImageUrl(category, id),
        category,
        inStock,
        rating,
        reviews,
        sku: `${brand.toUpperCase()}-${categoryKey}-${modelNumber}`,
        specifications: generation.categorySpecifications[category]
      });

      index += 1;
    }
  }

  private buildImageUrl(category: string, seed: number): string {
    const palette = [
      { bg: '#f6d7c8', accent: '#f26b5b' },
      { bg: '#fde6d8', accent: '#f4b860' },
      { bg: '#f3d2d8', accent: '#c96f7b' },
      { bg: '#f2d7c9', accent: '#b46b54' },
      { bg: '#f7e1d4', accent: '#8c5e52' }
    ];
    const index = Math.abs(seed) % palette.length;
    const colors = palette[index];
    const label = category.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();
    const logo = this.storeConfig.storeConfig.branding.logoText;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${colors.bg}"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
        </defs>
        <rect width="640" height="640" fill="url(#bg)"/>
        <rect x="56" y="72" width="528" height="496" rx="36" fill="#ffffff" opacity="0.7"/>
        <circle cx="480" cy="176" r="64" fill="${colors.accent}" opacity="0.75"/>
        <circle cx="192" cy="472" r="78" fill="${colors.accent}" opacity="0.45"/>
        <text x="72" y="168" font-family="Outfit, Arial, sans-serif" font-size="28" fill="#1b1a1f" letter-spacing="2">${label}</text>
        <text x="72" y="214" font-family="Bodoni Moda, Georgia, serif" font-size="44" fill="#1b1a1f">${logo}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category === category);
    return of(filtered);
  }

  getCategories(): Observable<string[]> {
    const categories = Array.from(new Set(this.products.map(p => p.category)));
    return of(categories.sort());
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filtered);
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products.filter(p => p.rating && p.rating >= 4.5);
    return of(featured);
  }

  getDiscountedProducts(): Observable<Product[]> {
    const discounted = this.products.filter(p => p.originalPrice && p.originalPrice > p.price);
    return of(discounted);
  }

  getBrands(): Observable<string[]> {
    const brandNames = ['All'];
    this.products.forEach(p => {
      const brand = p.name.split(' ')[0];
      if (!brandNames.includes(brand)) {
        brandNames.push(brand);
      }
    });
    return of(brandNames.sort());
  }

  getPriceRange(): Observable<{ min: number, max: number }> {
    const prices = this.products.map(p => p.price);
    return of({
      min: Math.min(...prices),
      max: Math.max(...prices)
    });
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    const filtered = this.products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    return of(filtered);
  }

  getNewProducts(): Observable<Product[]> {
    return of(this.products.slice(0, 5));
  }

  getBestSellers(): Observable<Product[]> {
    return of(this.products.filter(p => p.reviews && p.reviews > 1000).slice(0, 10));
  }
}
