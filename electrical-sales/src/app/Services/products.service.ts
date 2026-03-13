import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { SalesConfigService } from './sales-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [];

  constructor(private readonly salesConfig: SalesConfigService) {
    this.products = this.buildCatalog();
  }

  private buildCatalog(): Product[] {
    const config = this.salesConfig.salesConfig.catalog;
    const products = (config.seedProducts.length ? config.seedProducts : this.getDefaultSeedProducts()).map(product => ({
      ...product,
      image: product.image || this.buildImageUrl(product.category, product.id)
    }));

    const generation = config.generation;
    const categorySpecs = generation.categorySpecifications;
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
      const reviews = 120 + (index * 17) % 6200;
      const inStock = index % 8 !== 0;
      const id = nextId++;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');

      products.push({
        id,
        name: `${brand} ${this.getProductSuffix(category)} ${modelNumber}`,
        description: `${brand} ${category.toLowerCase()} solution built for dependable daily use, verified performance, and project-ready availability.`,
        price,
        originalPrice,
        image: this.buildImageUrl(category, id),
        category,
        inStock,
        rating,
        reviews,
        sku: `${brand.toUpperCase()}-${categoryKey}-${modelNumber}`,
        specifications: categorySpecs[category] || { Warranty: '1 year', Usage: 'General electrical', Finish: 'Standard' }
      });

      index += 1;
    }

    return products;
  }

  private getDefaultSeedProducts(): Product[] {
    return [
      { id: 1, name: 'Havells LED Panel 18W Prime', description: 'Slim commercial-grade LED panel with uniform brightness and low power draw.', price: 799, originalPrice: 1099, image: '', category: 'Lighting', inStock: true, rating: 4.7, reviews: 1840, sku: 'HAVELLS-LIGHT-0001', specifications: { Power: '18W', Shape: 'Square', Color: 'Cool White', Warranty: '2 years' } },
      { id: 2, name: 'Polycab House Wire 1.5 sq mm', description: 'Flexible FR house wire suitable for residential circuits and switchboards.', price: 2499, originalPrice: 2999, image: '', category: 'Cables', inStock: true, rating: 4.6, reviews: 920, sku: 'POLYCAB-CABLE-0002', specifications: { Length: '90 m', Gauge: '1.5 sq mm', Insulation: 'FR PVC', Color: 'Red' } },
      { id: 3, name: 'Anchor Roma Modular Switch Pack', description: 'Matte-finish modular switch set for premium residential installations.', price: 1599, originalPrice: 1999, image: '', category: 'Switches', inStock: true, rating: 4.5, reviews: 760, sku: 'ANCHOR-SWITCH-0003', specifications: { Modules: '8', Type: '10A switch', Finish: 'White matte', Warranty: '5 years' } },
      { id: 4, name: 'Luminous Zelio Inverter Combo', description: 'Home inverter combo designed for lights, fans, routers, and backup essentials.', price: 18499, originalPrice: 21999, image: '', category: 'Power Solutions', inStock: true, rating: 4.7, reviews: 1210, sku: 'LUMINOUS-POWER-0004', specifications: { Capacity: '1100 VA', Battery: '150 Ah', Output: 'Pure sine wave', Backup: '3-4 hrs' } },
      { id: 5, name: 'Crompton Ceiling Fan Surebreeze', description: 'Energy-efficient ceiling fan with stable speed and wide air delivery.', price: 2299, originalPrice: 2899, image: '', category: 'Fans', inStock: true, rating: 4.4, reviews: 1460, sku: 'CROMPTON-FAN-0005', specifications: { Sweep: '1200 mm', Power: '70W', Blade: '3', Warranty: '2 years' } },
      { id: 6, name: 'Legrand MCB 32A', description: 'High-breaker miniature circuit breaker for residential and small commercial protection.', price: 499, originalPrice: 699, image: '', category: 'Safety', inStock: true, rating: 4.8, reviews: 640, sku: 'LEGRAND-SAFE-0006', specifications: { Current: '32A', Poles: 'Single pole', Curve: 'C', Compliance: 'ISI' } },
      { id: 7, name: 'Bosch Impact Drill 550W', description: 'Compact impact drill for maintenance teams and on-site installation work.', price: 3199, originalPrice: 3999, image: '', category: 'Tools', inStock: true, rating: 4.5, reviews: 510, sku: 'BOSCH-TOOL-0007', specifications: { Power: '550W', Chuck: '13 mm', Speed: '2800 RPM', Warranty: '1 year' } },
      { id: 8, name: 'Bajaj Instant Water Heater 3L', description: 'Compact water heater for wash areas and quick-use applications.', price: 3899, originalPrice: 4799, image: '', category: 'Appliances', inStock: true, rating: 4.3, reviews: 430, sku: 'BAJAJ-APP-0008', specifications: { Capacity: '3L', Power: '3000W', Safety: 'Thermal cutout', Warranty: '2 years' } },
      { id: 9, name: 'Schneider Distribution Board 8 Way', description: 'Metal distribution board for neat power routing and circuit separation.', price: 2699, originalPrice: 3299, image: '', category: 'Panels', inStock: true, rating: 4.6, reviews: 390, sku: 'SCHNEIDER-PANEL-0009', specifications: { Ways: '8', Material: 'CRCA', Finish: 'Powder-coated', Mounting: 'Surface' } },
      { id: 10, name: 'Exide Tubular Battery 150Ah', description: 'Long-backup tubular battery suited for inverter and backup applications.', price: 13999, originalPrice: 16999, image: '', category: 'Batteries', inStock: true, rating: 4.7, reviews: 840, sku: 'EXIDE-BATT-0010', specifications: { Capacity: '150 Ah', Type: 'Tubular', Warranty: '36 months', Application: 'Inverter backup' } }
    ];
  }

  private getProductSuffix(category: string): string {
    const suffixMap: Record<string, string> = {
      Lighting: 'LED Panel',
      Cables: 'Power Cable',
      Switches: 'Switch Kit',
      'Power Solutions': 'Inverter Pack',
      Fans: 'Ceiling Fan',
      Safety: 'Protection Unit',
      Tools: 'Power Tool',
      Appliances: 'Utility Appliance',
      Panels: 'Distribution Board',
      Batteries: 'Tubular Battery'
    };
    return suffixMap[category] || category;
  }

  private buildImageUrl(category: string, seed: number): string {
    const categoryImages: Record<string, string[]> = {
      Lighting: ['LED_bulb.jpg', 'Compact_fluorescent_lamp.jpg', 'Light_bulb.jpg'],
      Cables: ['Electrical_cables.jpg', 'Electrical_wire.jpg', 'Power_cable.jpg'],
      Switches: ['Light_switch.jpg', 'Wall_switch.jpg', 'Electrical_switch.jpg'],
      'Power Solutions': ['UPS_battery.jpg', 'Solar_panel.jpg', 'Inverter.jpg'],
      Fans: ['Ceiling_fan.jpg', 'Table_fan.jpg', 'Air_cooler.jpg'],
      Safety: ['CCTV_camera.jpg', 'Security_camera.jpg', 'Surveillance_camera.jpg'],
      Tools: ['Power_drill.jpg', 'Angle_grinder.jpg', 'Toolbox_tools.jpg'],
      Appliances: ['Water_heater.jpg', 'Microwave_oven.jpg', 'Toaster.jpg'],
      Panels: ['Electrical_switch.jpg', 'Wall_switch.jpg', 'Power_cable.jpg'],
      Batteries: ['Car_battery.jpg', 'Lead_acid_battery.jpg', 'Rechargeable_batteries.jpg']
    };
    const images = categoryImages[category] || ['Electronics.jpg'];
    return this.toWikimediaFilePath(images[Math.abs(seed) % images.length]);
  }

  private toWikimediaFilePath(fileName: string): string {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=640`;
  }

  getAllProducts(): Observable<Product[]> { return of(this.products); }
  getProductById(id: number): Observable<Product | undefined> { return of(this.products.find(product => product.id === id)); }
  getProductsByCategory(category: string): Observable<Product[]> { return of(this.products.filter(product => product.category === category)); }
  getCategories(): Observable<string[]> { return of(Array.from(new Set(this.products.map(product => product.category))).sort()); }
  searchProducts(searchTerm: string): Observable<Product[]> {
    const value = searchTerm.toLowerCase();
    return of(this.products.filter(product => product.name.toLowerCase().includes(value) || product.description.toLowerCase().includes(value)));
  }
  getFeaturedProducts(): Observable<Product[]> { return of(this.products.filter(product => (product.rating || 0) >= 4.5)); }
  getDiscountedProducts(): Observable<Product[]> { return of(this.products.filter(product => (product.originalPrice || 0) > product.price)); }
  getBrands(): Observable<string[]> {
    const brands = ['All'];
    this.products.forEach(product => {
      const brand = product.name.split(' ')[0];
      if (!brands.includes(brand)) {
        brands.push(brand);
      }
    });
    return of(brands.sort());
  }
  getPriceRange(): Observable<{ min: number; max: number }> {
    const prices = this.products.map(product => product.price);
    return of({ min: Math.min(...prices), max: Math.max(...prices) });
  }
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> { return of(this.products.filter(product => product.price >= minPrice && product.price <= maxPrice)); }
  getNewProducts(): Observable<Product[]> { return of(this.products.slice(0, 5)); }
  getBestSellers(): Observable<Product[]> { return of(this.products.filter(product => (product.reviews || 0) > 1000).slice(0, 10)); }
}
