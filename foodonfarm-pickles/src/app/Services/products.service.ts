import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';
import { ImageFallbackUtil } from './image-fallback.util';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly storageKey = 'fof_products_v2';
  private readonly productsSubject = new BehaviorSubject<Product[]>(this.loadProducts());

  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  getCategories(): string[] {
    return Array.from(new Set(this.productsSubject.value.map(product => product.category)));
  }

  addProduct(input: Omit<Product, 'id'>): Product {
    const nextId = Math.max(0, ...this.productsSubject.value.map(product => product.id)) + 1;
    const created: Product = { ...input, id: nextId };
    const updated = [created, ...this.productsSubject.value];
    this.persist(updated);
    return created;
  }

  updateProduct(updatedProduct: Product): void {
    const updated = this.productsSubject.value.map(product =>
      product.id === updatedProduct.id ? { ...updatedProduct } : product
    );
    this.persist(updated);
  }

  deleteProduct(id: number): void {
    const updated = this.productsSubject.value.filter(product => product.id !== id);
    this.persist(updated);
  }

  private persist(products: Product[]): void {
    this.productsSubject.next(products);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(products));
    }
  }

  private loadProducts(): Product[] {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Product[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            return this.normalizeProducts(parsed);
          }
        } catch {
          // ignore parse errors and fall back to defaults
        }
      }
    }

    return this.normalizeProducts([
      {
        id: 1,
        name: 'Mixed Veg Pickle',
        description: 'Traditional mixed vegetable pickle in sesame oil.',
        category: 'Vegetarian Pickles',
        price: 160,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1645191105414-d3f0c81f3f4a?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        featured: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['veg-pickles']
      },
      {
        id: 2,
        name: 'Mango Pickle (Avakaya)',
        description: 'Andhra-style spicy mango pickle with village masala.',
        category: 'Vegetarian Pickles',
        price: 190,
        originalPrice: 250,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        featured: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['veg-pickles']
      },
      {
        id: 3,
        name: 'Gongura Pickle',
        description: 'Tangy gongura leaves pickle with bold spice notes.',
        category: 'Vegetarian Pickles',
        price: 220,
        originalPrice: 290,
        image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['veg-pickles']
      },
      {
        id: 4,
        name: 'Chicken Boneless Pickle',
        description: 'Tender boneless chicken pickle in rich homemade masala.',
        category: 'Non-Vegetarian Pickles',
        price: 380,
        originalPrice: 460,
        image: 'https://images.unsplash.com/photo-1571197119282-7c4f4bdfd951?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        featured: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['non-veg-pickles']
      },
      {
        id: 5,
        name: 'Mutton Boneless Pickle',
        description: 'Slow-cooked mutton pickle with deep roasted spices.',
        category: 'Non-Vegetarian Pickles',
        price: 550,
        originalPrice: 640,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['non-veg-pickles']
      },
      {
        id: 6,
        name: 'Prawn Pickle',
        description: 'Coastal-style prawn pickle with authentic spice balance.',
        category: 'Non-Vegetarian Pickles',
        price: 420,
        originalPrice: 510,
        image: 'https://images.unsplash.com/photo-1625943555409-49759df8f6fd?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['non-veg-pickles']
      },
      {
        id: 7,
        name: 'Avisa Kaaram Podi',
        description: 'Flaxseed spice powder for rice, idli, and dosa.',
        category: 'Masala & Kaaram Powders',
        price: 180,
        originalPrice: 240,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['masala-kaaram-powders']
      },
      {
        id: 8,
        name: 'Nuvvula Podi',
        description: 'Sesame spice blend made in small fresh batches.',
        category: 'Masala & Kaaram Powders',
        price: 210,
        originalPrice: 280,
        image: 'https://images.unsplash.com/photo-1596040033303-06ac9ec5f6f8?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['masala-kaaram-powders']
      },
      {
        id: 9,
        name: 'Idli Kaaram Podi',
        description: 'Classic idli karam powder with roasted lentils.',
        category: 'Masala & Kaaram Powders',
        price: 170,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['masala-kaaram-powders']
      },
      {
        id: 10,
        name: 'Bellam Gavvalu',
        description: 'Traditional jaggery-coated crunchy sweet snack.',
        category: 'Sweets & Snacks',
        price: 170,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['sweets-snacks']
      },
      {
        id: 11,
        name: 'Ariselu',
        description: 'Soft traditional sweet made with rice flour and jaggery.',
        category: 'Sweets & Snacks',
        price: 200,
        originalPrice: 260,
        image: 'https://images.unsplash.com/photo-1601050690117-24e4cf5b7d87?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['sweets-snacks']
      },
      {
        id: 12,
        name: 'Atukula Mixture',
        description: 'Crispy poha mixture with peanuts and curry leaves.',
        category: 'Sweets & Snacks',
        price: 150,
        originalPrice: 190,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        featured: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['sweets-snacks']
      },
      {
        id: 13,
        name: 'Fryums Family Pack',
        description: 'Sun-dried fryums for crispy family-time snacking.',
        category: 'Fryums',
        price: 140,
        originalPrice: 190,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g', '1Kg'],
        collectionSlugs: ['fryums']
      },
      {
        id: 14,
        name: 'Sabudana Fryums',
        description: 'Classic sabudana fryums with light crunchy texture.',
        category: 'Fryums',
        price: 160,
        originalPrice: 210,
        image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['fryums']
      },
      {
        id: 15,
        name: 'Rice Papad Fryums',
        description: 'Rice papad style fryums with authentic home taste.',
        category: 'Fryums',
        price: 150,
        originalPrice: 200,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['250g', '500g'],
        collectionSlugs: ['fryums']
      },
      {
        id: 16,
        name: 'Instant Dosa Mix',
        description: 'Ready-to-cook dosa mix for quick breakfast preparation.',
        category: 'Instant Mixes',
        price: 180,
        originalPrice: 230,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['500g', '1Kg'],
        collectionSlugs: ['instant-mixes']
      },
      {
        id: 17,
        name: 'Instant Idli Mix',
        description: 'Soft idli mix with balanced fermentation profile.',
        category: 'Instant Mixes',
        price: 170,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['500g', '1Kg'],
        collectionSlugs: ['instant-mixes']
      },
      {
        id: 18,
        name: 'Instant Upma Mix',
        description: 'Savory upma mix for fast and consistent home cooking.',
        category: 'Instant Mixes',
        price: 150,
        originalPrice: 200,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
        inStock: true,
        weightOptions: ['500g', '1Kg'],
        collectionSlugs: ['instant-mixes']
      }
    ]);
  }

  private normalizeProducts(products: Product[]): Product[] {
    return products.map(product => ({
      ...product,
      image: ImageFallbackUtil.ensureImage(product.image, product.name, product.category),
      description: ImageFallbackUtil.ensureDescription(product.description, product.category)
    }));
  }
}
