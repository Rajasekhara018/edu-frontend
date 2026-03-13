import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { HomeFoodsConfigService } from './home-foods-config.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly products: Product[];

  constructor(private readonly homeFoodsConfigService: HomeFoodsConfigService) {
    const seeds = this.getSeedProducts();
    this.products = this.ensureMinimumProducts(seeds, this.homeFoodsConfigService.homeFoodsConfig.catalog.generation.minProductCount);
  }

  private getSeedProducts(): Product[] {
    const configSeeds = this.homeFoodsConfigService.seedProducts;
    const seeds = configSeeds.length ? configSeeds : this.getDefaultSeedProducts();
    return seeds.map((product, index) => ({
      ...product,
      id: product.id || index + 1,
      image: product.image || this.buildImageDataUrl(product.category, product.id || index + 1),
      inStock: product.inStock !== false,
      rating: product.rating ?? this.getRating(index),
      reviews: product.reviews ?? this.getReviews(index),
      specifications: product.specifications ?? this.getSpecificationTemplate(product.category),
      sku: product.sku || this.buildSku(product.name.split(' ')[0], product.category, product.id || index + 1)
    }));
  }

  private getDefaultSeedProducts(): Product[] {
    return [
      { id: 1, name: 'Ammamma Andhra Mango Pickle', description: 'Sun-cured avakaya with mustard, sesame oil, and bold Andhra spice.', price: 260, originalPrice: 320, image: '', category: 'Pickles', inStock: true, rating: 4.8, reviews: 1820, sku: 'AMMAMMA-PICKLES-0001', specifications: { 'Net Weight': '500 g', 'Spice Level': 'Hot', ShelfLife: '6 months', Storage: 'Refrigerate after opening' } },
      { id: 2, name: 'StonePot Lemon Pickle Reserve', description: 'Tangy lemon pickle balanced with aromatic spices and cold-pressed sesame oil.', price: 220, originalPrice: 280, image: '', category: 'Pickles', inStock: true, rating: 4.6, reviews: 1240, sku: 'STONEPOT-PICKLES-0002', specifications: { 'Net Weight': '500 g', 'Spice Level': 'Medium', ShelfLife: '6 months', Storage: 'Cool and dry' } },
      { id: 3, name: 'GheeCraft Kaju Katli Box', description: 'Silky cashew fudge with a clean, nutty finish packed for gifting.', price: 450, originalPrice: 520, image: '', category: 'Sweets', inStock: true, rating: 4.8, reviews: 2105, sku: 'GHEECRAFT-SWEETS-0003', specifications: { 'Net Weight': '250 g', Sweetener: 'Sugar', Ghee: 'Pure cow ghee', ShelfLife: '10 days' } },
      { id: 4, name: 'FestiveLeaf Mysore Pak Classic', description: 'Ghee-rich Mysore pak with a melt-in-mouth texture and festive finish.', price: 320, originalPrice: 380, image: '', category: 'Sweets', inStock: true, rating: 4.7, reviews: 1490, sku: 'FESTIVELEAF-SWEETS-0004', specifications: { 'Net Weight': '300 g', Sweetener: 'Sugar', Ghee: 'Pure cow ghee', ShelfLife: '8 days' } },
      { id: 5, name: 'BrassBowl Butter Murukku', description: 'Crisp buttery murukku with a clean crunch for tea-time snacking.', price: 180, originalPrice: 220, image: '', category: 'Savories', inStock: true, rating: 4.6, reviews: 1120, sku: 'BRASSBOWL-SAVORIES-0005', specifications: { 'Net Weight': '250 g', Texture: 'Crunchy', ShelfLife: '20 days', Storage: 'Airtight container' } },
      { id: 6, name: 'SpiceTrail Chekkalu Bites', description: 'Rice-flour savory discs seasoned with chili, sesame, and curry leaf.', price: 190, originalPrice: 235, image: '', category: 'Snacks', inStock: true, rating: 4.5, reviews: 980, sku: 'SPICETRAIL-SNACKS-0006', specifications: { 'Net Weight': '200 g', Texture: 'Crispy', ShelfLife: '20 days', Storage: 'Cool and dry' } },
      { id: 7, name: 'TeluguTaste Idli Podi Garlic', description: 'Stone-ground podi with roasted lentils, chili, and garlic for quick breakfasts.', price: 190, originalPrice: 230, image: '', category: 'Spice Powders', inStock: true, rating: 4.7, reviews: 1660, sku: 'TELUGUTASTE-SPICEPOWDERS-0007', specifications: { 'Net Weight': '250 g', Roast: 'Medium', ShelfLife: '4 months', Storage: 'Airtight container' } },
      { id: 8, name: 'VillageJar Dosa Mix Classic', description: 'Balanced ready mix for soft dosas with a consistent fermented flavor.', price: 210, originalPrice: 260, image: '', category: 'Ready Mixes', inStock: true, rating: 4.5, reviews: 870, sku: 'VILLAGEJAR-READYMIXES-0008', specifications: { 'Net Weight': '500 g', Use: 'Quick breakfast', ShelfLife: '4 months', Storage: 'Dry place' } },
      { id: 9, name: 'HeritagePantry Papad Family Pack', description: 'Traditional papads for frying or roasting, packed for family meals.', price: 160, originalPrice: 210, image: '', category: 'Papads & Fryums', inStock: true, rating: 4.4, reviews: 760, sku: 'HERITAGEPANTRY-PAPADSFRYUMS-0009', specifications: { 'Net Weight': '250 g', Preparation: 'Fry or roast', ShelfLife: '6 months', Storage: 'Dry place' } },
      { id: 10, name: 'MilletMorsel Ragi Malt Blend', description: 'A nourishing ragi beverage mix with cardamom and jaggery notes.', price: 240, originalPrice: 290, image: '', category: 'Health & Herbal', inStock: true, rating: 4.6, reviews: 930, sku: 'MILLETMORSEL-HEALTHHERBAL-0010', specifications: { 'Net Weight': '250 g', Benefit: 'Wellness blend', ShelfLife: '4 months', Storage: 'Cool and dry' } }
    ];
  }

  private ensureMinimumProducts(seedProducts: Product[], minCount: number): Product[] {
    const products = [...seedProducts];
    if (products.length >= minCount) {
      return products.map((product, index) => ({ ...product, id: index + 1, image: this.buildImageDataUrl(product.category, index + 1) }));
    }

    const generation = this.homeFoodsConfigService.homeFoodsConfig.catalog.generation;
    const suffixes = ['Classic', 'Special', 'Premium', 'Family Pack', 'Festival Box', 'Signature', 'Kitchen Batch', 'Reserve', 'Everyday', 'Celebration'];
    const descriptors = ['Freshly packed', 'Traditional', 'Slow-cooked', 'Stone-ground', 'Festival-ready', 'Home-style', 'Ghee-rich', 'Regional favorite', 'Weekly batch', 'Kitchen crafted'];
    let nextId = products.length + 1;
    let index = 0;

    while (products.length < minCount) {
      const category = generation.categories[index % generation.categories.length];
      const brand = generation.brands[index % generation.brands.length];
      const suffix = suffixes[index % suffixes.length];
      const modelNumber = String(nextId).padStart(4, '0');
      const basePrice = generation.basePriceStart + ((index * generation.priceStep) % generation.priceModulo);
      const price = Math.round(basePrice + category.length * generation.categoryPriceFactor);
      const discounted = generation.discountEvery > 0 && nextId % generation.discountEvery === 0;
      const originalPrice = discounted ? Math.round(price * (1 + generation.discountRate)) : undefined;
      const rating = this.getRating(index + 7);
      const reviews = this.getReviews(index + 11);
      const inStock = nextId % 9 !== 0;
      const descriptor = descriptors[index % descriptors.length];
      const name = category === 'Festival Boxes' || category === 'Gift Hampers' || category === 'Dry Fruit Boxes' ? `${brand} ${suffix} ${category} ${modelNumber}` : `${brand} ${category} ${suffix} ${modelNumber}`;

      products.push({
        id: nextId,
        name,
        description: `${descriptor} ${category.toLowerCase()} from ${brand} with consistent flavor and careful packing.`,
        price,
        originalPrice,
        image: this.buildImageDataUrl(category, nextId),
        category,
        inStock,
        rating,
        reviews,
        specifications: this.getSpecificationTemplate(category),
        sku: this.buildSku(brand, category, nextId)
      });

      nextId += 1;
      index += 1;
    }

    return products;
  }

  private getSpecificationTemplate(category: string): { [key: string]: string } {
    return this.homeFoodsConfigService.homeFoodsConfig.catalog.generation.categorySpecifications[category] || { Pack: 'Standard', ShelfLife: 'Varies', Storage: 'Room temperature' };
  }

  private buildSku(brand: string, category: string, seed: number): string {
    const safeBrand = brand.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `${safeBrand}-${safeCategory}-${String(seed).padStart(4, '0')}`;
  }

  private getRating(seed: number): number {
    return Number((4.1 + (seed % 9) * 0.1).toFixed(1));
  }

  private getReviews(seed: number): number {
    return 320 + (seed * 137) % 4200;
  }

  private buildImageDataUrl(category: string, seed: number): string {
    const palette = ['#f4b183', '#c97a40', '#ffd166', '#b5653b', '#f6bd60', '#e59866', '#d9a679', '#c08457'];
    const accent = palette[seed % palette.length];
    const bg = '#fff8f1';
    const label = category.toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="44" fill="${bg}"/><rect x="72" y="72" width="496" height="496" rx="34" fill="#fffdf9" stroke="#f1d9c2"/><circle cx="476" cy="168" r="66" fill="${accent}" opacity="0.78"/><circle cx="192" cy="470" r="74" fill="${accent}" opacity="0.52"/><text x="96" y="164" fill="#2f1d12" font-family="Georgia, serif" font-size="44">${label}</text><text x="96" y="220" fill="#2f1d12" font-family="Georgia, serif" font-size="58">HomeFoods</text><text x="96" y="548" fill="#71584a" font-family="Arial, sans-serif" font-size="28">Batch ${String(seed).padStart(4, '0')}</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  getAllProducts(): Observable<Product[]> { return of(this.products); }
  getProductById(id: number): Observable<Product | undefined> { return of(this.products.find(p => p.id === id)); }
  getProductsByCategory(category: string): Observable<Product[]> { return of(this.products.filter(p => p.category === category)); }
  getCategories(): Observable<string[]> { return of(Array.from(new Set(this.products.map(p => p.category)))); }
  searchProducts(term: string): Observable<Product[]> { const search = term.toLowerCase(); return of(this.products.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))); }
  getFeaturedProducts(): Observable<Product[]> { return of(this.products.filter(p => (p.rating || 0) >= 4.5).slice(0, 12)); }
  getDiscountedProducts(): Observable<Product[]> { return of(this.products.filter(p => (p.originalPrice || 0) > p.price)); }
  getBrands(): Observable<string[]> { return of(Array.from(new Set(this.products.map(p => p.name.split(' ')[0])))); }
  getPriceRange(): Observable<{ min: number; max: number }> { const prices = this.products.map(p => p.price); return of({ min: Math.min(...prices), max: Math.max(...prices) }); }
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> { return of(this.products.filter(p => p.price >= minPrice && p.price <= maxPrice)); }
  getNewProducts(): Observable<Product[]> { return of(this.products.slice(0, 8)); }
  getBestSellers(): Observable<Product[]> { return of(this.products.filter(p => (p.reviews || 0) > 1000).slice(0, 10)); }
}
