import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PharmaProduct } from '../models/pharma-product.model';

@Injectable({ providedIn: 'root' })
export class PharmaProductsService {
  private products: PharmaProduct[] = [
    {
      id: 1,
      name: 'MediSure Paracetamol 500 mg Tablets',
      description: 'Everyday pain relief and fever support for adults.',
      price: 68,
      originalPrice: 82,
      image: '',
      category: 'Pain Relief',
      inStock: true,
      rating: 4.6,
      reviews: 1840,
      sku: 'MS-PARA-500-10',
      manufacturer: 'MediSure',
      pack: '10 tablets',
      prescriptionRequired: false,
      specifications: {
        Strength: '500 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 2,
      name: 'MediSure Ibuprofen 400 mg Tablets',
      description: 'Fast-acting relief for inflammation and muscle pain.',
      price: 92,
      originalPrice: 110,
      image: '',
      category: 'Pain Relief',
      inStock: true,
      rating: 4.5,
      reviews: 1260,
      sku: 'MS-IBU-400-10',
      manufacturer: 'MediSure',
      pack: '10 tablets',
      prescriptionRequired: false,
      specifications: {
        Strength: '400 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Room temperature'
      }
    },
    {
      id: 3,
      name: 'ClearBreathe Cetirizine 10 mg Tablets',
      description: '24-hour non-drowsy allergy support.',
      price: 54,
      originalPrice: 68,
      image: '',
      category: 'Respiratory & Allergy',
      inStock: true,
      rating: 4.4,
      reviews: 980,
      sku: 'CB-CET-10-10',
      manufacturer: 'ClearBreathe',
      pack: '10 tablets',
      prescriptionRequired: false,
      specifications: {
        Strength: '10 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 4,
      name: 'ClearBreathe Saline Nasal Spray 30 ml',
      description: 'Gentle saline spray for daily nasal care.',
      price: 110,
      originalPrice: 135,
      image: '',
      category: 'Respiratory & Allergy',
      inStock: true,
      rating: 4.3,
      reviews: 640,
      sku: 'CB-SAL-30ML',
      manufacturer: 'ClearBreathe',
      pack: '30 ml',
      prescriptionRequired: false,
      specifications: {
        Strength: '0.9% saline',
        Form: 'Spray',
        Pack: '30 ml',
        Storage: 'Room temperature'
      }
    },
    {
      id: 5,
      name: 'GastroEase Omeprazole 20 mg Capsules',
      description: 'Proton pump inhibitor for acidity and GERD.',
      price: 128,
      originalPrice: 155,
      image: '',
      category: 'Gastro & Liver',
      inStock: true,
      rating: 4.6,
      reviews: 1120,
      sku: 'GE-OME-20-10',
      manufacturer: 'GastroEase',
      pack: '10 capsules',
      prescriptionRequired: true,
      specifications: {
        Strength: '20 mg',
        Form: 'Capsule',
        Pack: '10 capsules',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 6,
      name: 'GastroEase ORS Orange 200 ml',
      description: 'Electrolyte support for rapid hydration.',
      price: 45,
      originalPrice: 52,
      image: '',
      category: 'OTC Essentials',
      inStock: true,
      rating: 4.2,
      reviews: 760,
      sku: 'GE-ORS-200',
      manufacturer: 'GastroEase',
      pack: '200 ml',
      prescriptionRequired: false,
      specifications: {
        Flavor: 'Orange',
        Form: 'Solution',
        Pack: '200 ml',
        Storage: 'Refrigerate after opening'
      }
    },
    {
      id: 7,
      name: 'AntiBio Amoxicillin 500 mg Capsules',
      description: 'Broad-spectrum antibiotic for bacterial infections.',
      price: 168,
      originalPrice: 200,
      image: '',
      category: 'Antibiotics',
      inStock: true,
      rating: 4.7,
      reviews: 540,
      sku: 'AB-AMOX-500-10',
      manufacturer: 'AntiBio',
      pack: '10 capsules',
      prescriptionRequired: true,
      specifications: {
        Strength: '500 mg',
        Form: 'Capsule',
        Pack: '10 capsules',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 8,
      name: 'AntiBio Azithromycin 250 mg Tablets',
      description: 'Macrolide antibiotic for respiratory infections.',
      price: 190,
      originalPrice: 230,
      image: '',
      category: 'Antibiotics',
      inStock: false,
      rating: 4.6,
      reviews: 420,
      sku: 'AB-AZI-250-6',
      manufacturer: 'AntiBio',
      pack: '6 tablets',
      prescriptionRequired: true,
      specifications: {
        Strength: '250 mg',
        Form: 'Tablet',
        Pack: '6 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 9,
      name: 'GlucoTrack Metformin 500 mg Tablets',
      description: 'First-line therapy for type 2 diabetes.',
      price: 120,
      originalPrice: 145,
      image: '',
      category: 'Diabetes Care',
      inStock: true,
      rating: 4.5,
      reviews: 980,
      sku: 'GT-MET-500-15',
      manufacturer: 'GlucoTrack',
      pack: '15 tablets',
      prescriptionRequired: true,
      specifications: {
        Strength: '500 mg',
        Form: 'Tablet',
        Pack: '15 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 10,
      name: 'GlucoTrack Glucometer Strips 50s',
      description: 'Accurate blood glucose testing strips.',
      price: 560,
      originalPrice: 620,
      image: '',
      category: 'Diabetes Care',
      inStock: true,
      rating: 4.4,
      reviews: 380,
      sku: 'GT-STRIP-50',
      manufacturer: 'GlucoTrack',
      pack: '50 strips',
      prescriptionRequired: false,
      specifications: {
        Compatibility: 'GlucoTrack meters',
        Pack: '50 strips',
        'Shelf life': '18 months'
      }
    },
    {
      id: 11,
      name: 'CardioPlus Amlodipine 5 mg Tablets',
      description: 'Calcium channel blocker for blood pressure.',
      price: 96,
      originalPrice: 118,
      image: '',
      category: 'Cardio & BP',
      inStock: true,
      rating: 4.3,
      reviews: 540,
      sku: 'CP-AMLO-5-10',
      manufacturer: 'CardioPlus',
      pack: '10 tablets',
      prescriptionRequired: true,
      specifications: {
        Strength: '5 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 12,
      name: 'CardioPlus Atorvastatin 10 mg Tablets',
      description: 'Lipid-lowering therapy for cholesterol control.',
      price: 138,
      originalPrice: 165,
      image: '',
      category: 'Cardio & BP',
      inStock: true,
      rating: 4.4,
      reviews: 480,
      sku: 'CP-ATOR-10-10',
      manufacturer: 'CardioPlus',
      pack: '10 tablets',
      prescriptionRequired: true,
      specifications: {
        Strength: '10 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 13,
      name: 'VitaMax Vitamin C 1000 mg Tablets',
      description: 'Daily immune support with sustained release.',
      price: 210,
      originalPrice: 240,
      image: '',
      category: 'Vitamins & Nutrition',
      inStock: true,
      rating: 4.7,
      reviews: 2200,
      sku: 'VM-VITC-1000',
      manufacturer: 'VitaMax',
      pack: '30 tablets',
      prescriptionRequired: false,
      specifications: {
        Strength: '1000 mg',
        Form: 'Tablet',
        Pack: '30 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 14,
      name: 'VitaMax Multivitamin Capsules 60s',
      description: 'Balanced nutrients for daily wellness.',
      price: 420,
      originalPrice: 480,
      image: '',
      category: 'Vitamins & Nutrition',
      inStock: true,
      rating: 4.6,
      reviews: 1560,
      sku: 'VM-MULTI-60',
      manufacturer: 'VitaMax',
      pack: '60 capsules',
      prescriptionRequired: false,
      specifications: {
        Form: 'Capsule',
        Pack: '60 capsules',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 15,
      name: 'DermaCare Clotrimazole Cream 15 g',
      description: 'Antifungal cream for skin infections.',
      price: 78,
      originalPrice: 95,
      image: '',
      category: 'Dermatology',
      inStock: true,
      rating: 4.2,
      reviews: 520,
      sku: 'DC-CLOTR-15',
      manufacturer: 'DermaCare',
      pack: '15 g',
      prescriptionRequired: false,
      specifications: {
        Strength: '1% w/w',
        Form: 'Cream',
        Pack: '15 g',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 16,
      name: 'DermaCare Sunscreen SPF 50 50 g',
      description: 'Broad-spectrum sun protection for daily use.',
      price: 340,
      originalPrice: 399,
      image: '',
      category: 'Dermatology',
      inStock: true,
      rating: 4.5,
      reviews: 910,
      sku: 'DC-SPF50-50',
      manufacturer: 'DermaCare',
      pack: '50 g',
      prescriptionRequired: false,
      specifications: {
        SPF: '50',
        Form: 'Lotion',
        Pack: '50 g',
        'Water resistant': 'Yes'
      }
    },
    {
      id: 17,
      name: 'FemmeCare Iron + Folic Acid Tablets',
      description: 'Iron support for women and prenatal care.',
      price: 120,
      originalPrice: 145,
      image: '',
      category: "Women's Health",
      inStock: true,
      rating: 4.4,
      reviews: 720,
      sku: 'FC-IFA-30',
      manufacturer: 'FemmeCare',
      pack: '30 tablets',
      prescriptionRequired: false,
      specifications: {
        Form: 'Tablet',
        Pack: '30 tablets',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 18,
      name: 'FemmeCare Pregnancy Test Kit',
      description: 'Accurate home pregnancy test in 5 minutes.',
      price: 85,
      originalPrice: 99,
      image: '',
      category: "Women's Health",
      inStock: true,
      rating: 4.1,
      reviews: 640,
      sku: 'FC-TEST-1',
      manufacturer: 'FemmeCare',
      pack: '1 test',
      prescriptionRequired: false,
      specifications: {
        'Result time': '5 minutes',
        Pack: '1 test',
        'Shelf life': '24 months'
      }
    },
    {
      id: 19,
      name: 'BabyBloom Diaper Rash Cream 50 g',
      description: 'Gentle zinc oxide protection for babies.',
      price: 140,
      originalPrice: 165,
      image: '',
      category: 'Baby & Mother',
      inStock: true,
      rating: 4.6,
      reviews: 860,
      sku: 'BB-RASH-50',
      manufacturer: 'BabyBloom',
      pack: '50 g',
      prescriptionRequired: false,
      specifications: {
        Form: 'Cream',
        Pack: '50 g',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 20,
      name: 'BabyBloom Infant Formula Stage 1 400 g',
      description: 'Complete nutrition for 0-6 months.',
      price: 720,
      originalPrice: 799,
      image: '',
      category: 'Baby & Mother',
      inStock: true,
      rating: 4.3,
      reviews: 540,
      sku: 'BB-FORM-400',
      manufacturer: 'BabyBloom',
      pack: '400 g',
      prescriptionRequired: false,
      specifications: {
        Stage: '0-6 months',
        Pack: '400 g',
        Storage: 'Cool and dry'
      }
    },
    {
      id: 21,
      name: 'FirstAid Elastic Bandage 4 inch',
      description: 'Reusable elastic bandage for sprains.',
      price: 60,
      originalPrice: 75,
      image: '',
      category: 'First Aid & Devices',
      inStock: true,
      rating: 4.2,
      reviews: 480,
      sku: 'FA-BAND-4',
      manufacturer: 'FirstAid',
      pack: '1 roll',
      prescriptionRequired: false,
      specifications: {
        Size: '4 inch',
        Pack: '1 roll',
        Material: 'Elastic'
      }
    },
    {
      id: 22,
      name: 'FirstAid Digital Thermometer',
      description: 'Fast and accurate temperature readings.',
      price: 210,
      originalPrice: 240,
      image: '',
      category: 'First Aid & Devices',
      inStock: true,
      rating: 4.4,
      reviews: 760,
      sku: 'FA-THERMO-1',
      manufacturer: 'FirstAid',
      pack: '1 unit',
      prescriptionRequired: false,
      specifications: {
        Accuracy: '+/- 0.1 C',
        Pack: '1 unit',
        Battery: 'Included'
      }
    },
    {
      id: 23,
      name: 'OTC Shield Antiseptic Liquid 100 ml',
      description: 'Everyday antiseptic for first aid use.',
      price: 58,
      originalPrice: 70,
      image: '',
      category: 'OTC Essentials',
      inStock: true,
      rating: 4.3,
      reviews: 690,
      sku: 'OTC-ANTI-100',
      manufacturer: 'OTC Shield',
      pack: '100 ml',
      prescriptionRequired: false,
      specifications: {
        Form: 'Liquid',
        Pack: '100 ml',
        Usage: 'Topical'
      }
    },
    {
      id: 24,
      name: 'OTC Shield Loperamide 2 mg Tablets',
      description: 'Quick relief for acute diarrhea.',
      price: 46,
      originalPrice: 58,
      image: '',
      category: 'Gastro & Liver',
      inStock: true,
      rating: 4.1,
      reviews: 420,
      sku: 'OTC-LOP-2-10',
      manufacturer: 'OTC Shield',
      pack: '10 tablets',
      prescriptionRequired: false,
      specifications: {
        Strength: '2 mg',
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry'
      }
    }
  ];

  constructor() {
    this.assignImageUrls();
    this.ensureMinimumProducts(420);
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
      'Pain Relief',
      'Respiratory & Allergy',
      'Gastro & Liver',
      'Antibiotics',
      'Diabetes Care',
      'Cardio & BP',
      'Vitamins & Nutrition',
      'Dermatology',
      "Women's Health",
      'Baby & Mother',
      'First Aid & Devices',
      'OTC Essentials'
    ];

    const brands = [
      'MediSure',
      'ClearBreathe',
      'GastroEase',
      'AntiBio',
      'GlucoTrack',
      'CardioPlus',
      'VitaMax',
      'DermaCare',
      'FemmeCare',
      'BabyBloom',
      'FirstAid',
      'OTC Shield',
      'WellnessCo',
      'HealFast'
    ];

    const categoryProducts: Record<string, string[]> = {
      'Pain Relief': ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Naproxen'],
      'Respiratory & Allergy': ['Cetirizine', 'Montelukast', 'Cough Syrup', 'Saline Spray'],
      'Gastro & Liver': ['Pantoprazole', 'Omeprazole', 'Antacid', 'Probiotic'],
      'Antibiotics': ['Amoxicillin', 'Azithromycin', 'Cefixime', 'Doxycycline'],
      'Diabetes Care': ['Metformin', 'Glimepiride', 'Test Strips', 'Insulin Pen'],
      'Cardio & BP': ['Amlodipine', 'Atorvastatin', 'Losartan', 'Metoprolol'],
      'Vitamins & Nutrition': ['Vitamin C', 'Multivitamin', 'Calcium + D3', 'Omega 3'],
      'Dermatology': ['Clotrimazole', 'Hydrocortisone', 'Moisturizer', 'Sunscreen'],
      "Women's Health": ['Iron + Folic', 'Prenatal', 'UTI Care', 'Calcium Support'],
      'Baby & Mother': ['Infant Formula', 'Diaper Cream', 'Baby Lotion', 'Feeding Bottle'],
      'First Aid & Devices': ['Thermometer', 'Elastic Bandage', 'Gauze Pads', 'Antiseptic Wipes'],
      'OTC Essentials': ['ORS', 'Antiseptic', 'Pain Balm', 'Cough Drops']
    };

    const forms = ['Tablets', 'Capsules', 'Syrup', 'Cream', 'Drops', 'Spray'];
    const strengths = ['250 mg', '500 mg', '10 mg', '20 mg', '5 mg', '100 ml', '60 ml', '30 ml'];
    const packs = ['10 tablets', '15 tablets', '20 tablets', '10 capsules', '100 ml', '60 ml', '30 ml', '1 unit', '50 g'];

    const categorySpecs: Record<string, Record<string, string>> = {
      'Pain Relief': {
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry',
        Usage: 'As directed'
      },
      'Respiratory & Allergy': {
        Form: 'Tablet/Syrup',
        Pack: '10 tablets',
        Storage: 'Cool and dry',
        Usage: 'Daily'
      },
      'Gastro & Liver': {
        Form: 'Capsule',
        Pack: '10 capsules',
        Storage: 'Cool and dry',
        Usage: 'Before meals'
      },
      'Antibiotics': {
        Form: 'Tablet/Capsule',
        Pack: '6-10 tablets',
        Storage: 'Cool and dry',
        Usage: 'Prescription'
      },
      'Diabetes Care': {
        Form: 'Tablet/Device',
        Pack: '15 tablets',
        Storage: 'Room temperature',
        Usage: 'Daily'
      },
      'Cardio & BP': {
        Form: 'Tablet',
        Pack: '10 tablets',
        Storage: 'Cool and dry',
        Usage: 'Daily'
      },
      'Vitamins & Nutrition': {
        Form: 'Tablet/Capsule',
        Pack: '30 tablets',
        Storage: 'Cool and dry',
        Usage: 'Daily'
      },
      'Dermatology': {
        Form: 'Cream/Lotion',
        Pack: '30 g',
        Storage: 'Cool and dry',
        Usage: 'Topical'
      },
      "Women's Health": {
        Form: 'Tablet/Kit',
        Pack: '30 tablets',
        Storage: 'Cool and dry',
        Usage: 'Daily'
      },
      'Baby & Mother': {
        Form: 'Powder/Cream',
        Pack: '400 g',
        Storage: 'Cool and dry',
        Usage: 'Daily'
      },
      'First Aid & Devices': {
        Form: 'Device',
        Pack: '1 unit',
        Storage: 'Room temperature',
        Usage: 'As needed'
      },
      'OTC Essentials': {
        Form: 'Liquid/Tablet',
        Pack: '100 ml',
        Storage: 'Cool and dry',
        Usage: 'As needed'
      }
    };

    const rxCategories = new Set(['Antibiotics', 'Cardio & BP', 'Diabetes Care', 'Gastro & Liver']);

    let nextId = Math.max(...this.products.map(product => product.id)) + 1;
    let index = 0;

    while (this.products.length < minCount) {
      const category = categories[index % categories.length];
      const brand = brands[index % brands.length];
      const baseNameOptions = categoryProducts[category] ?? ['Pharma Care'];
      const baseName = baseNameOptions[index % baseNameOptions.length];
      const strength = strengths[index % strengths.length];
      const form = forms[index % forms.length];
      const pack = packs[index % packs.length];
      const modelNumber = (index + 1).toString().padStart(4, '0');

      const basePrice = 55 + (index * 13) % 520;
      const isDiscounted = index % 3 === 0;
      const price = basePrice + category.length * 2;
      const originalPrice = isDiscounted ? price + Math.round(price * 0.18) : undefined;
      const rating = Math.min(5, 3.9 + (index % 10) * 0.1);
      const reviews = 60 + (index * 17) % 8200;
      const inStock = index % 7 !== 0;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const id = nextId++;

      this.products.push({
        id,
        name: `${brand} ${baseName} ${strength}`,
        description: `Trusted ${category.toLowerCase()} support from ${brand} with batch-level tracking.`,
        price,
        originalPrice,
        image: this.buildImageUrl(category, id),
        category,
        inStock,
        rating,
        reviews,
        sku: `${brand.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${categoryKey}-${modelNumber}`,
        manufacturer: brand,
        pack,
        prescriptionRequired: rxCategories.has(category),
        specifications: categorySpecs[category]
      });

      index += 1;
    }
  }

  private buildImageUrl(category: string, seed: number): string {
    const categoryImages: Record<string, string[]> = {
      'Pain Relief': ['Aspirin_tablets.jpg', 'Pill_bottle.jpg', 'Tablets.jpg'],
      'Respiratory & Allergy': ['Inhaler.jpg', 'Nasal_spray.jpg', 'Cough_syrup.jpg'],
      'Gastro & Liver': ['Antacid_tablets.jpg', 'Medicine_bottle.jpg', 'Capsule.jpg'],
      'Antibiotics': ['Capsule.jpg', 'Medicine_bottle.jpg', 'Pill_bottle.jpg'],
      'Diabetes Care': ['Blood_glucose_meter.jpg', 'Insulin_syringe.jpg', 'Glucometer.jpg'],
      'Cardio & BP': ['Heart_medication.jpg', 'Tablets.jpg', 'Pill_bottle.jpg'],
      'Vitamins & Nutrition': ['Vitamin_C.jpg', 'Multivitamin.jpg', 'Capsule.jpg'],
      'Dermatology': ['Skin_cream.jpg', 'Ointment.jpg', 'Tube_of_cream.jpg'],
      "Women's Health": ['Pregnancy_test.jpg', 'Prenatal_vitamins.jpg', 'Hormone_pills.jpg'],
      'Baby & Mother': ['Baby_formula.jpg', 'Baby_lotion.jpg', 'Baby_cream.jpg'],
      'First Aid & Devices': ['Bandage.jpg', 'Thermometer.jpg', 'Medical_gloves.jpg'],
      'OTC Essentials': ['Antiseptic.jpg', 'First_aid_kit.jpg', 'Pill_bottle.jpg']
    };

    const images = categoryImages[category];
    if (!images || images.length === 0) {
      return this.toWikimediaFilePath('Pill_bottle.jpg');
    }

    const index = Math.abs(seed) % images.length;
    return this.toWikimediaFilePath(images[index]);
  }

  private toWikimediaFilePath(fileName: string): string {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=640`;
  }

  getAllProducts(): Observable<PharmaProduct[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<PharmaProduct | undefined> {
    const product = this.products.find(item => item.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<PharmaProduct[]> {
    const filtered = this.products.filter(item => item.category === category);
    return of(filtered);
  }

  getCategories(): Observable<string[]> {
    const categories = Array.from(new Set(this.products.map(item => item.category)));
    return of(categories.sort());
  }

  getBrands(): Observable<string[]> {
    const brands = Array.from(new Set(this.products.map(item => item.manufacturer)));
    return of(brands.sort());
  }

  searchProducts(searchTerm: string): Observable<PharmaProduct[]> {
    const filtered = this.products.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filtered);
  }

  getPriceRange(): Observable<{ min: number; max: number }> {
    const prices = this.products.map(item => item.price);
    return of({
      min: Math.min(...prices),
      max: Math.max(...prices)
    });
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<PharmaProduct[]> {
    const filtered = this.products.filter(item => item.price >= minPrice && item.price <= maxPrice);
    return of(filtered);
  }
}
