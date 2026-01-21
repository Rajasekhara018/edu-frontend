import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [
    // ==================== LAPTOPS ====================
    {
      id: 1,
      name: 'Dell Inspiron 15 (Intel Core i5)',
      description: 'Powerful 15-inch laptop with Intel Core i5 processor, 8GB RAM, and 512GB SSD. Perfect for work and entertainment.',
      price: 49999,
      originalPrice: 65999,
      image: '/assets/images/dell-laptop.jpg',
      category: 'Laptops',
      inStock: true,
      rating: 4.6,
      reviews: 1234,
      sku: 'DELL-INSP-I5-15',
      specifications: {
        'Processor': 'Intel Core i5 (11th Gen)',
        'RAM': '8GB DDR4',
        'Storage': '512GB SSD',
        'Display': '15.6 inches FHD',
        'Graphics': 'Intel Integrated',
        'Battery': '40Wh'
      }
    },
    {
      id: 2,
      name: 'HP Pavilion 14 (AMD Ryzen 5)',
      description: 'Sleek 14-inch laptop with AMD Ryzen 5 processor, 8GB RAM, 256GB SSD. Lightweight and portable.',
      price: 45000,
      originalPrice: 58999,
      image: '/assets/images/hp-laptop.jpg',
      category: 'Laptops',
      inStock: true,
      rating: 4.5,
      reviews: 892,
      sku: 'HP-PAV-RYZEN-14',
      specifications: {
        'Processor': 'AMD Ryzen 5 5500U',
        'RAM': '8GB DDR4',
        'Storage': '256GB SSD',
        'Display': '14 inches FHD',
        'Graphics': 'Radeon Graphics',
        'Battery': '41Wh'
      }
    },
    {
      id: 3,
      name: 'Lenovo ThinkBook 14 (Intel Core i7)',
      description: 'Professional 14-inch laptop with Intel Core i7, 16GB RAM, 512GB SSD. Ideal for business and content creation.',
      price: 68999,
      originalPrice: 89999,
      image: '/assets/images/lenovo-laptop.jpg',
      category: 'Laptops',
      inStock: true,
      rating: 4.7,
      reviews: 2156,
      sku: 'LENOVO-THINK-I7-14',
      specifications: {
        'Processor': 'Intel Core i7 (11th Gen)',
        'RAM': '16GB DDR4',
        'Storage': '512GB SSD',
        'Display': '14 inches FHD',
        'Graphics': 'Intel Iris Xe',
        'Battery': '52Wh'
      }
    },
    {
      id: 4,
      name: 'ASUS VivoBook 15 (AMD Ryzen 7)',
      description: 'High-performance 15-inch laptop with AMD Ryzen 7, 16GB RAM, 512GB SSD. Great for multitasking.',
      price: 59999,
      originalPrice: 79999,
      image: '/assets/images/asus-laptop.jpg',
      category: 'Laptops',
      inStock: true,
      rating: 4.6,
      reviews: 1567,
      sku: 'ASUS-VIVO-RYZEN7-15',
      specifications: {
        'Processor': 'AMD Ryzen 7 5700U',
        'RAM': '16GB DDR4',
        'Storage': '512GB SSD',
        'Display': '15.6 inches FHD',
        'Graphics': 'Radeon Graphics',
        'Battery': '42Wh'
      }
    },

    // ==================== SMARTPHONES ====================
    {
      id: 5,
      name: 'iPhone 13 (128GB)',
      description: 'Latest Apple iPhone with A15 Bionic chip, dual camera system, and all-day battery life.',
      price: 59999,
      originalPrice: 69999,
      image: '/assets/images/iphone-13.jpg',
      category: 'Smartphones',
      inStock: true,
      rating: 4.8,
      reviews: 5432,
      sku: 'IPHONE-13-128',
      specifications: {
        'Processor': 'A15 Bionic',
        'RAM': '4GB',
        'Storage': '128GB',
        'Display': '6.1 inches Super Retina XDR',
        'Camera': 'Dual 12MP',
        'Battery': '3240 mAh'
      }
    },
    {
      id: 6,
      name: 'Samsung Galaxy S21 (128GB)',
      description: 'Samsung flagship with Snapdragon 888, 120Hz display, and professional camera system.',
      price: 54999,
      originalPrice: 69999,
      image: '/assets/images/samsung-s21.jpg',
      category: 'Smartphones',
      inStock: true,
      rating: 4.7,
      reviews: 4821,
      sku: 'SAMSUNG-S21-128',
      specifications: {
        'Processor': 'Snapdragon 888',
        'RAM': '8GB',
        'Storage': '128GB',
        'Display': '6.2 inches Dynamic AMOLED',
        'Camera': 'Triple 64MP',
        'Battery': '4000 mAh'
      }
    },
    {
      id: 7,
      name: 'OnePlus 9 (8GB)',
      description: 'Fast and smooth performance with Snapdragon 888, Hasselblad camera, and 65W charging.',
      price: 39999,
      originalPrice: 49999,
      image: '/assets/images/oneplus-9.jpg',
      category: 'Smartphones',
      inStock: true,
      rating: 4.6,
      reviews: 3245,
      sku: 'ONEPLUS-9-8GB',
      specifications: {
        'Processor': 'Snapdragon 888',
        'RAM': '8GB',
        'Storage': '128GB',
        'Display': '6.55 inches Amoled',
        'Camera': 'Quad 48MP',
        'Battery': '4500 mAh'
      }
    },
    {
      id: 8,
      name: 'Xiaomi Redmi Note 10 (4GB)',
      description: 'Budget-friendly smartphone with great display, quad camera, and large battery.',
      price: 13999,
      originalPrice: 16999,
      image: '/assets/images/xiaomi-redmi.jpg',
      category: 'Smartphones',
      inStock: true,
      rating: 4.4,
      reviews: 6789,
      sku: 'XIAOMI-REDMI10-4GB',
      specifications: {
        'Processor': 'Snapdragon 678',
        'RAM': '4GB',
        'Storage': '64GB',
        'Display': '6.43 inches AMOLED',
        'Camera': 'Quad 48MP',
        'Battery': '5000 mAh'
      }
    },

    // ==================== TELEVISIONS ====================
    {
      id: 9,
      name: 'LG OLED 55" TV (4K)',
      description: 'Premium 55-inch OLED TV with 4K resolution, HDR support, and immersive sound.',
      price: 149999,
      originalPrice: 199999,
      image: '/assets/images/lg-oled-55.jpg',
      category: 'Televisions',
      inStock: true,
      rating: 4.8,
      reviews: 432,
      sku: 'LG-OLED-55-4K',
      specifications: {
        'Size': '55 inches',
        'Resolution': '4K (3840x2160)',
        'Technology': 'OLED',
        'Refresh Rate': '120Hz',
        'Smart TV': 'WebOS',
        'Ports': 'HDMI 2.1, USB'
      }
    },
    {
      id: 10,
      name: 'Samsung Q70 50" TV (QLED)',
      description: 'Quantum dot LED TV with 4K resolution, impressive brightness, and gaming features.',
      price: 89999,
      originalPrice: 119999,
      image: '/assets/images/samsung-qled-50.jpg',
      category: 'Televisions',
      inStock: true,
      rating: 4.7,
      reviews: 678,
      sku: 'SAMSUNG-Q70-50',
      specifications: {
        'Size': '50 inches',
        'Resolution': '4K (3840x2160)',
        'Technology': 'QLED',
        'Refresh Rate': '60Hz',
        'Smart TV': 'Tizen',
        'Ports': 'HDMI, USB, Ethernet'
      }
    },
    {
      id: 11,
      name: 'Sony Bravia 43" TV (Full HD)',
      description: 'Reliable 43-inch Full HD TV with excellent picture quality and smart features.',
      price: 34999,
      originalPrice: 44999,
      image: '/assets/images/sony-bravia-43.jpg',
      category: 'Televisions',
      inStock: true,
      rating: 4.5,
      reviews: 1234,
      sku: 'SONY-BRAVIA-43',
      specifications: {
        'Size': '43 inches',
        'Resolution': 'Full HD (1920x1080)',
        'Technology': 'LED',
        'Refresh Rate': '60Hz',
        'Smart TV': 'Android',
        'Ports': 'HDMI, USB'
      }
    },

    // ==================== WASHING MACHINES ====================
    {
      id: 12,
      name: 'Bosch 7kg Fully Automatic Washing Machine',
      description: 'German engineering with 7kg capacity, multiple wash programs, and energy efficiency.',
      price: 44999,
      originalPrice: 59999,
      image: '/assets/images/bosch-washer.jpg',
      category: 'Washing Machines',
      inStock: true,
      rating: 4.7,
      reviews: 892,
      sku: 'BOSCH-WASH-7KG',
      specifications: {
        'Capacity': '7 kg',
        'Type': 'Fully Automatic Front Load',
        'Energy Rating': '5 Star',
        'Spin Speed': '1400 RPM',
        'Programs': '15+',
        'Water Usage': '41 liters/cycle'
      }
    },
    {
      id: 13,
      name: 'LG 8kg Semi-Automatic Washing Machine',
      description: 'Semi-automatic 8kg capacity washer with powerful washing action and durability.',
      price: 16999,
      originalPrice: 22999,
      image: '/assets/images/lg-washer.jpg',
      category: 'Washing Machines',
      inStock: true,
      rating: 4.4,
      reviews: 1567,
      sku: 'LG-WASH-8KG-SEMI',
      specifications: {
        'Capacity': '8 kg',
        'Type': 'Semi-Automatic Twin Tub',
        'Material': 'Plastic Body',
        'Power': '700W',
        'Warranty': '2 Years',
        'Features': 'Auto timer, Overload protection'
      }
    },
    {
      id: 14,
      name: 'Whirlpool 6.5kg Fully Automatic Washing Machine',
      description: 'Compact 6.5kg fully automatic washer perfect for small families with advanced features.',
      price: 32999,
      originalPrice: 42999,
      image: '/assets/images/whirlpool-washer.jpg',
      category: 'Washing Machines',
      inStock: true,
      rating: 4.6,
      reviews: 1234,
      sku: 'WHIRLPOOL-WASH-6.5',
      specifications: {
        'Capacity': '6.5 kg',
        'Type': 'Fully Automatic Front Load',
        'Energy Rating': '5 Star',
        'Spin Speed': '1000 RPM',
        'Programs': '10+',
        'Warranty': '5 Years Warranty'
      }
    },

    // ==================== REFRIGERATORS ====================
    {
      id: 15,
      name: 'Samsung 650L Inverter Refrigerator',
      description: 'Large 650L capacity with inverter compressor, frost-free, and smart cooling.',
      price: 89999,
      originalPrice: 119999,
      image: '/assets/images/samsung-fridge.jpg',
      category: 'Refrigerators',
      inStock: true,
      rating: 4.7,
      reviews: 567,
      sku: 'SAMSUNG-FRIDGE-650',
      specifications: {
        'Capacity': '650 liters',
        'Type': 'Side by Side',
        'Compressor': 'Inverter',
        'Frost-Free': 'Yes',
        'Energy Rating': '5 Star',
        'Temperature Control': 'Digital'
      }
    },
    {
      id: 16,
      name: 'LG 345L Frost-Free Refrigerator',
      description: 'Compact 345L frost-free refrigerator with smart inverter technology.',
      price: 29999,
      originalPrice: 39999,
      image: '/assets/images/lg-fridge.jpg',
      category: 'Refrigerators',
      inStock: true,
      rating: 4.5,
      reviews: 1123,
      sku: 'LG-FRIDGE-345',
      specifications: {
        'Capacity': '345 liters',
        'Type': 'Double Door',
        'Compressor': 'Inverter',
        'Frost-Free': 'Yes',
        'Energy Rating': '4 Star',
        'Warranty': '3 Years'
      }
    },

    // ==================== AIR CONDITIONERS ====================
    {
      id: 17,
      name: 'Voltas 1.5 Ton 3-Star Split AC',
      description: 'Efficient 1.5 ton split AC with cooling and heating, perfect for medium rooms.',
      price: 34999,
      originalPrice: 44999,
      image: '/assets/images/voltas-ac.jpg',
      category: 'Air Conditioners',
      inStock: true,
      rating: 4.5,
      reviews: 892,
      sku: 'VOLTAS-AC-1.5TON',
      specifications: {
        'Capacity': '1.5 Ton',
        'Type': 'Split AC',
        'Star Rating': '3 Star',
        'Cooling Range': '150-180 sq ft',
        'Compressor': 'Reciprocating',
        'Power Consumption': '1.5 kW'
      }
    },
    {
      id: 18,
      name: 'Daikin 1 Ton 5-Star Split AC',
      description: 'Premium 1 ton inverter AC with excellent energy efficiency and whisper-quiet operation.',
      price: 42999,
      originalPrice: 55999,
      image: '/assets/images/daikin-ac.jpg',
      category: 'Air Conditioners',
      inStock: true,
      rating: 4.7,
      reviews: 1456,
      sku: 'DAIKIN-AC-1TON-5STAR',
      specifications: {
        'Capacity': '1 Ton',
        'Type': 'Split AC Inverter',
        'Star Rating': '5 Star',
        'Cooling Range': '100-120 sq ft',
        'Compressor': 'Inverter',
        'Power Consumption': '0.72 kW'
      }
    },

    // ==================== MICROWAVES ====================
    {
      id: 19,
      name: 'LG 21L Convection Microwave Oven',
      description: '21L convection microwave with 1000W power, multiple cooking modes, and timer.',
      price: 12999,
      originalPrice: 17999,
      image: '/assets/images/lg-microwave.jpg',
      category: 'Microwaves',
      inStock: true,
      rating: 4.6,
      reviews: 1234,
      sku: 'LG-MW-21L-CONV',
      specifications: {
        'Capacity': '21 liters',
        'Type': 'Convection Microwave',
        'Power': '1000W',
        'Cooking Modes': '8+',
        'Timer': 'Up to 99 minutes',
        'Warranty': '2 Years'
      }
    },
    {
      id: 20,
      name: 'IFB 30L Microwave Oven',
      description: 'Large 30L microwave with convection and grill modes, ideal for families.',
      price: 16999,
      originalPrice: 22999,
      image: '/assets/images/ifb-microwave.jpg',
      category: 'Microwaves',
      inStock: true,
      rating: 4.5,
      reviews: 892,
      sku: 'IFB-MW-30L',
      specifications: {
        'Capacity': '30 liters',
        'Type': 'Convection with Grill',
        'Power': '900W',
        'Cooking Modes': '10+',
        'Auto Menus': '50+',
        'Warranty': '2 Years'
      }
    },

    // ==================== GEYSERS/WATER HEATERS ====================
    {
      id: 21,
      name: 'Bajaj 15L Instant Electric Geyser',
      description: 'Instant 15L electric water heater with rapid heating and safety features.',
      price: 5999,
      originalPrice: 8999,
      image: '/assets/images/bajaj-geyser.jpg',
      category: 'Geysers',
      inStock: true,
      rating: 4.4,
      reviews: 2134,
      sku: 'BAJAJ-GEYSER-15L',
      specifications: {
        'Capacity': '15 liters',
        'Type': 'Instant Electric',
        'Power': '4500W',
        'Heating Time': '15-20 minutes',
        'Temperature Control': 'Thermostat',
        'Warranty': '2 Years'
      }
    },
    {
      id: 22,
      name: 'AO Smith 25L Storage Geyser',
      description: 'Premium 25L storage water heater with advanced insulation and energy efficiency.',
      price: 16999,
      originalPrice: 22999,
      image: '/assets/images/aosmith-geyser.jpg',
      category: 'Geysers',
      inStock: true,
      rating: 4.7,
      reviews: 1567,
      sku: 'AOSMITH-GEYSER-25L',
      specifications: {
        'Capacity': '25 liters',
        'Type': 'Storage Electric',
        'Power': '2000W',
        'Heating Time': '60-90 minutes',
        'Insulation': 'Advanced',
        'Warranty': '5 Years Tank Warranty'
      }
    },

    // ==================== KITCHEN APPLIANCES ====================
    {
      id: 23,
      name: 'Philips Air Fryer 4.1L',
      description: '4.1L air fryer with rapid heating, multiple cooking presets, and easy cleanup.',
      price: 9999,
      originalPrice: 14999,
      image: '/assets/images/philips-airfryer.jpg',
      category: 'Kitchen Appliances',
      inStock: true,
      rating: 4.6,
      reviews: 3456,
      sku: 'PHILIPS-AF-4.1L',
      specifications: {
        'Capacity': '4.1 liters',
        'Power': '1500W',
        'Temperature Range': '80-200°C',
        'Presets': '8',
        'Timer': 'Up to 60 minutes',
        'Warranty': '2 Years'
      }
    },
    {
      id: 24,
      name: 'Prestige Pressure Cooker 5L',
      description: '5L stainless steel pressure cooker with safety features and fast cooking.',
      price: 1999,
      originalPrice: 2999,
      image: '/assets/images/prestige-cooker.jpg',
      category: 'Kitchen Appliances',
      inStock: true,
      rating: 4.5,
      reviews: 5678,
      sku: 'PRESTIGE-PC-5L',
      specifications: {
        'Capacity': '5 liters',
        'Material': 'Stainless Steel',
        'Pressure': 'Triple Safety',
        'Whistle': 'Yes',
        'Heat Distribution': 'Even',
        'Warranty': 'Lifetime'
      }
    },
    {
      id: 25,
      name: 'Black+Decker Mixer Grinder 500W',
      description: 'Powerful 500W mixer grinder with 3 jars for wet, dry, and chutney grinding.',
      price: 3999,
      originalPrice: 5999,
      image: '/assets/images/blackdecker-mixer.jpg',
      category: 'Kitchen Appliances',
      inStock: true,
      rating: 4.4,
      reviews: 4234,
      sku: 'BD-MG-500W',
      specifications: {
        'Power': '500W',
        'Jars': '3 (Wet, Dry, Chutney)',
        'Speed Settings': '3',
        'Material': 'Polycarbonate',
        'Warranty': '2 Years',
        'Features': 'Overload protection'
      }
    },

    // ==================== FANS & COOLERS ====================
    {
      id: 26,
      name: 'Havells Ceiling Fan 1200mm',
      description: 'Energy-efficient 1200mm ceiling fan with 2 speed settings and modern design.',
      price: 1799,
      originalPrice: 2999,
      image: '/assets/images/havells-fan.jpg',
      category: 'Fans & Coolers',
      inStock: true,
      rating: 4.5,
      reviews: 3456,
      sku: 'HAVELLS-FAN-1200',
      specifications: {
        'Diameter': '1200mm',
        'Power': '70W',
        'Speed Settings': '2',
        'Noise Level': 'Low',
        'Warranty': '2 Years',
        'Material': 'Plastic'
      }
    },
    {
      id: 27,
      name: 'Symphony Air Cooler 41L',
      description: '41L air cooler with powerful air throw and evaporative cooling technology.',
      price: 8999,
      originalPrice: 12999,
      image: '/assets/images/symphony-cooler.jpg',
      category: 'Fans & Coolers',
      inStock: true,
      rating: 4.6,
      reviews: 2345,
      sku: 'SYMPHONY-COOLER-41L',
      specifications: {
        'Capacity': '41 liters',
        'Air Throw': '20-25 meters',
        'Power': '150W',
        'Water Tank': 'Large capacity',
        'Speed Settings': '3',
        'Warranty': '2 Years'
      }
    },

    // ==================== LIGHTING ====================
    {
      id: 28,
      name: 'Philips LED Bulb 9W',
      description: 'Energy-efficient 9W LED bulb with 50,000 hour lifespan and warm white light.',
      price: 299,
      originalPrice: 499,
      image: '/assets/images/philips-bulb.jpg',
      category: 'Lighting',
      inStock: true,
      rating: 4.6,
      reviews: 2156,
      sku: 'PHILIPS-LED-9W',
      specifications: {
        'Power': '9W',
        'Color Temperature': '2700K (Warm White)',
        'Lumens': '806 lm',
        'Lifespan': '50,000 hours',
        'Base Type': 'E27',
        'Warranty': '2 Years'
      }
    },
    {
      id: 29,
      name: 'Luminous Smart LED Bulb 9W (WiFi)',
      description: 'WiFi-enabled smart LED bulb with color changing and voice control compatibility.',
      price: 799,
      originalPrice: 1299,
      image: '/assets/images/luminous-smart-bulb.jpg',
      category: 'Lighting',
      inStock: true,
      rating: 4.7,
      reviews: 1567,
      sku: 'LUMINOUS-SMART-LED-9W',
      specifications: {
        'Power': '9W',
        'Colors': '16 Million',
        'WiFi': 'Yes',
        'Voice Control': 'Alexa & Google',
        'Brightness': 'Dimmable',
        'Warranty': '2 Years'
      }
    },

    // ==================== POWER SOLUTIONS ====================
    {
      id: 30,
      name: 'APC 650VA UPS',
      description: '650VA UPS providing backup power for 20-30 minutes with automatic voltage regulation.',
      price: 4999,
      originalPrice: 7999,
      image: '/assets/images/apc-ups.jpg',
      category: 'Power Solutions',
      inStock: true,
      rating: 4.5,
      reviews: 1234,
      sku: 'APC-UPS-650VA',
      specifications: {
        'Capacity': '650VA',
        'Battery Type': 'Sealed Lead Acid',
        'Backup Time': '25-30 minutes',
        'Output': 'Pure Sine Wave',
        'Warranty': '2 Years',
        'Features': 'Auto Voltage Regulation'
      }
    },
    {
      id: 31,
      name: 'Luminous Solar Panel 100W',
      description: 'Monocrystalline solar panel 100W with high efficiency for home power generation.',
      price: 8999,
      originalPrice: 12999,
      image: '/assets/images/luminous-solar.jpg',
      category: 'Power Solutions',
      inStock: true,
      rating: 4.6,
      reviews: 892,
      sku: 'LUMINOUS-SOLAR-100W',
      specifications: {
        'Power': '100W',
        'Type': 'Monocrystalline',
        'Efficiency': '20%',
        'Voltage': '18V',
        'Warranty': '10 Years',
        'Dimensions': '1200x540x35mm'
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
      'Laptops',
      'Smartphones',
      'Televisions',
      'Washing Machines',
      'Refrigerators',
      'Air Conditioners',
      'Microwaves',
      'Geysers',
      'Kitchen Appliances',
      'Fans & Coolers',
      'Lighting',
      'Power Solutions',
      'Cables',
      'Switches',
      'Inverters',
      'Batteries',
      'Tools',
      'Security',
      'Accessories'
    ];
    const brands = [
      'Philips',
      'Havells',
      'Syska',
      'Crompton',
      'Anchor',
      'Luminous',
      'HPL',
      'Schneider',
      'Polycab',
      'Finolex',
      'Bajaj',
      'Orient',
      'Usha',
      'Panasonic',
      'Samsung',
      'LG',
      'Bosch',
      'IFB',
      'Voltas',
      'Daikin'
    ];
    const categorySpecs: Record<string, { [key: string]: string }> = {
      'Cables': { 'Length': '90 m', 'Gauge': '1.5 sq mm', 'Insulation': 'PVC' },
      'Switches': { 'Type': 'Modular', 'Current': '10A', 'Material': 'Polycarbonate' },
      'Inverters': { 'Capacity': '850 VA', 'Output': 'Pure Sine Wave', 'Backup': '2-4 hours' },
      'Batteries': { 'Capacity': '150 Ah', 'Type': 'Tubular', 'Warranty': '36 Months' },
      'Tools': { 'Power': '650W', 'Speed': '3000 RPM', 'Cord Length': '2 m' },
      'Security': { 'Resolution': '1080p', 'Lens': '3.6 mm', 'Night Vision': '20 m' },
      'Accessories': { 'Material': 'ABS', 'Color': 'Black', 'Warranty': '1 Year' },
      'Laptops': { 'Processor': 'Intel Core i5', 'RAM': '8GB', 'Storage': '512GB SSD' },
      'Smartphones': { 'Processor': 'Octa Core', 'RAM': '6GB', 'Storage': '128GB' },
      'Televisions': { 'Resolution': '4K', 'Display': 'LED', 'Refresh Rate': '60Hz' },
      'Washing Machines': { 'Capacity': '7 kg', 'Type': 'Front Load', 'Energy Rating': '5 Star' },
      'Refrigerators': { 'Capacity': '300 liters', 'Type': 'Double Door', 'Frost-Free': 'Yes' },
      'Air Conditioners': { 'Capacity': '1.5 Ton', 'Type': 'Split AC', 'Star Rating': '3 Star' },
      'Microwaves': { 'Capacity': '25 liters', 'Type': 'Convection', 'Power': '900W' },
      'Geysers': { 'Capacity': '15 liters', 'Type': 'Storage', 'Power': '2000W' },
      'Kitchen Appliances': { 'Power': '750W', 'Material': 'Stainless Steel', 'Warranty': '2 Years' },
      'Fans & Coolers': { 'Power': '70W', 'Speed Settings': '3', 'Warranty': '2 Years' },
      'Lighting': { 'Power': '12W', 'Color Temperature': '6500K', 'Lifespan': '30,000 hours' },
      'Power Solutions': { 'Capacity': '1000 VA', 'Output': 'Pure Sine Wave', 'Warranty': '2 Years' }
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
        description: `Reliable ${category.toLowerCase()} from ${brand} with balanced performance and durable build.`,
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
      'Laptops': [
        'MacBook_Pro_16_inch_2019.jpg',
        'Laptop-open.jpg',
        'Acer_Aspire_One.jpg'
      ],
      'Smartphones': [
        'Smartphone_(black).jpg',
        'Smartphone_with_screen.jpg',
        'IPhone_12_Pro_Max.png'
      ],
      'Televisions': [
        'LCD_TV.jpg',
        'Television_set.jpg',
        'Plasma_television.jpg'
      ],
      'Washing Machines': [
        'Front_loading_washing_machine.jpg',
        'Washing_machine_(white).jpg',
        'Washing_machine.jpg'
      ],
      'Refrigerators': [
        'Whirlpool_refrigerator.jpg',
        'Refrigerator_Open.jpg',
        'Fridge.jpg'
      ],
      'Air Conditioners': [
        'Window_air_conditioner.jpg',
        'Split_air_conditioner.jpg',
        'Air_conditioner_outdoor_unit.jpg'
      ],
      'Microwaves': [
        'Microwave_oven.jpg',
        'Microwave_oven_white.jpg',
        'Microwave_oven_inside.jpg'
      ],
      'Geysers': [
        'Water_heater.jpg',
        'Instant_water_heater.jpg',
        'Electric_water_heater.jpg'
      ],
      'Kitchen Appliances': [
        'Blender_jar.jpg',
        'Pressure_cooker.jpg',
        'Toaster.jpg'
      ],
      'Fans & Coolers': [
        'Ceiling_fan.jpg',
        'Table_fan.jpg',
        'Air_cooler.jpg'
      ],
      'Lighting': [
        'LED_bulb.jpg',
        'Compact_fluorescent_lamp.jpg',
        'Light_bulb.jpg'
      ],
      'Power Solutions': [
        'UPS_battery.jpg',
        'Solar_panel.jpg',
        'Inverter.jpg'
      ],
      'Cables': [
        'Electrical_cables.jpg',
        'Electrical_wire.jpg',
        'Power_cable.jpg'
      ],
      'Switches': [
        'Light_switch.jpg',
        'Wall_switch.jpg',
        'Electrical_switch.jpg'
      ],
      'Inverters': [
        'Solar_inverter.jpg',
        'Inverter.jpg',
        'Power_inverter.jpg'
      ],
      'Batteries': [
        'Car_battery.jpg',
        'Lead_acid_battery.jpg',
        'Rechargeable_batteries.jpg'
      ],
      'Tools': [
        'Power_drill.jpg',
        'Angle_grinder.jpg',
        'Toolbox_tools.jpg'
      ],
      'Security': [
        'CCTV_camera.jpg',
        'Security_camera.jpg',
        'Surveillance_camera.jpg'
      ],
      'Accessories': [
        'USB_cables.jpg',
        'Power_strip.jpg',
        'Surge_protector.jpg'
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
