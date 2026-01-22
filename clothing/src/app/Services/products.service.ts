import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [
    {
      id: 1,
      name: 'Aurum Satin Slip Dress',
      description: 'Fluid satin midi with a soft cowl neckline and adjustable straps.',
      price: 2190,
      originalPrice: 2790,
      image: '/assets/images/aurum-slip.jpg',
      category: 'Women',
      inStock: true,
      rating: 4.7,
      reviews: 1820,
      sku: 'AURUM-WOMEN-0001',
      specifications: {
        Fabric: 'Satin blend',
        Fit: 'Regular',
        Length: 'Midi',
        Care: 'Dry clean'
      }
    },
    {
      id: 2,
      name: 'Mora Linen Co-ord Set',
      description: 'Breathable linen set with cropped top and tailored trousers.',
      price: 2890,
      originalPrice: 3290,
      image: '/assets/images/mora-coord.jpg',
      category: 'Women',
      inStock: true,
      rating: 4.6,
      reviews: 1320,
      sku: 'MORA-WOMEN-0002',
      specifications: {
        Fabric: '100% Linen',
        Fit: 'Relaxed',
        Rise: 'Mid-rise',
        Care: 'Machine wash'
      }
    },
    {
      id: 3,
      name: 'Vera Ribbed Knit Top',
      description: 'Rib-knit essential with a modern square neckline.',
      price: 990,
      originalPrice: 1290,
      image: '/assets/images/vera-knit.jpg',
      category: 'Women',
      inStock: true,
      rating: 4.5,
      reviews: 980,
      sku: 'VERA-WOMEN-0003',
      specifications: {
        Fabric: 'Viscose blend',
        Fit: 'Slim',
        Sleeve: 'Sleeveless',
        Care: 'Cold wash'
      }
    },
    {
      id: 4,
      name: 'Civico Tailored Blazer',
      description: 'Double-breasted blazer with sharp shoulders and satin lining.',
      price: 3490,
      originalPrice: 3990,
      image: '/assets/images/civico-blazer.jpg',
      category: 'Women',
      inStock: true,
      rating: 4.8,
      reviews: 1540,
      sku: 'CIVICO-WOMEN-0004',
      specifications: {
        Fabric: 'Poly wool blend',
        Fit: 'Tailored',
        Lining: 'Satin',
        Care: 'Dry clean'
      }
    },
    {
      id: 5,
      name: 'Nomad Straight Fit Jeans',
      description: 'Classic straight-leg denim with soft stretch comfort.',
      price: 1990,
      originalPrice: 2290,
      image: '/assets/images/nomad-jeans.jpg',
      category: 'Men',
      inStock: true,
      rating: 4.6,
      reviews: 2100,
      sku: 'NOMAD-MEN-0005',
      specifications: {
        Fabric: 'Cotton denim',
        Fit: 'Straight',
        Rise: 'Mid-rise',
        Care: 'Machine wash'
      }
    },
    {
      id: 6,
      name: 'Pulse Tech Polo',
      description: 'Performance polo with quick-dry finish and clean collar.',
      price: 1490,
      originalPrice: 1790,
      image: '/assets/images/pulse-polo.jpg',
      category: 'Men',
      inStock: true,
      rating: 4.4,
      reviews: 1260,
      sku: 'PULSE-MEN-0006',
      specifications: {
        Fabric: 'Poly knit',
        Fit: 'Athletic',
        Occasion: 'Activewear',
        Care: 'Machine wash'
      }
    },
    {
      id: 7,
      name: 'Atelier Oxford Shirt',
      description: 'Crisp Oxford shirt with contrast buttons.',
      price: 1890,
      originalPrice: 2190,
      image: '/assets/images/atelier-oxford.jpg',
      category: 'Men',
      inStock: true,
      rating: 4.5,
      reviews: 940,
      sku: 'ATELIER-MEN-0007',
      specifications: {
        Fabric: 'Cotton Oxford',
        Fit: 'Regular',
        Collar: 'Button-down',
        Care: 'Machine wash'
      }
    },
    {
      id: 8,
      name: 'Streetcraft Cargo Joggers',
      description: 'Utility joggers with cargo pockets and drawstring waist.',
      price: 1690,
      originalPrice: 1990,
      image: '/assets/images/streetcraft-jogger.jpg',
      category: 'Men',
      inStock: true,
      rating: 4.3,
      reviews: 880,
      sku: 'STREET-MEN-0008',
      specifications: {
        Fabric: 'Cotton twill',
        Fit: 'Tapered',
        Rise: 'Mid-rise',
        Care: 'Machine wash'
      }
    },
    {
      id: 9,
      name: 'Lune Kids Denim Dungaree',
      description: 'Play-ready dungaree with adjustable straps.',
      price: 1290,
      originalPrice: 1490,
      image: '/assets/images/lune-dungaree.jpg',
      category: 'Kids',
      inStock: true,
      rating: 4.6,
      reviews: 620,
      sku: 'LUNE-KIDS-0009',
      specifications: {
        Fabric: 'Cotton denim',
        Age: '3-6 years',
        Set: 'Dungaree + tee',
        Care: 'Machine wash'
      }
    },
    {
      id: 10,
      name: 'Kora Printed Kurta Set',
      description: 'Vibrant printed kurta with soft cotton pants.',
      price: 1590,
      originalPrice: 1890,
      image: '/assets/images/kora-kurta.jpg',
      category: 'Kids',
      inStock: true,
      rating: 4.5,
      reviews: 540,
      sku: 'KORA-KIDS-0010',
      specifications: {
        Fabric: 'Cotton',
        Age: '7-10 years',
        Set: 'Kurta + pants',
        Care: 'Machine wash'
      }
    },
    {
      id: 11,
      name: 'Aurum Court Sneakers',
      description: 'Minimal leather sneakers with padded collars.',
      price: 2790,
      originalPrice: 3190,
      image: '/assets/images/aurum-sneaker.jpg',
      category: 'Footwear',
      inStock: true,
      rating: 4.7,
      reviews: 1680,
      sku: 'AURUM-FOOT-0011',
      specifications: {
        Material: 'Leather upper',
        Sole: 'Rubber',
        Closure: 'Lace-up',
        Care: 'Wipe clean'
      }
    },
    {
      id: 12,
      name: 'Nomad Chelsea Boots',
      description: 'Polished ankle boots with elastic side panels.',
      price: 3590,
      originalPrice: 3990,
      image: '/assets/images/nomad-boot.jpg',
      category: 'Footwear',
      inStock: true,
      rating: 4.6,
      reviews: 1020,
      sku: 'NOMAD-FOOT-0012',
      specifications: {
        Material: 'Leather upper',
        Sole: 'Rubber',
        Closure: 'Slip-on',
        Care: 'Wipe clean'
      }
    },
    {
      id: 13,
      name: 'Vera Block Heel Sandals',
      description: 'Strappy heels with a comfort footbed.',
      price: 2190,
      originalPrice: 2490,
      image: '/assets/images/vera-heels.jpg',
      category: 'Footwear',
      inStock: true,
      rating: 4.4,
      reviews: 760,
      sku: 'VERA-FOOT-0013',
      specifications: {
        Material: 'Faux leather',
        Heel: '2.5 in',
        Closure: 'Buckle',
        Care: 'Wipe clean'
      }
    },
    {
      id: 14,
      name: 'StudioLine Trainers',
      description: 'Lightweight trainers with breathable mesh.',
      price: 2590,
      originalPrice: 2890,
      image: '/assets/images/studio-trainer.jpg',
      category: 'Footwear',
      inStock: true,
      rating: 4.5,
      reviews: 880,
      sku: 'STUDIO-FOOT-0014',
      specifications: {
        Material: 'Mesh upper',
        Sole: 'EVA',
        Closure: 'Lace-up',
        Care: 'Hand wash'
      }
    },
    {
      id: 15,
      name: 'Velvetry Structured Tote',
      description: 'Structured tote with dual compartments.',
      price: 2390,
      originalPrice: 2690,
      image: '/assets/images/velvetry-tote.jpg',
      category: 'Accessories',
      inStock: true,
      rating: 4.6,
      reviews: 1110,
      sku: 'VELVET-ACC-0015',
      specifications: {
        Material: 'Vegan leather',
        Type: 'Tote',
        Closure: 'Magnet',
        Warranty: '6 months'
      }
    },
    {
      id: 16,
      name: 'Lune Minimal Watch',
      description: 'Minimal dial watch with mesh strap.',
      price: 1990,
      originalPrice: 2390,
      image: '/assets/images/lune-watch.jpg',
      category: 'Accessories',
      inStock: true,
      rating: 4.5,
      reviews: 980,
      sku: 'LUNE-ACC-0016',
      specifications: {
        Material: 'Stainless steel',
        Type: 'Analog',
        Warranty: '12 months',
        Water: '30 m'
      }
    },
    {
      id: 17,
      name: 'Aurum Aviator Sunglasses',
      description: 'Classic aviators with polarized lenses.',
      price: 1490,
      originalPrice: 1790,
      image: '/assets/images/aurum-aviator.jpg',
      category: 'Accessories',
      inStock: true,
      rating: 4.4,
      reviews: 720,
      sku: 'AURUM-ACC-0017',
      specifications: {
        Material: 'Metal frame',
        Lens: 'Polarized',
        UV: 'UV400',
        Warranty: '6 months'
      }
    },
    {
      id: 18,
      name: 'Pulse Gym Duffel',
      description: 'Convertible duffel with shoe compartment.',
      price: 1790,
      originalPrice: 2090,
      image: '/assets/images/pulse-duffel.jpg',
      category: 'Accessories',
      inStock: true,
      rating: 4.3,
      reviews: 610,
      sku: 'PULSE-ACC-0018',
      specifications: {
        Material: 'Nylon',
        Type: 'Duffel',
        Capacity: '24 L',
        Warranty: '6 months'
      }
    },
    {
      id: 19,
      name: 'Mora Silk Scarf',
      description: 'Lightweight silk scarf with painterly print.',
      price: 1290,
      originalPrice: 1590,
      image: '/assets/images/mora-scarf.jpg',
      category: 'Accessories',
      inStock: true,
      rating: 4.5,
      reviews: 540,
      sku: 'MORA-ACC-0019',
      specifications: {
        Material: 'Silk',
        Size: '70 cm',
        Type: 'Scarf',
        Care: 'Dry clean'
      }
    },
    {
      id: 20,
      name: 'Vera Matte Lip Kit',
      description: 'Long-wear matte lipstick with matching liner.',
      price: 890,
      originalPrice: 1090,
      image: '/assets/images/vera-lip.jpg',
      category: 'Beauty',
      inStock: true,
      rating: 4.6,
      reviews: 1320,
      sku: 'VERA-BEAUTY-0020',
      specifications: {
        Type: 'Lip kit',
        Finish: 'Matte',
        Volume: '3.5 g',
        Cruelty: 'Yes'
      }
    },
    {
      id: 21,
      name: 'Aurum Eau de Parfum',
      description: 'Warm amber fragrance with floral notes.',
      price: 2590,
      originalPrice: 2990,
      image: '/assets/images/aurum-perfume.jpg',
      category: 'Beauty',
      inStock: true,
      rating: 4.7,
      reviews: 860,
      sku: 'AURUM-BEAUTY-0021',
      specifications: {
        Type: 'Eau de parfum',
        Volume: '50 ml',
        Notes: 'Amber floral',
        Cruelty: 'Yes'
      }
    },
    {
      id: 22,
      name: 'Civico Lounge Throw',
      description: 'Soft textured throw for modern living rooms.',
      price: 1690,
      originalPrice: 1990,
      image: '/assets/images/civico-throw.jpg',
      category: 'Home',
      inStock: true,
      rating: 4.4,
      reviews: 520,
      sku: 'CIVICO-HOME-0022',
      specifications: {
        Material: 'Cotton blend',
        Size: '50 x 60 in',
        Room: 'Living',
        Care: 'Machine wash'
      }
    },
    {
      id: 23,
      name: 'StudioLine Performance Leggings',
      description: 'Stretch leggings with sculpting waistband.',
      price: 1590,
      originalPrice: 1890,
      image: '/assets/images/studio-leggings.jpg',
      category: 'Sports',
      inStock: true,
      rating: 4.6,
      reviews: 1180,
      sku: 'STUDIO-SPORT-0023',
      specifications: {
        Fabric: 'Nylon blend',
        Stretch: '4-way',
        Use: 'Training',
        Care: 'Machine wash'
      }
    },
    {
      id: 24,
      name: 'Atelier Luxe Wool Coat',
      description: 'Oversized wool coat with clean lapels.',
      price: 5990,
      originalPrice: 6990,
      image: '/assets/images/atelier-coat.jpg',
      category: 'Luxe',
      inStock: true,
      rating: 4.8,
      reviews: 640,
      sku: 'ATELIER-LUXE-0024',
      specifications: {
        Fabric: 'Wool blend',
        Fit: 'Oversized',
        Lining: 'Satin',
        Care: 'Dry clean'
      }
    },
    {
      id: 25,
      name: 'Streetcraft Graphic Hoodie',
      description: 'Oversized hoodie with brushed fleece interior.',
      price: 1790,
      originalPrice: 2090,
      image: '/assets/images/streetcraft-hoodie.jpg',
      category: 'Streetwear',
      inStock: true,
      rating: 4.5,
      reviews: 920,
      sku: 'STREET-STREET-0025',
      specifications: {
        Fabric: 'Cotton fleece',
        Fit: 'Oversized',
        Drop: 'Limited',
        Care: 'Machine wash'
      }
    }
  ];

  constructor() {
    this.assignImageUrls();
    this.ensureMinimumProducts(240);
  }

  private assignImageUrls(): void {
    this.products = this.products.map(product => ({
      ...product,
      image: this.buildImageUrl(product.category, product.id)
    }));
  }

  private ensureMinimumProducts(minCount: number): void {
    if (this.products.length >= minCount) {
      return;
    }

    const categories = [
      'Women',
      'Men',
      'Kids',
      'Footwear',
      'Accessories',
      'Beauty',
      'Home',
      'Sports',
      'Luxe',
      'Streetwear'
    ];

    const brands = [
      'Aurum',
      'Mora',
      'Civico',
      'Vera',
      'Pulse',
      'Nomad',
      'Lune',
      'Atelier',
      'StudioLine',
      'Streetcraft',
      'Velvetry',
      'Kora'
    ];

    const categorySpecs: Record<string, { [key: string]: string }> = {
      Women: {
        Fabric: 'Blend',
        Fit: 'Regular',
        Length: 'Midi',
        Care: 'Dry clean'
      },
      Men: {
        Fabric: 'Cotton',
        Fit: 'Regular',
        Occasion: 'Smart casual',
        Care: 'Machine wash'
      },
      Kids: {
        Fabric: 'Cotton',
        Age: '2-10 years',
        Set: '2 pieces',
        Care: 'Machine wash'
      },
      Footwear: {
        Material: 'Mixed',
        Sole: 'Rubber',
        Closure: 'Lace-up',
        Care: 'Wipe clean'
      },
      Accessories: {
        Material: 'Vegan leather',
        Type: 'Accessory',
        Closure: 'Magnet',
        Warranty: '6 months'
      },
      Beauty: {
        Type: 'Beauty',
        Finish: 'Matte',
        Volume: '50 ml',
        Cruelty: 'Yes'
      },
      Home: {
        Material: 'Cotton blend',
        Size: 'Standard',
        Room: 'Living',
        Care: 'Machine wash'
      },
      Sports: {
        Fabric: 'Performance knit',
        Stretch: '4-way',
        Use: 'Training',
        Care: 'Machine wash'
      },
      Luxe: {
        Fabric: 'Premium blend',
        Craft: 'Hand-finished',
        Lining: 'Satin',
        Care: 'Dry clean'
      },
      Streetwear: {
        Fabric: 'Cotton fleece',
        Fit: 'Oversized',
        Drop: 'Limited',
        Care: 'Machine wash'
      }
    };

    let nextId = Math.max(...this.products.map(p => p.id)) + 1;
    let index = 0;

    while (this.products.length < minCount) {
      const category = categories[index % categories.length];
      const brand = brands[index % brands.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = 590 + (index * 37) % 5200;
      const isDiscounted = index % 3 === 0;
      const price = basePrice + (category.length * 15);
      const originalPrice = isDiscounted ? price + Math.round(price * 0.2) : undefined;
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
        specifications: categorySpecs[category]
      });

      index += 1;
    }
  }

  private buildImageUrl(category: string, seed: number): string {
    const categoryKeywords: Record<string, string[]> = {
      Women: ['women fashion', 'dress', 'blazer', 'skirt'],
      Men: ['menswear', 'denim', 'shirt', 'jacket'],
      Kids: ['kids fashion', 'kids outfit', 'kids wear'],
      Footwear: ['sneakers', 'boots', 'heels', 'loafers'],
      Accessories: ['handbag', 'watch', 'sunglasses', 'belt'],
      Beauty: ['makeup', 'perfume', 'skincare'],
      Home: ['home decor', 'throw blanket', 'cushion'],
      Sports: ['activewear', 'training', 'sportswear'],
      Luxe: ['luxury fashion', 'coat', 'designer'],
      Streetwear: ['streetwear', 'hoodie', 'sneaker']
    };

    const keywords = categoryKeywords[category] ?? ['fashion'];
    const index = Math.abs(seed) % keywords.length;
    const keyword = keywords[index];
    return `https://source.unsplash.com/featured/640x640?${encodeURIComponent(keyword)}`;
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
