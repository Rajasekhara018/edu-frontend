import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { GroceryConfigService } from './grocery-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [];

  constructor(private readonly groceryConfig: GroceryConfigService) {
    this.products = this.buildCatalog();
  }

  private buildCatalog(): Product[] {
    const config = this.groceryConfig.groceryConfig.catalog;
    const products = (config.seedProducts.length ? config.seedProducts : this.getDefaultSeedProducts()).map(product => ({
      ...product,
      image: product.image || this.buildImageUrl(product.category, product.name)
    }));

    const generation = config.generation;
    let nextId = products.length ? Math.max(...products.map(product => product.id)) + 1 : 1;
    let index = 0;

    while (products.length < generation.minProductCount) {
      const category = generation.categories[index % generation.categories.length];
      const brand = generation.brands[index % generation.brands.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = generation.basePriceStart + (index * generation.priceStep) % generation.priceModulo;
      const price = Math.round(basePrice + (category.length * generation.categoryPriceFactor));
      const discounted = index % generation.discountEvery === 0;
      const originalPrice = discounted ? Math.round(price * (1 + generation.discountRate)) : undefined;
      const rating = Math.min(5, 4 + (index % 9) * 0.1);
      const reviews = 120 + (index * 17) % 12000;
      const inStock = index % 10 !== 0;
      const id = nextId++;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const name = `${brand} ${this.getProductSuffix(category)} ${modelNumber}`;

      products.push({
        id,
        name,
        description: `${brand} ${category.toLowerCase()} packed for quick delivery and dependable everyday quality.`,
        price,
        originalPrice,
        image: this.buildImageUrl(category, name),
        category,
        inStock,
        rating,
        reviews,
        sku: `${brand.toUpperCase()}-${categoryKey}-${modelNumber}`,
        specifications: generation.categorySpecifications[category] || { Pack: '1 unit', Freshness: 'Standard', Storage: 'Room temperature' }
      });

      index += 1;
    }

    return products;
  }

  private getDefaultSeedProducts(): Product[] {
    return [
      { id: 1, name: 'FreshFarm Banana Premium', description: 'Farm-picked bananas selected for daily breakfast and snacking.', price: 52, originalPrice: 64, image: '', category: 'Fresh Produce', inStock: true, rating: 4.7, reviews: 2840, sku: 'FRESHFARM-FRESH-0001', specifications: { Weight: '1 kg', Origin: 'Local farm', ShelfLife: '3 days', Storage: 'Room temperature' } },
      { id: 2, name: 'DailyDairy Whole Milk Pack', description: 'Chilled full-cream milk sourced fresh for everyday use.', price: 32, originalPrice: 38, image: '', category: 'Dairy & Eggs', inStock: true, rating: 4.6, reviews: 1980, sku: 'DAILYDAIRY-DAIRY-0002', specifications: { Volume: '500 ml', Type: 'Full cream', ShelfLife: '3 days', Storage: 'Refrigerate' } },
      { id: 3, name: 'BakeHouse Sandwich Bread', description: 'Soft daily bread loaf for breakfast and quick meal prep.', price: 42, originalPrice: 50, image: '', category: 'Bakery', inStock: true, rating: 4.5, reviews: 920, sku: 'BAKEHOUSE-BAKERY-0003', specifications: { Weight: '400 g', Freshness: 'Baked today', ShelfLife: '2 days', Storage: 'Cool and dry' } },
      { id: 4, name: 'PantryPro Premium Toor Dal', description: 'Cleaned and packed lentils for everyday cooking and pantry stocking.', price: 148, originalPrice: 170, image: '', category: 'Staples', inStock: true, rating: 4.7, reviews: 1340, sku: 'PANTRYPRO-STAPLES-0004', specifications: { Weight: '1 kg', Type: 'Toor dal', ShelfLife: '9 months', Storage: 'Dry place' } },
      { id: 5, name: 'CrunchCo Namkeen Mix', description: 'Crisp savory snack mix for tea-time and family snacking.', price: 58, originalPrice: 68, image: '', category: 'Snacks', inStock: true, rating: 4.4, reviews: 1760, sku: 'CRUNCHCO-SNACKS-0005', specifications: { Weight: '250 g', Type: 'Savory snack', ShelfLife: '4 months', Storage: 'Cool and dry' } },
      { id: 6, name: 'PureSip Orange Juice Carton', description: 'Ready-to-drink juice carton for breakfast and lunchbox use.', price: 88, originalPrice: 104, image: '', category: 'Beverages', inStock: true, rating: 4.5, reviews: 860, sku: 'PURESIP-BEVERAGES-0006', specifications: { Volume: '1 L', Type: 'Fruit beverage', ShelfLife: '3 months', Storage: 'Refrigerate after opening' } },
      { id: 7, name: 'QuickMeal Veg Momos Frozen', description: 'Frozen ready-to-cook dumplings for quick family meals.', price: 140, originalPrice: 165, image: '', category: 'Frozen Foods', inStock: true, rating: 4.3, reviews: 640, sku: 'QUICKMEAL-FROZEN-0007', specifications: { Weight: '500 g', Type: 'Frozen snack', ShelfLife: '6 months', Storage: 'Keep frozen' } },
      { id: 8, name: 'CareNest Aloe Body Wash', description: 'Everyday body wash with fresh fragrance and soft lather.', price: 179, originalPrice: 220, image: '', category: 'Personal Care', inStock: true, rating: 4.5, reviews: 720, sku: 'CARENEST-PERSONAL-0008', specifications: { Volume: '250 ml', Type: 'Body wash', ShelfLife: '12 months', Storage: 'Room temperature' } },
      { id: 9, name: 'HomeFresh Floor Cleaner', description: 'Concentrated floor cleaner for daily household use.', price: 132, originalPrice: 160, image: '', category: 'Cleaning', inStock: true, rating: 4.6, reviews: 1180, sku: 'HOMEFRESH-CLEANING-0009', specifications: { Volume: '1 L', Type: 'Cleaner', ShelfLife: '12 months', Storage: 'Room temperature' } },
      { id: 10, name: 'BabyBloom Diaper Pack', description: 'Soft diaper pack designed for day and night comfort.', price: 329, originalPrice: 380, image: '', category: 'Baby Care', inStock: true, rating: 4.7, reviews: 940, sku: 'BABYBLOOM-BABY-0010', specifications: { Count: '24', Size: 'Medium', ShelfLife: '24 months', Storage: 'Cool and dry' } }
    ];
  }

  private getProductSuffix(category: string): string {
    const suffixMap: Record<string, string> = {
      'Fresh Produce': 'Fresh Pack',
      'Dairy & Eggs': 'Dairy Pack',
      Bakery: 'Bakery Pack',
      Staples: 'Staple Pack',
      Snacks: 'Snack Box',
      Beverages: 'Drink Pack',
      'Frozen Foods': 'Frozen Pack',
      'Personal Care': 'Care Pack',
      Cleaning: 'Clean Pack',
      'Baby Care': 'Baby Pack'
    };
    return suffixMap[category] || category;
  }

  private buildImageUrl(category: string, label: string): string {
    const palette = {
      'Fresh Produce': ['#dff4d8', '#7bc96f'],
      'Dairy & Eggs': ['#eef6ff', '#78a6f5'],
      Bakery: ['#fff0da', '#d39c55'],
      Staples: ['#f6ead7', '#c99d64'],
      Snacks: ['#ffe5d8', '#e76f51'],
      Beverages: ['#e5f7ff', '#5aa9e6'],
      'Frozen Foods': ['#eaf4ff', '#7bb0ff'],
      'Personal Care': ['#fce7f3', '#db6ca7'],
      Cleaning: ['#e1fff6', '#39b98a'],
      'Baby Care': ['#fff0f7', '#f29ac2']
    }[category] || ['#f3f7ef', '#7ea96b'];
    const [bg, circle] = palette;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="36" fill="${bg}"/><circle cx="510" cy="130" r="72" fill="${circle}" opacity="0.78"/><circle cx="165" cy="520" r="88" fill="${circle}" opacity="0.52"/><text x="70" y="110" fill="#19311d" font-family="Georgia, serif" font-size="30">${category}</text><text x="70" y="165" fill="#19311d" font-family="Georgia, serif" font-size="54">${label.slice(0, 22)}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  getAllProducts(): Observable<Product[]> { return of(this.products); }
  getProductById(id: number): Observable<Product | undefined> { return of(this.products.find(product => product.id === id)); }
  getProductsByCategory(category: string): Observable<Product[]> { return of(this.products.filter(product => product.category === category)); }
  getCategories(): Observable<string[]> { return of(Array.from(new Set(this.products.map(product => product.category))).sort()); }
  searchProducts(searchTerm: string): Observable<Product[]> { const value = searchTerm.toLowerCase(); return of(this.products.filter(product => product.name.toLowerCase().includes(value) || product.description.toLowerCase().includes(value))); }
  getFeaturedProducts(): Observable<Product[]> { return of(this.products.filter(product => (product.rating || 0) >= 4.5)); }
  getDiscountedProducts(): Observable<Product[]> { return of(this.products.filter(product => (product.originalPrice || 0) > product.price)); }
  getBrands(): Observable<string[]> { const brands = ['All']; this.products.forEach(product => { const brand = product.name.split(' ')[0]; if (!brands.includes(brand)) brands.push(brand); }); return of(brands.sort()); }
  getPriceRange(): Observable<{ min: number; max: number }> { const prices = this.products.map(product => product.price); return of({ min: Math.min(...prices), max: Math.max(...prices) }); }
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> { return of(this.products.filter(product => product.price >= minPrice && product.price <= maxPrice)); }
  getNewProducts(): Observable<Product[]> { return of(this.products.slice(0, 5)); }
  getBestSellers(): Observable<Product[]> { return of(this.products.filter(product => (product.reviews || 0) > 1000).slice(0, 10)); }
}
