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
      const template = this.getCategoryTemplate(category, index);
      const modelNumber = (index + 1).toString().padStart(4, '0');
      const basePrice = generation.basePriceStart + (index * generation.priceStep) % generation.priceModulo;
      const price = Math.max(20, Math.round(basePrice + (category.length * generation.categoryPriceFactor) + template.priceBias));
      const discounted = index % generation.discountEvery === 0;
      const originalPrice = discounted ? Math.round(price * (1 + generation.discountRate)) : undefined;
      const rating = Math.min(5, 4 + (index % 9) * 0.1);
      const reviews = 120 + (index * 17) % 12000;
      const inStock = index % 10 !== 0;
      const id = nextId++;
      const categoryKey = category.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const name = `${brand} ${template.name}`;
      const defaultSpecs = generation.categorySpecifications[category] || { Pack: '1 unit', Freshness: 'Standard', Storage: 'Room temperature' };
      const skuSuffix = template.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || this.getProductSuffix(category).toUpperCase().replace(/[^A-Z0-9]/g, '');

      products.push({
        id,
        name,
        description: template.description,
        price,
        originalPrice,
        image: this.buildImageUrl(category, name, template.visualTag),
        category,
        inStock,
        rating,
        reviews,
        sku: `${brand.toUpperCase()}-${categoryKey}-${skuSuffix}-${modelNumber}`,
        specifications: { ...defaultSpecs, ...template.specifications }
      });

      index += 1;
    }

    return products;
  }

  private getDefaultSeedProducts(): Product[] {
    return [
      { id: 1, name: 'FreshFarm Banana Robusta', description: 'Naturally ripened bananas ideal for breakfast, milkshakes, and school snack boxes.', price: 52, originalPrice: 64, image: '', category: 'Fresh Produce', inStock: true, rating: 4.7, reviews: 2840, sku: 'FRESHFARM-FRESH-BANANA-0001', specifications: { Weight: '1 kg', Origin: 'Local farm', ShelfLife: '3 days', Storage: 'Room temperature' } },
      { id: 2, name: 'UrbanHarvest Tomato Hybrid', description: 'Bright red tomatoes selected for daily curry, chutney, and salad prep.', price: 38, originalPrice: 46, image: '', category: 'Fresh Produce', inStock: true, rating: 4.6, reviews: 2140, sku: 'URBANHARVEST-FRESH-TOMATO-0002', specifications: { Weight: '1 kg', Origin: 'Regional farms', ShelfLife: '4 days', Storage: 'Cool and dry' } },
      { id: 3, name: 'FreshFarm Coriander Bunch', description: 'Fresh aromatic coriander leaves for garnish, chutneys, and gravies.', price: 15, originalPrice: 19, image: '', category: 'Fresh Produce', inStock: true, rating: 4.5, reviews: 980, sku: 'FRESHFARM-FRESH-CORIANDER-0003', specifications: { Weight: '100 g', Origin: 'Local farm', ShelfLife: '2 days', Storage: 'Refrigerate' } },
      { id: 4, name: 'DailyDairy Whole Milk Pack', description: 'Chilled full-cream milk sourced fresh for everyday tea and breakfast use.', price: 32, originalPrice: 38, image: '', category: 'Dairy & Eggs', inStock: true, rating: 4.6, reviews: 1980, sku: 'DAILYDAIRY-DAIRY-MILK-0004', specifications: { Volume: '500 ml', Type: 'Full cream', ShelfLife: '3 days', Storage: 'Refrigerate' } },
      { id: 5, name: 'DailyDairy Curd Cup', description: 'Thick and smooth curd cup for meals, raita, and marinades.', price: 42, originalPrice: 50, image: '', category: 'Dairy & Eggs', inStock: true, rating: 4.6, reviews: 1210, sku: 'DAILYDAIRY-DAIRY-CURD-0005', specifications: { Weight: '400 g', Type: 'Set curd', ShelfLife: '5 days', Storage: 'Refrigerate' } },
      { id: 6, name: 'FarmNest Eggs Brown 12', description: 'Farm-fresh brown eggs graded for daily breakfast and baking.', price: 96, originalPrice: 112, image: '', category: 'Dairy & Eggs', inStock: true, rating: 4.7, reviews: 1620, sku: 'FARMNEST-DAIRY-EGGS-0006', specifications: { Count: '12', Type: 'Brown eggs', ShelfLife: '12 days', Storage: 'Refrigerate' } },
      { id: 7, name: 'BakeHouse Sandwich Bread', description: 'Soft daily bread loaf for breakfast sandwiches and toast.', price: 42, originalPrice: 50, image: '', category: 'Bakery', inStock: true, rating: 4.5, reviews: 920, sku: 'BAKEHOUSE-BAKERY-BREAD-0007', specifications: { Weight: '400 g', Freshness: 'Baked today', ShelfLife: '2 days', Storage: 'Cool and dry' } },
      { id: 8, name: 'BakeHouse Burger Buns', description: 'Fresh burger buns perfect for quick snacks and party platters.', price: 48, originalPrice: 56, image: '', category: 'Bakery', inStock: true, rating: 4.4, reviews: 710, sku: 'BAKEHOUSE-BAKERY-BUNS-0008', specifications: { Count: '6', Freshness: 'Baked today', ShelfLife: '2 days', Storage: 'Cool and dry' } },
      { id: 9, name: 'BakeHouse Multigrain Bread', description: 'Fiber-rich multigrain loaf suitable for healthy breakfast routines.', price: 64, originalPrice: 74, image: '', category: 'Bakery', inStock: true, rating: 4.5, reviews: 540, sku: 'BAKEHOUSE-BAKERY-MULTIGRAIN-0009', specifications: { Weight: '450 g', Freshness: 'Baked today', ShelfLife: '3 days', Storage: 'Cool and dry' } },
      { id: 10, name: 'PantryPro Premium Toor Dal', description: 'Cleaned and packed toor dal for everyday cooking and pantry stocking.', price: 148, originalPrice: 170, image: '', category: 'Staples', inStock: true, rating: 4.7, reviews: 1340, sku: 'PANTRYPRO-STAPLES-TOORDAL-0010', specifications: { Weight: '1 kg', Type: 'Toor dal', ShelfLife: '9 months', Storage: 'Dry place' } },
      { id: 11, name: 'PantryPro Sona Masoori Rice', description: 'Light and aromatic rice suited for everyday family meals.', price: 84, originalPrice: 98, image: '', category: 'Staples', inStock: true, rating: 4.6, reviews: 2080, sku: 'PANTRYPRO-STAPLES-RICE-0011', specifications: { Weight: '1 kg', Type: 'Rice', ShelfLife: '12 months', Storage: 'Dry place' } },
      { id: 12, name: 'GrainLeaf Chakki Atta', description: 'Stone-ground whole wheat flour for soft rotis and chapatis.', price: 212, originalPrice: 239, image: '', category: 'Staples', inStock: true, rating: 4.7, reviews: 1890, sku: 'GRAINLEAF-STAPLES-ATTA-0012', specifications: { Weight: '5 kg', Type: 'Whole wheat atta', ShelfLife: '5 months', Storage: 'Dry airtight container' } },
      { id: 13, name: 'CrunchCo Namkeen Mix', description: 'Crisp savory snack mix for tea-time and family snacking.', price: 58, originalPrice: 68, image: '', category: 'Snacks', inStock: true, rating: 4.4, reviews: 1760, sku: 'CRUNCHCO-SNACKS-NAMKEEN-0013', specifications: { Weight: '250 g', Type: 'Savory snack', ShelfLife: '4 months', Storage: 'Cool and dry' } },
      { id: 14, name: 'CrunchCo Masala Peanuts', description: 'Spiced crunchy peanuts packed for evening snacking.', price: 74, originalPrice: 88, image: '', category: 'Snacks', inStock: true, rating: 4.5, reviews: 990, sku: 'CRUNCHCO-SNACKS-PEANUTS-0014', specifications: { Weight: '300 g', Type: 'Roasted snack', ShelfLife: '5 months', Storage: 'Cool and dry' } },
      { id: 15, name: 'CrunchCo Potato Chips Classic', description: 'Thin and crispy potato chips for movie-night and travel packs.', price: 25, originalPrice: 30, image: '', category: 'Snacks', inStock: true, rating: 4.3, reviews: 3020, sku: 'CRUNCHCO-SNACKS-CHIPS-0015', specifications: { Weight: '52 g', Type: 'Potato chips', ShelfLife: '4 months', Storage: 'Cool and dry' } },
      { id: 16, name: 'PureSip Orange Juice Carton', description: 'Ready-to-drink orange juice carton for breakfast and lunchbox use.', price: 88, originalPrice: 104, image: '', category: 'Beverages', inStock: true, rating: 4.5, reviews: 860, sku: 'PURESIP-BEVERAGES-ORANGE-0016', specifications: { Volume: '1 L', Type: 'Fruit beverage', ShelfLife: '3 months', Storage: 'Refrigerate after opening' } },
      { id: 17, name: 'PureSip Tender Coconut Water', description: 'Hydrating coconut water with no added preservatives.', price: 44, originalPrice: 52, image: '', category: 'Beverages', inStock: true, rating: 4.4, reviews: 1310, sku: 'PURESIP-BEVERAGES-COCONUT-0017', specifications: { Volume: '200 ml', Type: 'Natural beverage', ShelfLife: '6 months', Storage: 'Serve chilled' } },
      { id: 18, name: 'BrewBerry Instant Coffee', description: 'Aromatic instant coffee blend for quick hot and cold beverages.', price: 175, originalPrice: 210, image: '', category: 'Beverages', inStock: true, rating: 4.5, reviews: 780, sku: 'BREWBERRY-BEVERAGES-COFFEE-0018', specifications: { Weight: '100 g', Type: 'Instant coffee', ShelfLife: '12 months', Storage: 'Cool and dry' } },
      { id: 19, name: 'QuickMeal Veg Momos Frozen', description: 'Frozen ready-to-cook dumplings for quick family meals.', price: 140, originalPrice: 165, image: '', category: 'Frozen Foods', inStock: true, rating: 4.3, reviews: 640, sku: 'QUICKMEAL-FROZEN-MOMOS-0019', specifications: { Weight: '500 g', Type: 'Frozen snack', ShelfLife: '6 months', Storage: 'Keep frozen' } },
      { id: 20, name: 'QuickMeal Green Peas Frozen', description: 'Premium frozen green peas cleaned and sealed for easy cooking.', price: 129, originalPrice: 149, image: '', category: 'Frozen Foods', inStock: true, rating: 4.5, reviews: 970, sku: 'QUICKMEAL-FROZEN-PEAS-0020', specifications: { Weight: '500 g', Type: 'Frozen vegetables', ShelfLife: '8 months', Storage: 'Keep frozen' } },
      { id: 21, name: 'QuickMeal Aloo Paratha Frozen', description: 'Ready-to-heat stuffed paratha for quick breakfast and dinner.', price: 168, originalPrice: 192, image: '', category: 'Frozen Foods', inStock: true, rating: 4.4, reviews: 740, sku: 'QUICKMEAL-FROZEN-PARATHA-0021', specifications: { Weight: '400 g', Type: 'Frozen meal', ShelfLife: '8 months', Storage: 'Keep frozen' } },
      { id: 22, name: 'CareNest Aloe Body Wash', description: 'Everyday body wash with fresh fragrance and soft lather.', price: 179, originalPrice: 220, image: '', category: 'Personal Care', inStock: true, rating: 4.5, reviews: 720, sku: 'CARENEST-PERSONAL-BODYWASH-0022', specifications: { Volume: '250 ml', Type: 'Body wash', ShelfLife: '12 months', Storage: 'Room temperature' } },
      { id: 23, name: 'CareNest Herbal Shampoo', description: 'Gentle daily-use shampoo for clean scalp and soft hair.', price: 219, originalPrice: 260, image: '', category: 'Personal Care', inStock: true, rating: 4.4, reviews: 680, sku: 'CARENEST-PERSONAL-SHAMPOO-0023', specifications: { Volume: '340 ml', Type: 'Hair care', ShelfLife: '18 months', Storage: 'Room temperature' } },
      { id: 24, name: 'SmileMint Toothpaste Fresh', description: 'Fluoride toothpaste for cavity protection and long-lasting freshness.', price: 96, originalPrice: 112, image: '', category: 'Personal Care', inStock: true, rating: 4.6, reviews: 1320, sku: 'SMILEMINT-PERSONAL-TOOTHPASTE-0024', specifications: { Weight: '200 g', Type: 'Oral care', ShelfLife: '24 months', Storage: 'Cool and dry' } },
      { id: 25, name: 'HomeFresh Floor Cleaner', description: 'Concentrated floor cleaner for daily household use.', price: 132, originalPrice: 160, image: '', category: 'Cleaning', inStock: true, rating: 4.6, reviews: 1180, sku: 'HOMEFRESH-CLEANING-FLOOR-0025', specifications: { Volume: '1 L', Type: 'Cleaner', ShelfLife: '12 months', Storage: 'Room temperature' } },
      { id: 26, name: 'HomeFresh Dishwash Gel Lime', description: 'Powerful dishwash gel that removes grease with a fresh lime scent.', price: 118, originalPrice: 139, image: '', category: 'Cleaning', inStock: true, rating: 4.5, reviews: 960, sku: 'HOMEFRESH-CLEANING-DISHWASH-0026', specifications: { Volume: '750 ml', Type: 'Dishwash gel', ShelfLife: '18 months', Storage: 'Room temperature' } },
      { id: 27, name: 'HomeFresh Laundry Detergent', description: 'Low-foam detergent powder for machine and bucket wash.', price: 229, originalPrice: 260, image: '', category: 'Cleaning', inStock: true, rating: 4.4, reviews: 850, sku: 'HOMEFRESH-CLEANING-LAUNDRY-0027', specifications: { Weight: '2 kg', Type: 'Laundry detergent', ShelfLife: '18 months', Storage: 'Cool and dry' } },
      { id: 28, name: 'BabyBloom Diaper Pants Medium', description: 'Soft diaper pants designed for day and night comfort.', price: 329, originalPrice: 380, image: '', category: 'Baby Care', inStock: true, rating: 4.7, reviews: 940, sku: 'BABYBLOOM-BABY-DIAPER-0028', specifications: { Count: '24', Size: 'Medium', ShelfLife: '24 months', Storage: 'Cool and dry' } },
      { id: 29, name: 'BabyBloom Baby Wipes Aloe', description: 'Gentle alcohol-free wipes for diaper changes and quick cleanup.', price: 99, originalPrice: 120, image: '', category: 'Baby Care', inStock: true, rating: 4.6, reviews: 1640, sku: 'BABYBLOOM-BABY-WIPES-0029', specifications: { Count: '72', Type: 'Wet wipes', ShelfLife: '24 months', Storage: 'Seal after use' } },
      { id: 30, name: 'BabyBloom Baby Lotion', description: 'Mild moisturizing lotion for soft and nourished baby skin.', price: 185, originalPrice: 220, image: '', category: 'Baby Care', inStock: true, rating: 4.5, reviews: 730, sku: 'BABYBLOOM-BABY-LOTION-0030', specifications: { Volume: '200 ml', Type: 'Baby lotion', ShelfLife: '18 months', Storage: 'Room temperature' } }
    ];
  }

  private getCategoryTemplate(category: string, index: number): { name: string; description: string; specifications?: { [key: string]: string }; priceBias: number; visualTag: string } {
    const templates: Record<string, Array<{ name: string; description: string; specifications?: { [key: string]: string }; priceBias: number; visualTag: string }>> = {
      'Fresh Produce': [
        { name: 'Banana Robusta 1 kg', description: 'Naturally ripened bananas selected for daily breakfast and smoothie bowls.', specifications: { Weight: '1 kg', Freshness: 'Farm fresh', Storage: 'Room temperature' }, priceBias: -12, visualTag: 'FRUIT' },
        { name: 'Tomato Fresh 1 kg', description: 'Bright red tomatoes suitable for curry base, salads, and chutney prep.', specifications: { Weight: '1 kg', Freshness: 'Daily harvest', Storage: 'Cool and dry' }, priceBias: -15, visualTag: 'VEG' },
        { name: 'Potato Super 2 kg', description: 'Washed all-purpose potatoes ideal for fries, curries, and dry sabzi.', specifications: { Weight: '2 kg', Variety: 'Table potato', Storage: 'Dry and dark place' }, priceBias: -2, visualTag: 'VEG' },
        { name: 'Onion Premium 1 kg', description: 'Sorted medium onions with balanced pungency for daily cooking.', specifications: { Weight: '1 kg', Grade: 'A', Storage: 'Dry and airy place' }, priceBias: -5, visualTag: 'VEG' },
        { name: 'Apple Royal Gala 4 pc', description: 'Crisp and sweet apples packed for healthy snacking and lunch boxes.', specifications: { Weight: 'Approx 650 g', Origin: 'Imported', Storage: 'Refrigerate' }, priceBias: 18, visualTag: 'FRUIT' }
      ],
      'Dairy & Eggs': [
        { name: 'Whole Milk 500 ml', description: 'Chilled full-cream milk for tea, coffee, and everyday breakfast.', specifications: { Volume: '500 ml', Fat: '6%', Storage: 'Refrigerate' }, priceBias: -14, visualTag: 'MILK' },
        { name: 'Curd Cup 400 g', description: 'Thick set curd cup for meals, raita, and marinade use.', specifications: { Weight: '400 g', Type: 'Set curd', Storage: 'Refrigerate' }, priceBias: -8, visualTag: 'DAIRY' },
        { name: 'Paneer Block 200 g', description: 'Fresh paneer block for curries, tikka, and stir-fry recipes.', specifications: { Weight: '200 g', Type: 'Fresh paneer', Storage: 'Refrigerate' }, priceBias: 11, visualTag: 'DAIRY' },
        { name: 'Brown Eggs 12 pcs', description: 'Farm eggs packed hygienically for omelette, baking, and protein-rich meals.', specifications: { Count: '12', Grade: 'Large', Storage: 'Refrigerate' }, priceBias: 7, visualTag: 'EGGS' },
        { name: 'Salted Butter 100 g', description: 'Creamy table butter for toast, sauteing, and quick meal prep.', specifications: { Weight: '100 g', Type: 'Salted', Storage: 'Refrigerate' }, priceBias: 13, visualTag: 'DAIRY' }
      ],
      Bakery: [
        { name: 'Sandwich Bread 400 g', description: 'Soft bread loaf for toast, sandwiches, and garlic bread.', specifications: { Weight: '400 g', Freshness: 'Baked today', Storage: 'Cool and dry' }, priceBias: -10, visualTag: 'BAKERY' },
        { name: 'Burger Buns 6 pcs', description: 'Fluffy burger buns for homemade burgers and mini sliders.', specifications: { Count: '6', Freshness: 'Baked today', Storage: 'Cool and dry' }, priceBias: -8, visualTag: 'BAKERY' },
        { name: 'Rusk Toast 300 g', description: 'Crispy baked rusk for tea-time and light evening snacks.', specifications: { Weight: '300 g', Type: 'Double baked', Storage: 'Airtight container' }, priceBias: -3, visualTag: 'BAKERY' },
        { name: 'Multigrain Bread 450 g', description: 'Fiber-rich multigrain loaf for balanced breakfast routines.', specifications: { Weight: '450 g', Type: 'Multigrain', Storage: 'Cool and dry' }, priceBias: 8, visualTag: 'BAKERY' }
      ],
      Staples: [
        { name: 'Sona Masoori Rice 1 kg', description: 'Light and aromatic rice for daily lunch and dinner meals.', specifications: { Weight: '1 kg', Variety: 'Sona Masoori', Storage: 'Dry place' }, priceBias: 9, visualTag: 'RICE' },
        { name: 'Toor Dal 1 kg', description: 'Unpolished toor dal cleaned and packed for regular cooking.', specifications: { Weight: '1 kg', Type: 'Unpolished', Storage: 'Dry place' }, priceBias: 14, visualTag: 'DAL' },
        { name: 'Chakki Atta 5 kg', description: 'Stone-ground whole wheat flour for soft rotis and chapatis.', specifications: { Weight: '5 kg', Type: 'Whole wheat', Storage: 'Dry airtight container' }, priceBias: 25, visualTag: 'ATTA' },
        { name: 'Rock Salt 1 kg', description: 'Fine crystal salt suitable for daily household cooking.', specifications: { Weight: '1 kg', Type: 'Iodized', Storage: 'Dry place' }, priceBias: -20, visualTag: 'STAPLE' }
      ],
      Snacks: [
        { name: 'Classic Potato Chips 52 g', description: 'Thin and crispy chips seasoned for daily snacking cravings.', specifications: { Weight: '52 g', Type: 'Potato chips', Storage: 'Cool and dry' }, priceBias: -17, visualTag: 'SNACK' },
        { name: 'Masala Peanuts 300 g', description: 'Crunchy spiced peanuts for tea-time and travel snacking.', specifications: { Weight: '300 g', Type: 'Roasted peanuts', Storage: 'Cool and dry' }, priceBias: -4, visualTag: 'SNACK' },
        { name: 'Namkeen Mixture 250 g', description: 'Savory namkeen blend packed for family snack bowls.', specifications: { Weight: '250 g', Type: 'Savory mix', Storage: 'Airtight container' }, priceBias: -6, visualTag: 'SNACK' },
        { name: 'Jeera Biscuit 200 g', description: 'Lightly salted jeera biscuits for tea breaks and office pantry jars.', specifications: { Weight: '200 g', Type: 'Biscuit', Storage: 'Cool and dry' }, priceBias: -5, visualTag: 'SNACK' }
      ],
      Beverages: [
        { name: 'Orange Juice 1 L', description: 'Fruit juice blend for breakfast and chilled servings.', specifications: { Volume: '1 L', Type: 'Fruit beverage', Storage: 'Refrigerate after opening' }, priceBias: 6, visualTag: 'DRINK' },
        { name: 'Coconut Water 200 ml', description: 'Hydrating coconut water pack for mid-day refreshment.', specifications: { Volume: '200 ml', Type: 'Natural drink', Storage: 'Serve chilled' }, priceBias: -8, visualTag: 'DRINK' },
        { name: 'Malted Health Drink 500 g', description: 'Nutritional malt beverage powder for milk-based drinks.', specifications: { Weight: '500 g', Type: 'Malt mix', Storage: 'Cool and dry' }, priceBias: 22, visualTag: 'DRINK' },
        { name: 'Instant Coffee 100 g', description: 'Rich coffee granules for quick hot and cold coffee recipes.', specifications: { Weight: '100 g', Type: 'Instant coffee', Storage: 'Cool and dry' }, priceBias: 28, visualTag: 'DRINK' }
      ],
      'Frozen Foods': [
        { name: 'Veg Momos 500 g', description: 'Steamer-ready veg momos for fast evening snacks.', specifications: { Weight: '500 g', Type: 'Frozen snack', Storage: 'Keep frozen' }, priceBias: 20, visualTag: 'FROZEN' },
        { name: 'Green Peas 500 g', description: 'Frozen green peas cleaned and packed for convenient cooking.', specifications: { Weight: '500 g', Type: 'Frozen vegetables', Storage: 'Keep frozen' }, priceBias: 12, visualTag: 'FROZEN' },
        { name: 'French Fries 750 g', description: 'Crispy potato fries ready for bake, air-fry, or deep-fry.', specifications: { Weight: '750 g', Type: 'Frozen snack', Storage: 'Keep frozen' }, priceBias: 16, visualTag: 'FROZEN' },
        { name: 'Aloo Paratha 400 g', description: 'Frozen stuffed paratha with quick heat-and-eat convenience.', specifications: { Weight: '400 g', Type: 'Frozen meal', Storage: 'Keep frozen' }, priceBias: 24, visualTag: 'FROZEN' }
      ],
      'Personal Care': [
        { name: 'Aloe Body Wash 250 ml', description: 'Refreshing body wash with gentle daily cleansing formula.', specifications: { Volume: '250 ml', Type: 'Body wash', Storage: 'Room temperature' }, priceBias: 20, visualTag: 'CARE' },
        { name: 'Herbal Shampoo 340 ml', description: 'Mild shampoo for everyday hair cleansing and scalp care.', specifications: { Volume: '340 ml', Type: 'Shampoo', Storage: 'Room temperature' }, priceBias: 24, visualTag: 'CARE' },
        { name: 'Toothpaste Fresh 200 g', description: 'Fluoride toothpaste supporting cavity protection and freshness.', specifications: { Weight: '200 g', Type: 'Oral care', Storage: 'Cool and dry' }, priceBias: -2, visualTag: 'CARE' },
        { name: 'Bath Soap Combo 4x125 g', description: 'Moisturizing soap combo with long-lasting fragrance.', specifications: { Count: '4 bars', Type: 'Soap', Storage: 'Dry place' }, priceBias: 6, visualTag: 'CARE' }
      ],
      Cleaning: [
        { name: 'Floor Cleaner 1 L', description: 'Concentrated floor cleaner with fresh citrus fragrance.', specifications: { Volume: '1 L', Type: 'Floor cleaner', Storage: 'Room temperature' }, priceBias: 4, visualTag: 'CLEAN' },
        { name: 'Dishwash Gel 750 ml', description: 'Dishwash gel that removes tough grease with less effort.', specifications: { Volume: '750 ml', Type: 'Dishwash', Storage: 'Room temperature' }, priceBias: 3, visualTag: 'CLEAN' },
        { name: 'Laundry Detergent 2 kg', description: 'Low-foam detergent powder suitable for machine and bucket wash.', specifications: { Weight: '2 kg', Type: 'Detergent powder', Storage: 'Cool and dry' }, priceBias: 18, visualTag: 'CLEAN' },
        { name: 'Toilet Cleaner 1 L', description: 'Thick toilet cleaner for stain removal and odor control.', specifications: { Volume: '1 L', Type: 'Toilet cleaner', Storage: 'Room temperature' }, priceBias: 2, visualTag: 'CLEAN' }
      ],
      'Baby Care': [
        { name: 'Diaper Pants Medium 24', description: 'Soft and absorbent diaper pants designed for active babies.', specifications: { Count: '24', Size: 'M', Storage: 'Cool and dry' }, priceBias: 42, visualTag: 'BABY' },
        { name: 'Baby Wipes Aloe 72', description: 'Alcohol-free wipes for gentle cleaning during diaper changes.', specifications: { Count: '72', Type: 'Wet wipes', Storage: 'Seal after use' }, priceBias: 11, visualTag: 'BABY' },
        { name: 'Baby Lotion 200 ml', description: 'Mild lotion formulated to keep baby skin moisturized.', specifications: { Volume: '200 ml', Type: 'Baby lotion', Storage: 'Room temperature' }, priceBias: 17, visualTag: 'BABY' },
        { name: 'Baby Soap 75 g', description: 'Gentle cleansing baby soap for routine bath care.', specifications: { Weight: '75 g', Type: 'Baby soap', Storage: 'Dry place' }, priceBias: 4, visualTag: 'BABY' }
      ]
    };

    const categoryTemplates = templates[category];
    if (!categoryTemplates?.length) {
      return {
        name: `${this.getProductSuffix(category)} ${(index + 1).toString().padStart(4, '0')}`,
        description: `Daily-use ${category.toLowerCase()} item curated for fast delivery and reliable quality.`,
        priceBias: 0,
        visualTag: 'GROCERY'
      };
    }

    return categoryTemplates[index % categoryTemplates.length];
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

  private buildImageUrl(category: string, label: string, visualTag = 'GROCERY'): string {
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
    const shortLabel = label.length > 28 ? `${label.slice(0, 28)}...` : label;
    const safeTag = visualTag.replace(/[^A-Za-z0-9 ]/g, '').slice(0, 12);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="36" fill="${bg}"/><circle cx="510" cy="130" r="72" fill="${circle}" opacity="0.78"/><circle cx="165" cy="520" r="88" fill="${circle}" opacity="0.52"/><rect x="70" y="60" width="158" height="44" rx="22" fill="${circle}" opacity="0.26"/><text x="86" y="89" fill="#19311d" font-family="Arial, sans-serif" font-size="21" font-weight="700">${safeTag}</text><text x="70" y="152" fill="#19311d" font-family="Georgia, serif" font-size="29">${category}</text><text x="70" y="212" fill="#19311d" font-family="Arial, sans-serif" font-size="44" font-weight="700">${shortLabel}</text><text x="70" y="580" fill="#19311d" font-family="Arial, sans-serif" font-size="22" opacity="0.78">Fast delivery grocery catalog</text></svg>`;
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
