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
      name: 'Crisp Gala Apples (1 kg)',
      description: 'Sweet and crunchy apples for snacking and salads.',
      price: 160,
      originalPrice: 195,
      image: '/assets/images/gala-apples.jpg',
      category: 'Fresh Produce',
      inStock: true,
      rating: 4.7,
      reviews: 1840,
      sku: 'FRESH-APPLE-1KG',
      specifications: {
        'Net Weight': '1 kg',
        'Origin': 'Himachal',
        'Storage': 'Cool and dry',
        'Best For': 'Snacking, salads'
      }
    },
    {
      id: 2,
      name: 'Bananas (Robusta, 6 pcs)',
      description: 'Everyday bananas with smooth texture and natural sweetness.',
      price: 48,
      originalPrice: 60,
      image: '/assets/images/banana.jpg',
      category: 'Fresh Produce',
      inStock: true,
      rating: 4.6,
      reviews: 2120,
      sku: 'FRESH-BANANA-6PK',
      specifications: {
        'Count': '6 pcs',
        'Ripeness': 'Ready to eat',
        'Origin': 'Andhra Pradesh',
        'Storage': 'Room temperature'
      }
    },
    {
      id: 3,
      name: 'Vine Tomatoes (500 g)',
      description: 'Juicy tomatoes for curries, salads, and sauces.',
      price: 62,
      originalPrice: 75,
      image: '/assets/images/tomatoes.jpg',
      category: 'Fresh Produce',
      inStock: true,
      rating: 4.5,
      reviews: 1480,
      sku: 'FRESH-TOMATO-500G',
      specifications: {
        'Net Weight': '500 g',
        'Origin': 'Karnataka',
        'Storage': 'Cool and dry',
        'Best For': 'Cooking, salads'
      }
    },
    {
      id: 4,
      name: 'English Cucumber (2 pcs)',
      description: 'Fresh cucumbers with mild flavor and crunch.',
      price: 55,
      originalPrice: 70,
      image: '/assets/images/cucumber.jpg',
      category: 'Fresh Produce',
      inStock: true,
      rating: 4.4,
      reviews: 980,
      sku: 'FRESH-CUKE-2PK',
      specifications: {
        'Count': '2 pcs',
        'Origin': 'Telangana',
        'Storage': 'Refrigerate',
        'Best For': 'Salads, raita'
      }
    },
    {
      id: 5,
      name: 'Toned Milk (1 L)',
      description: 'Daily dairy essential with balanced fat content.',
      price: 64,
      originalPrice: 72,
      image: '/assets/images/milk.jpg',
      category: 'Dairy & Eggs',
      inStock: true,
      rating: 4.8,
      reviews: 3520,
      sku: 'DAIRY-MILK-1L',
      specifications: {
        'Volume': '1 L',
        'Fat': '3%',
        'Type': 'Toned',
        'Storage': 'Refrigerate'
      }
    },
    {
      id: 6,
      name: 'Farm Eggs (12 pcs)',
      description: 'Farm-fresh eggs for breakfast and baking.',
      price: 84,
      originalPrice: 98,
      image: '/assets/images/eggs.jpg',
      category: 'Dairy & Eggs',
      inStock: true,
      rating: 4.7,
      reviews: 2670,
      sku: 'DAIRY-EGGS-12PK',
      specifications: {
        'Count': '12 pcs',
        'Grade': 'A',
        'Storage': 'Refrigerate',
        'Best For': 'Breakfast, baking'
      }
    },
    {
      id: 7,
      name: 'Greek Yogurt (400 g)',
      description: 'Thick, creamy yogurt with high protein.',
      price: 110,
      originalPrice: 130,
      image: '/assets/images/greek-yogurt.jpg',
      category: 'Dairy & Eggs',
      inStock: true,
      rating: 4.6,
      reviews: 1190,
      sku: 'DAIRY-YOGURT-400G',
      specifications: {
        'Net Weight': '400 g',
        'Protein': 'High',
        'Type': 'Unsweetened',
        'Storage': 'Refrigerate'
      }
    },
    {
      id: 8,
      name: 'Whole Wheat Bread (400 g)',
      description: 'Soft slices with whole grain goodness.',
      price: 55,
      originalPrice: 70,
      image: '/assets/images/bread.jpg',
      category: 'Bakery',
      inStock: true,
      rating: 4.5,
      reviews: 860,
      sku: 'BAKERY-WHEAT-400G',
      specifications: {
        'Net Weight': '400 g',
        'Type': 'Whole wheat',
        'Shelf Life': '4 days',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 9,
      name: 'Butter Croissants (4 pcs)',
      description: 'Flaky croissants baked daily.',
      price: 120,
      originalPrice: 150,
      image: '/assets/images/croissant.jpg',
      category: 'Bakery',
      inStock: true,
      rating: 4.6,
      reviews: 740,
      sku: 'BAKERY-CROISS-4PK',
      specifications: {
        'Count': '4 pcs',
        'Type': 'Butter',
        'Shelf Life': '2 days',
        'Storage': 'Room temperature'
      }
    },
    {
      id: 10,
      name: 'Classic Muffins (6 pcs)',
      description: 'Soft muffins with a vanilla finish.',
      price: 135,
      originalPrice: 160,
      image: '/assets/images/muffins.jpg',
      category: 'Bakery',
      inStock: true,
      rating: 4.4,
      reviews: 610,
      sku: 'BAKERY-MUFF-6PK',
      specifications: {
        'Count': '6 pcs',
        'Type': 'Vanilla',
        'Shelf Life': '3 days',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 11,
      name: 'Basmati Rice (5 kg)',
      description: 'Long-grain rice with aromatic flavor.',
      price: 540,
      originalPrice: 620,
      image: '/assets/images/basmati-rice.jpg',
      category: 'Staples',
      inStock: true,
      rating: 4.8,
      reviews: 1990,
      sku: 'STAPLE-RICE-5KG',
      specifications: {
        'Net Weight': '5 kg',
        'Grain': 'Long',
        'Aroma': 'Natural',
        'Storage': 'Airtight'
      }
    },
    {
      id: 12,
      name: 'Toor Dal (1 kg)',
      description: 'Protein-rich lentils for daily meals.',
      price: 165,
      originalPrice: 195,
      image: '/assets/images/toor-dal.jpg',
      category: 'Staples',
      inStock: true,
      rating: 4.6,
      reviews: 1420,
      sku: 'STAPLE-DAL-1KG',
      specifications: {
        'Net Weight': '1 kg',
        'Type': 'Toor',
        'Protein': 'High',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 13,
      name: 'All Purpose Flour (1 kg)',
      description: 'Finely milled flour for baking and cooking.',
      price: 58,
      originalPrice: 70,
      image: '/assets/images/flour.jpg',
      category: 'Staples',
      inStock: true,
      rating: 4.5,
      reviews: 1020,
      sku: 'STAPLE-FLOUR-1KG',
      specifications: {
        'Net Weight': '1 kg',
        'Type': 'Refined wheat',
        'Best For': 'Baking',
        'Storage': 'Airtight'
      }
    },
    {
      id: 14,
      name: 'Sea Salt Potato Chips (150 g)',
      description: 'Crunchy chips with a clean sea salt finish.',
      price: 65,
      originalPrice: 80,
      image: '/assets/images/potato-chips.jpg',
      category: 'Snacks',
      inStock: true,
      rating: 4.4,
      reviews: 860,
      sku: 'SNACK-CHIPS-150G',
      specifications: {
        'Net Weight': '150 g',
        'Flavor': 'Sea salt',
        'Veg': 'Yes',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 15,
      name: 'Roasted Almonds (200 g)',
      description: 'Lightly roasted almonds for healthy snacking.',
      price: 220,
      originalPrice: 260,
      image: '/assets/images/almonds.jpg',
      category: 'Snacks',
      inStock: true,
      rating: 4.7,
      reviews: 1260,
      sku: 'SNACK-ALMOND-200G',
      specifications: {
        'Net Weight': '200 g',
        'Type': 'Roasted',
        'Protein': 'High',
        'Storage': 'Airtight'
      }
    },
    {
      id: 16,
      name: 'Sparkling Water (6 x 330 ml)',
      description: 'Refreshing sparkling water with zero sugar.',
      price: 180,
      originalPrice: 210,
      image: '/assets/images/sparkling-water.jpg',
      category: 'Beverages',
      inStock: true,
      rating: 4.5,
      reviews: 690,
      sku: 'BEV-SPARK-6PK',
      specifications: {
        'Pack Size': '6 x 330 ml',
        'Sugar': '0 g',
        'Flavor': 'Plain',
        'Storage': 'Chill'
      }
    },
    {
      id: 17,
      name: 'Orange Juice (1 L)',
      description: 'Cold pressed juice with no added sugar.',
      price: 140,
      originalPrice: 165,
      image: '/assets/images/orange-juice.jpg',
      category: 'Beverages',
      inStock: true,
      rating: 4.6,
      reviews: 740,
      sku: 'BEV-OJ-1L',
      specifications: {
        'Volume': '1 L',
        'Type': 'Cold pressed',
        'Sugar': 'No added',
        'Storage': 'Refrigerate'
      }
    },
    {
      id: 18,
      name: 'Fresh Brew Coffee (500 ml)',
      description: 'Chilled coffee for quick energy.',
      price: 110,
      originalPrice: 130,
      image: '/assets/images/iced-coffee.jpg',
      category: 'Beverages',
      inStock: true,
      rating: 4.4,
      reviews: 540,
      sku: 'BEV-COFFEE-500ML',
      specifications: {
        'Volume': '500 ml',
        'Type': 'Cold brew',
        'Caffeine': 'Regular',
        'Storage': 'Refrigerate'
      }
    },
    {
      id: 19,
      name: 'Laundry Detergent (2 L)',
      description: 'Concentrated liquid detergent for bright washes.',
      price: 320,
      originalPrice: 360,
      image: '/assets/images/detergent.jpg',
      category: 'Household',
      inStock: true,
      rating: 4.6,
      reviews: 810,
      sku: 'HOME-DETER-2L',
      specifications: {
        'Volume': '2 L',
        'Type': 'Liquid',
        'Use': 'Machine wash',
        'Fragrance': 'Fresh'
      }
    },
    {
      id: 20,
      name: 'Dish Wash Liquid (1 L)',
      description: 'Cut grease fast with lemon freshness.',
      price: 110,
      originalPrice: 135,
      image: '/assets/images/dishwash.jpg',
      category: 'Household',
      inStock: true,
      rating: 4.5,
      reviews: 640,
      sku: 'HOME-DISH-1L',
      specifications: {
        'Volume': '1 L',
        'Type': 'Liquid',
        'Fragrance': 'Lemon',
        'Use': 'Hand wash'
      }
    },
    {
      id: 21,
      name: 'Aloe Shower Gel (500 ml)',
      description: 'Gentle body wash with aloe freshness.',
      price: 180,
      originalPrice: 210,
      image: '/assets/images/shower-gel.jpg',
      category: 'Personal Care',
      inStock: true,
      rating: 4.5,
      reviews: 530,
      sku: 'CARE-GEL-500ML',
      specifications: {
        'Volume': '500 ml',
        'Type': 'Body wash',
        'Skin Type': 'All',
        'Fragrance': 'Aloe'
      }
    },
    {
      id: 22,
      name: 'Herbal Shampoo (340 ml)',
      description: 'Daily shampoo with herbal extracts.',
      price: 220,
      originalPrice: 250,
      image: '/assets/images/shampoo.jpg',
      category: 'Personal Care',
      inStock: true,
      rating: 4.4,
      reviews: 710,
      sku: 'CARE-SHAM-340ML',
      specifications: {
        'Volume': '340 ml',
        'Type': 'Shampoo',
        'Hair Type': 'All',
        'Fragrance': 'Herbal'
      }
    },
    {
      id: 23,
      name: 'Frozen Green Peas (500 g)',
      description: 'Quick frozen peas for curries and pulao.',
      price: 110,
      originalPrice: 130,
      image: '/assets/images/frozen-peas.jpg',
      category: 'Frozen',
      inStock: true,
      rating: 4.5,
      reviews: 680,
      sku: 'FROZEN-PEAS-500G',
      specifications: {
        'Net Weight': '500 g',
        'Type': 'Green peas',
        'Storage': 'Frozen',
        'Prep': 'Ready to cook'
      }
    },
    {
      id: 24,
      name: 'Margherita Frozen Pizza (300 g)',
      description: 'Stone baked base with mozzarella topping.',
      price: 190,
      originalPrice: 225,
      image: '/assets/images/frozen-pizza.jpg',
      category: 'Frozen',
      inStock: true,
      rating: 4.3,
      reviews: 460,
      sku: 'FROZEN-PIZZA-300G',
      specifications: {
        'Net Weight': '300 g',
        'Type': 'Vegetarian',
        'Bake Time': '10-12 min',
        'Storage': 'Frozen'
      }
    },
    {
      id: 25,
      name: 'Ready Veggie Bowl (350 g)',
      description: 'Ready meal with grains, veggies, and sauce.',
      price: 160,
      originalPrice: 190,
      image: '/assets/images/ready-meal.jpg',
      category: 'Ready Meals',
      inStock: true,
      rating: 4.2,
      reviews: 390,
      sku: 'READY-BOWL-350G',
      specifications: {
        'Net Weight': '350 g',
        'Type': 'Vegetarian',
        'Heat Time': '3-4 min',
        'Storage': 'Chilled'
      }
    }
  ];

  constructor() {
    this.assignImageUrls();
    this.ensureMinimumProducts(600);
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
      'Fresh Produce',
      'Dairy & Eggs',
      'Bakery',
      'Staples',
      'Snacks',
      'Beverages',
      'Household',
      'Personal Care',
      'Frozen',
      'Ready Meals'
    ];

    const brands = [
      'FreshLane',
      'GreenCart',
      'UrbanFarm',
      'DailyDairy',
      'BakeHouse',
      'QuickBite',
      'PureSip',
      'HomeSpark',
      'CleanCare',
      'FrostBox',
      'SwiftPantry',
      'Growers'
    ];

    const categorySpecs: Record<string, { [key: string]: string }> = {
      'Fresh Produce': {
        'Net Weight': '500 g',
        'Origin': 'Local',
        'Storage': 'Cool and dry',
        'Best For': 'Daily cooking'
      },
      'Dairy & Eggs': {
        'Volume': '1 L / 12 pcs',
        'Type': 'Daily use',
        'Fat': 'Balanced',
        'Storage': 'Refrigerate'
      },
      'Bakery': {
        'Net Weight': '400 g',
        'Type': 'Freshly baked',
        'Shelf Life': '3 days',
        'Storage': 'Room temperature'
      },
      'Staples': {
        'Net Weight': '1 kg',
        'Type': 'Daily pantry',
        'Best For': 'Cooking',
        'Storage': 'Airtight'
      },
      'Snacks': {
        'Net Weight': '200 g',
        'Flavor': 'Classic',
        'Veg': 'Yes',
        'Storage': 'Cool and dry'
      },
      'Beverages': {
        'Volume': '1 L',
        'Type': 'Ready to drink',
        'Sugar': 'Low',
        'Storage': 'Chill'
      },
      'Household': {
        'Volume': '1 L',
        'Type': 'Cleaning',
        'Use': 'Daily',
        'Fragrance': 'Fresh'
      },
      'Personal Care': {
        'Volume': '400 ml',
        'Type': 'Daily care',
        'Skin Type': 'All',
        'Fragrance': 'Mild'
      },
      'Frozen': {
        'Net Weight': '500 g',
        'Type': 'Frozen',
        'Prep': 'Ready to cook',
        'Storage': 'Frozen'
      },
      'Ready Meals': {
        'Net Weight': '350 g',
        'Type': 'Ready to eat',
        'Heat Time': '3-4 min',
        'Storage': 'Chilled'
      }
    };

    let nextId = Math.max(...this.products.map(p => p.id)) + 1;
    let index = 0;

    while (this.products.length < minCount) {
      const category = categories[index % categories.length];
      const brand = brands[index % brands.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = 49 + (index * 17) % 900;
      const isDiscounted = index % 3 === 0;
      const price = basePrice + (category.length * 2);
      const originalPrice = isDiscounted ? price + Math.round(price * 0.2) : undefined;
      const rating = Math.min(5, 3.9 + (index % 11) * 0.1);
      const reviews = 40 + (index * 11) % 5000;
      const inStock = index % 8 !== 0;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const id = nextId++;

      this.products.push({
        id,
        name: `${brand} ${category} ${modelNumber}`,
        description: `Fast-delivery ${category.toLowerCase()} from ${brand} packed and shipped in minutes.`,
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
    const categoryImages: Record<string, string[]> = {
      'Fresh Produce': [
        'Apple.jpg',
        'Banana.jpg',
        'Tomato.jpg',
        'Cucumber.jpg',
        'Spinach.jpg'
      ],
      'Dairy & Eggs': [
        'Milk.jpg',
        'Eggs.jpg',
        'Yogurt.jpg'
      ],
      'Bakery': [
        'Bread.jpg',
        'Croissant.jpg',
        'Muffin.jpg'
      ],
      'Staples': [
        'Rice.jpg',
        'Lentils.jpg',
        'Flour.jpg'
      ],
      'Snacks': [
        'Potato_chips.jpg',
        'Almonds.jpg',
        'Cookies.jpg'
      ],
      'Beverages': [
        'Orange_juice.jpg',
        'Coffee.jpg',
        'Sparkling_water.jpg'
      ],
      'Household': [
        'Laundry_detergent.jpg',
        'Dishwashing_liquid.jpg',
        'Paper_towels.jpg'
      ],
      'Personal Care': [
        'Shampoo.jpg',
        'Body_wash.jpg',
        'Toothpaste.jpg'
      ],
      'Frozen': [
        'Frozen_peas.jpg',
        'Frozen_pizza.jpg',
        'Ice_cream.jpg'
      ],
      'Ready Meals': [
        'Ready_meal.jpg',
        'Meal_prep.jpg',
        'Lunch_box.jpg'
      ]
    };

    const images = categoryImages[category];
    if (!images || images.length === 0) {
      return this.toWikimediaFilePath('Grocery_bag.jpg');
    }

    const index = Math.abs(seed) % images.length;
    return this.toWikimediaFilePath(images[index]);
  }

  private toWikimediaFilePath(fileName: string): string {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=640`;
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
