import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [
    // ==================== PICKLES ====================
    {
      id: 1,
      name: 'Andhra Mango Pickle (Avakaya)',
      description: 'Sun-cured mango pickle with mustard, sesame oil, and bold heat for authentic Andhra flavor.',
      price: 260,
      originalPrice: 320,
      image: '/assets/images/andhra-mango-pickle.jpg',
      category: 'Pickles',
      inStock: true,
      rating: 4.7,
      reviews: 1840,
      sku: 'PICKLE-MANGO-500G',
      specifications: {
        'Net Weight': '500 g',
        'Ingredients': 'Raw mango, mustard, sesame oil, chili',
        'Spice Level': 'Hot',
        'Shelf Life': '6 months',
        'Storage': 'Cool and dry, refrigerate after opening'
      }
    },
    {
      id: 2,
      name: 'Lemon Pickle (Nimmakaya)',
      description: 'Tangy lemon pickle balanced with aromatic spices and cold-pressed sesame oil.',
      price: 220,
      originalPrice: 280,
      image: '/assets/images/lemon-pickle.jpg',
      category: 'Pickles',
      inStock: true,
      rating: 4.6,
      reviews: 1205,
      sku: 'PICKLE-LEMON-500G',
      specifications: {
        'Net Weight': '500 g',
        'Ingredients': 'Lemon, salt, spices, sesame oil',
        'Spice Level': 'Medium',
        'Shelf Life': '6 months',
        'Storage': 'Cool and dry, refrigerate after opening'
      }
    },
    {
      id: 3,
      name: 'Gongura Pickle (Sorrel Leaf)',
      description: 'Traditional gongura pickle with slow-roasted spices for a deep, tangy finish.',
      price: 280,
      originalPrice: 340,
      image: '/assets/images/gongura-pickle.jpg',
      category: 'Pickles',
      inStock: true,
      rating: 4.8,
      reviews: 2100,
      sku: 'PICKLE-GONGURA-500G',
      specifications: {
        'Net Weight': '500 g',
        'Ingredients': 'Gongura leaves, chili, garlic, sesame oil',
        'Spice Level': 'Hot',
        'Shelf Life': '5 months',
        'Storage': 'Cool and dry, refrigerate after opening'
      }
    },
    {
      id: 4,
      name: 'Tomato Pickle',
      description: 'Rich tomato pickle simmered with jaggery and spices for a sweet-spicy balance.',
      price: 240,
      originalPrice: 300,
      image: '/assets/images/tomato-pickle.jpg',
      category: 'Pickles',
      inStock: true,
      rating: 4.5,
      reviews: 980,
      sku: 'PICKLE-TOMATO-500G',
      specifications: {
        'Net Weight': '500 g',
        'Ingredients': 'Tomato, chili, jaggery, sesame oil',
        'Spice Level': 'Medium',
        'Shelf Life': '5 months',
        'Storage': 'Cool and dry, refrigerate after opening'
      }
    },

    // ==================== SPICE POWDERS ====================
    {
      id: 5,
      name: 'Palli Chutney Powder',
      description: 'Roasted groundnut chutney powder with garlic and curry leaf for everyday meals.',
      price: 180,
      originalPrice: 220,
      image: '/assets/images/palli-podi.jpg',
      category: 'Spice Powders',
      inStock: true,
      rating: 4.6,
      reviews: 1460,
      sku: 'PODI-PALLI-250G',
      specifications: {
        'Net Weight': '250 g',
        'Key Ingredients': 'Groundnut, red chili, garlic',
        'Roast Level': 'Medium',
        'Shelf Life': '4 months',
        'Storage': 'Airtight container'
      }
    },
    {
      id: 6,
      name: 'Idli Podi (Garlic)',
      description: 'Stone-ground idli podi with garlic and lentils for quick, flavorful breakfasts.',
      price: 190,
      originalPrice: 230,
      image: '/assets/images/idli-podi.jpg',
      category: 'Spice Powders',
      inStock: true,
      rating: 4.7,
      reviews: 1625,
      sku: 'PODI-IDLI-250G',
      specifications: {
        'Net Weight': '250 g',
        'Key Ingredients': 'Lentils, chili, garlic, curry leaf',
        'Roast Level': 'Medium',
        'Shelf Life': '4 months',
        'Storage': 'Airtight container'
      }
    },
    {
      id: 7,
      name: 'Sambar Powder',
      description: 'Balanced sambar masala with coriander, cumin, and dry chilies for consistent flavor.',
      price: 160,
      originalPrice: 200,
      image: '/assets/images/sambar-powder.jpg',
      category: 'Spice Powders',
      inStock: true,
      rating: 4.5,
      reviews: 1180,
      sku: 'MASALA-SAMBAR-200G',
      specifications: {
        'Net Weight': '200 g',
        'Key Ingredients': 'Coriander, cumin, chili, fenugreek',
        'Roast Level': 'Light',
        'Shelf Life': '6 months',
        'Storage': 'Cool and dry'
      }
    },

    // ==================== SWEETS ====================
    {
      id: 8,
      name: 'Kaju Katli',
      description: 'Silky cashew fudge with delicate sweetness and a clean, nutty finish.',
      price: 450,
      originalPrice: 520,
      image: '/assets/images/kaju-katli.jpg',
      category: 'Sweets',
      inStock: true,
      rating: 4.8,
      reviews: 2010,
      sku: 'SWEET-KAJU-250G',
      specifications: {
        'Net Weight': '250 g',
        'Sweetener': 'Sugar',
        'Ghee': 'Pure cow ghee',
        'Shelf Life': '10 days',
        'Allergen Info': 'Contains nuts'
      }
    },
    {
      id: 9,
      name: 'Mysore Pak',
      description: 'Classic ghee-rich Mysore pak with a melt-in-mouth texture.',
      price: 320,
      originalPrice: 380,
      image: '/assets/images/mysore-pak.jpg',
      category: 'Sweets',
      inStock: true,
      rating: 4.7,
      reviews: 1450,
      sku: 'SWEET-MYSORE-300G',
      specifications: {
        'Net Weight': '300 g',
        'Sweetener': 'Sugar',
        'Ghee': 'Pure cow ghee',
        'Shelf Life': '8 days',
        'Allergen Info': 'Contains dairy'
      }
    },
    {
      id: 10,
      name: 'Gulab Jamun (Dry)',
      description: 'Soft khoya-based gulab jamun, lightly glazed for easy gifting.',
      price: 280,
      originalPrice: 340,
      image: '/assets/images/gulab-jamun.jpg',
      category: 'Sweets',
      inStock: true,
      rating: 4.6,
      reviews: 990,
      sku: 'SWEET-GJ-250G',
      specifications: {
        'Net Weight': '250 g',
        'Sweetener': 'Sugar',
        'Ghee': 'Vegetable ghee',
        'Shelf Life': '7 days',
        'Allergen Info': 'Contains dairy, wheat'
      }
    },
    {
      id: 11,
      name: 'Boondi Laddu',
      description: 'Golden boondi laddu with cardamom and ghee, festive and fragrant.',
      price: 260,
      originalPrice: 310,
      image: '/assets/images/boondi-laddu.jpg',
      category: 'Sweets',
      inStock: true,
      rating: 4.5,
      reviews: 860,
      sku: 'SWEET-BOONDI-300G',
      specifications: {
        'Net Weight': '300 g',
        'Sweetener': 'Sugar',
        'Ghee': 'Pure cow ghee',
        'Shelf Life': '9 days',
        'Allergen Info': 'Contains dairy, gram flour'
      }
    },
    {
      id: 12,
      name: 'Bellam Pootharekulu',
      description: 'Paper-thin rice sheets filled with jaggery and ghee for a traditional finish.',
      price: 360,
      originalPrice: 420,
      image: '/assets/images/pootharekulu.jpg',
      category: 'Sweets',
      inStock: true,
      rating: 4.7,
      reviews: 720,
      sku: 'SWEET-POOTHA-250G',
      specifications: {
        'Net Weight': '250 g',
        'Sweetener': 'Jaggery',
        'Ghee': 'Pure cow ghee',
        'Shelf Life': '8 days',
        'Allergen Info': 'Contains dairy'
      }
    },

    // ==================== SAVORIES ====================
    {
      id: 13,
      name: 'Butter Murukku',
      description: 'Crisp, light murukku with buttery notes and a clean crunch.',
      price: 180,
      originalPrice: 220,
      image: '/assets/images/murukku.jpg',
      category: 'Savories',
      inStock: true,
      rating: 4.6,
      reviews: 1100,
      sku: 'SAV-MURUKKU-250G',
      specifications: {
        'Net Weight': '250 g',
        'Oil Used': 'Groundnut oil',
        'Spice Level': 'Mild',
        'Shelf Life': '45 days',
        'Storage': 'Airtight container'
      }
    },
    {
      id: 14,
      name: 'Nellore Chekkalu',
      description: 'Rice crisps with sesame and chili for a bold, crunchy snack.',
      price: 200,
      originalPrice: 240,
      image: '/assets/images/chekkalu.jpg',
      category: 'Savories',
      inStock: true,
      rating: 4.7,
      reviews: 980,
      sku: 'SAV-CHEKKALU-250G',
      specifications: {
        'Net Weight': '250 g',
        'Oil Used': 'Sunflower oil',
        'Spice Level': 'Medium',
        'Shelf Life': '45 days',
        'Storage': 'Airtight container'
      }
    },
    {
      id: 15,
      name: 'Spicy Mixture',
      description: 'South Indian mixture with lentils, peanuts, and spice-coated flakes.',
      price: 190,
      originalPrice: 230,
      image: '/assets/images/mixture.jpg',
      category: 'Savories',
      inStock: true,
      rating: 4.5,
      reviews: 1040,
      sku: 'SAV-MIXTURE-250G',
      specifications: {
        'Net Weight': '250 g',
        'Oil Used': 'Refined oil',
        'Spice Level': 'Medium',
        'Shelf Life': '45 days',
        'Storage': 'Airtight container'
      }
    },

    // ==================== SNACKS ====================
    {
      id: 16,
      name: 'Kerala Banana Chips',
      description: 'Thin-sliced banana chips fried in coconut oil for a clean, crisp bite.',
      price: 170,
      originalPrice: 210,
      image: '/assets/images/banana-chips.jpg',
      category: 'Snacks',
      inStock: true,
      rating: 4.6,
      reviews: 1320,
      sku: 'SNACK-BANANA-200G',
      specifications: {
        'Net Weight': '200 g',
        'Oil Used': 'Coconut oil',
        'Spice Level': 'Mild',
        'Shelf Life': '60 days',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 17,
      name: 'Masala Peanuts',
      description: 'Roasted peanuts with bold masala coating and a crunchy finish.',
      price: 160,
      originalPrice: 200,
      image: '/assets/images/masala-peanuts.jpg',
      category: 'Snacks',
      inStock: true,
      rating: 4.5,
      reviews: 940,
      sku: 'SNACK-PEANUT-200G',
      specifications: {
        'Net Weight': '200 g',
        'Oil Used': 'Refined oil',
        'Spice Level': 'Medium',
        'Shelf Life': '60 days',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 18,
      name: 'Jowar Puffs',
      description: 'Lightly salted jowar puffs for a clean, crunchy snack.',
      price: 150,
      originalPrice: 180,
      image: '/assets/images/jowar-puffs.jpg',
      category: 'Snacks',
      inStock: true,
      rating: 4.4,
      reviews: 710,
      sku: 'SNACK-JOWAR-150G',
      specifications: {
        'Net Weight': '150 g',
        'Oil Used': 'No added oil',
        'Spice Level': 'Mild',
        'Shelf Life': '60 days',
        'Storage': 'Airtight container'
      }
    },

    // ==================== READY MIXES ====================
    {
      id: 19,
      name: 'Ragi Dosa Mix',
      description: 'Stone-ground ragi dosa mix with quick fermentation and consistent texture.',
      price: 210,
      originalPrice: 260,
      image: '/assets/images/ragi-dosa-mix.jpg',
      category: 'Ready Mixes',
      inStock: true,
      rating: 4.6,
      reviews: 860,
      sku: 'MIX-RAGI-DOSA-500G',
      specifications: {
        'Net Weight': '500 g',
        'Preparation Time': '15 minutes',
        'Servings': '10 to 12 dosas',
        'Shelf Life': '6 months',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 20,
      name: 'Classic Upma Mix',
      description: 'Roasted semolina upma mix with balanced spices for quick breakfasts.',
      price: 120,
      originalPrice: 150,
      image: '/assets/images/upma-mix.jpg',
      category: 'Ready Mixes',
      inStock: true,
      rating: 4.4,
      reviews: 690,
      sku: 'MIX-UPMA-400G',
      specifications: {
        'Net Weight': '400 g',
        'Preparation Time': '10 minutes',
        'Servings': '6 to 8 bowls',
        'Shelf Life': '6 months',
        'Storage': 'Cool and dry'
      }
    },

    // ==================== PAPADS & FRYUMS ====================
    {
      id: 21,
      name: 'Appalam Papad',
      description: 'Thin, crisp appalam papad with traditional seasoning.',
      price: 140,
      originalPrice: 170,
      image: '/assets/images/papad.jpg',
      category: 'Papads & Fryums',
      inStock: true,
      rating: 4.5,
      reviews: 620,
      sku: 'PAPAD-APPALAM-200G',
      specifications: {
        'Net Weight': '200 g',
        'Ingredients': 'Urad dal, spices',
        'Shelf Life': '8 months',
        'Storage': 'Cool and dry',
        'Cooking': 'Roast or fry'
      }
    },
    {
      id: 22,
      name: 'Potato Fryums',
      description: 'Colorful fryums that puff evenly and stay crisp.',
      price: 120,
      originalPrice: 150,
      image: '/assets/images/fryums.jpg',
      category: 'Papads & Fryums',
      inStock: true,
      rating: 4.4,
      reviews: 540,
      sku: 'FRYUMS-POTATO-200G',
      specifications: {
        'Net Weight': '200 g',
        'Ingredients': 'Potato, starch, spices',
        'Shelf Life': '8 months',
        'Storage': 'Cool and dry',
        'Cooking': 'Deep fry'
      }
    },

    // ==================== OILS & GHEE ====================
    {
      id: 23,
      name: 'Cold Pressed Groundnut Oil',
      description: 'Small-batch groundnut oil with a clean aroma for daily cooking.',
      price: 620,
      originalPrice: 690,
      image: '/assets/images/groundnut-oil.jpg',
      category: 'Oils & Ghee',
      inStock: true,
      rating: 4.7,
      reviews: 430,
      sku: 'OIL-GN-1L',
      specifications: {
        'Volume': '1 L',
        'Processing': 'Cold pressed',
        'Aroma': 'Nutty',
        'Shelf Life': '9 months',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 24,
      name: 'Desi Ghee',
      description: 'Slow-churned ghee with a rich aroma and golden finish.',
      price: 690,
      originalPrice: 760,
      image: '/assets/images/desi-ghee.jpg',
      category: 'Oils & Ghee',
      inStock: true,
      rating: 4.8,
      reviews: 520,
      sku: 'GHEE-DESI-500ML',
      specifications: {
        'Volume': '500 ml',
        'Processing': 'Traditional churned',
        'Aroma': 'Rich and buttery',
        'Shelf Life': '9 months',
        'Storage': 'Cool and dry'
      }
    },

    // ==================== BEVERAGES ====================
    {
      id: 25,
      name: 'Filter Coffee Powder',
      description: 'Medium roast coffee blend with chicory for a classic South Indian cup.',
      price: 240,
      originalPrice: 280,
      image: '/assets/images/filter-coffee.jpg',
      category: 'Beverages',
      inStock: true,
      rating: 4.6,
      reviews: 880,
      sku: 'BEV-COFFEE-250G',
      specifications: {
        'Net Weight': '250 g',
        'Roast': 'Medium',
        'Caffeine': 'Regular',
        'Shelf Life': '9 months',
        'Storage': 'Airtight container'
      }
    },
    {
      id: 26,
      name: 'Masala Tea Blend',
      description: 'Assam tea with warming spices for a bold, aromatic cup.',
      price: 220,
      originalPrice: 260,
      image: '/assets/images/masala-tea.jpg',
      category: 'Beverages',
      inStock: true,
      rating: 4.5,
      reviews: 760,
      sku: 'BEV-TEA-250G',
      specifications: {
        'Net Weight': '250 g',
        'Roast': 'Strong',
        'Caffeine': 'Regular',
        'Shelf Life': '9 months',
        'Storage': 'Airtight container'
      }
    },

    // ==================== HEALTH & HERBAL ====================
    {
      id: 27,
      name: 'Herbal Kashaya Mix',
      description: 'Traditional herbal blend with dry ginger, pepper, and tulsi.',
      price: 260,
      originalPrice: 310,
      image: '/assets/images/kashaya-mix.jpg',
      category: 'Health & Herbal',
      inStock: true,
      rating: 4.6,
      reviews: 520,
      sku: 'HERBAL-KASHAYA-200G',
      specifications: {
        'Net Weight': '200 g',
        'Usage': '1 tsp per cup',
        'Key Herbs': 'Ginger, pepper, tulsi',
        'Shelf Life': '10 months',
        'Storage': 'Cool and dry'
      }
    },
    {
      id: 28,
      name: 'Turmeric Latte Mix',
      description: 'Golden milk mix with turmeric, cinnamon, and black pepper.',
      price: 240,
      originalPrice: 290,
      image: '/assets/images/turmeric-latte.jpg',
      category: 'Health & Herbal',
      inStock: true,
      rating: 4.5,
      reviews: 610,
      sku: 'HERBAL-TURMERIC-200G',
      specifications: {
        'Net Weight': '200 g',
        'Usage': '1 tsp per cup',
        'Key Herbs': 'Turmeric, cinnamon, pepper',
        'Shelf Life': '10 months',
        'Storage': 'Cool and dry'
      }
    }
  ];

  constructor() {
    this.assignImageUrls();
    this.ensureMinimumProducts(1000);
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
      'Pickles',
      'Sweets',
      'Savories',
      'Snacks',
      'Spice Powders',
      'Ready Mixes',
      'Papads & Fryums',
      'Oils & Ghee',
      'Beverages',
      'Health & Herbal'
    ];

    const brands = [
      'Nandini',
      'Aroma',
      'Sahaja',
      'Homestead',
      'Sattva',
      'Grandmas',
      'Heritage',
      'Namma',
      'Kitchenly',
      'Sakhi',
      'FarmCraft',
      'PureRoots',
      'Veda',
      'Annapurna',
      'Sundar',
      'Roots',
      'Harvest',
      'Saffron',
      'Freshly',
      'Krishi'
    ];

    const categorySpecs: Record<string, { [key: string]: string }> = {
      'Pickles': {
        'Net Weight': '500 g',
        'Ingredients': 'Fruits, spices, sesame oil',
        'Spice Level': 'Medium',
        'Shelf Life': '6 months'
      },
      'Sweets': {
        'Net Weight': '250 g',
        'Sweetener': 'Sugar or jaggery',
        'Ghee': 'Pure cow ghee',
        'Shelf Life': '10 days'
      },
      'Savories': {
        'Net Weight': '250 g',
        'Oil Used': 'Refined oil',
        'Spice Level': 'Medium',
        'Shelf Life': '45 days'
      },
      'Snacks': {
        'Net Weight': '200 g',
        'Oil Used': 'Refined oil',
        'Spice Level': 'Mild',
        'Shelf Life': '60 days'
      },
      'Spice Powders': {
        'Net Weight': '200 g',
        'Key Ingredients': 'Roasted spices',
        'Roast Level': 'Medium',
        'Shelf Life': '6 months'
      },
      'Ready Mixes': {
        'Net Weight': '500 g',
        'Preparation Time': '10 minutes',
        'Servings': '6 to 8',
        'Shelf Life': '6 months'
      },
      'Papads & Fryums': {
        'Net Weight': '200 g',
        'Ingredients': 'Urad dal, spices',
        'Shelf Life': '8 months',
        'Cooking': 'Roast or fry'
      },
      'Oils & Ghee': {
        'Volume': '1 L',
        'Processing': 'Cold pressed',
        'Aroma': 'Rich and nutty',
        'Shelf Life': '9 months'
      },
      'Beverages': {
        'Net Weight': '250 g',
        'Roast': 'Medium',
        'Caffeine': 'Regular',
        'Shelf Life': '9 months'
      },
      'Health & Herbal': {
        'Net Weight': '200 g',
        'Usage': '1 tsp per cup',
        'Key Herbs': 'Turmeric, ginger, tulsi',
        'Shelf Life': '10 months'
      }
    };

    let nextId = Math.max(...this.products.map(p => p.id)) + 1;
    let index = 0;

    while (this.products.length < minCount) {
      const category = categories[index % categories.length];
      const brand = brands[index % brands.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = 499 + (index * 37) % 45000;
      const isDiscounted = index % 3 === 0;
      const price = basePrice + (category.length * 25);
      const originalPrice = isDiscounted ? price + Math.round(price * 0.2) : undefined;
      const rating = Math.min(5, 3.8 + (index % 13) * 0.1);
      const reviews = 50 + (index * 13) % 6000;
      const inStock = index % 7 !== 0;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const id = nextId++;

      this.products.push({
        id,
        name: `${brand} ${category} ${modelNumber}`,
        description: `Small-batch ${category.toLowerCase()} from ${brand} with fresh ingredients and consistent taste.`,
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
      'Pickles': [
        'Indian_pickles.jpg',
        'Mango_pickle.jpg',
        'Lemon_pickle.jpg'
      ],
      'Sweets': [
        'Kaju_katli.jpg',
        'Gulab_jamun.jpg',
        'Laddu.jpg'
      ],
      'Savories': [
        'Murukku.jpg',
        'Chekkalu.jpg',
        'Mixture_(snack).jpg'
      ],
      'Snacks': [
        'Banana_chips.jpg',
        'Roasted_peanuts.jpg',
        'Snack_mix.jpg'
      ],
      'Spice Powders': [
        'Sambar_powder.jpg',
        'Chutney_powder.jpg',
        'Spice_powder.jpg'
      ],
      'Ready Mixes': [
        'Dosa.jpg',
        'Upma.jpg',
        'Idli.jpg'
      ],
      'Papads & Fryums': [
        'Papad.jpg',
        'Appalam.jpg',
        'Fryums.jpg'
      ],
      'Oils & Ghee': [
        'Ghee.jpg',
        'Groundnut_oil.jpg',
        'Oil_bottle.jpg'
      ],
      'Beverages': [
        'Filter_coffee.jpg',
        'Masala_tea.jpg',
        'Coffee_beans.jpg'
      ],
      'Health & Herbal': [
        'Turmeric_milk.jpg',
        'Herbal_tea.jpg',
        'Tulsi.jpg'
      ]
    };

    const images = categoryImages[category];
    if (!images || images.length === 0) {
      return this.toWikimediaFilePath('Electronics.jpg');
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


