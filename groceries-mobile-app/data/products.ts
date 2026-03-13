export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  sku: string;
  specifications?: Record<string, string>;
};

export type MobileThemePalette = {
  name: string;
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  cardAlt: string;
  border: string;
  muted: string;
  mutedAlt: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  danger: string;
  warning: string;
  success: string;
  badge: string;
  badgeText: string;
  chip: string;
  chipText: string;
  chipActive: string;
  chipActiveText: string;
};

export type MobileProfileConfig = {
  id: string;
  branding: {
    name: string;
    subtitle: string;
    supportEmail: string;
    supportPhone: string;
    supportHours: string;
    serviceArea: string;
    accountName: string;
    accountEmail: string;
    accountPhone: string;
    memberSince: string;
    avatar: string;
  };
  hero: {
    badgePrimary: string;
    badgeSecondary: string;
    title: string;
    subtitle: string;
    aboutTitle: string;
    aboutText: string;
    contactTitle: string;
    contactText: string;
  };
  support: {
    quickTopics: { icon: string; label: string }[];
    tickets: { id: string; title: string; status: 'open' | 'resolved'; updatedAt: string }[];
    searchHint: string;
    contactCta: string;
    contactSecondary: string;
  };
  theme: {
    light: MobileThemePalette;
    dark: MobileThemePalette;
  };
  catalog: {
    seedProducts: Product[];
    generation: {
      minProductCount: number;
      categories: string[];
      brands: string[];
      categorySpecifications: Record<string, Record<string, string>>;
      basePriceStart: number;
      priceStep: number;
      priceModulo: number;
      categoryPriceFactor: number;
      discountEvery: number;
      discountRate: number;
    };
  };
};

const imagePalette = ['#f2a65a', '#7bb661', '#4aa3df', '#e76f51', '#f4d35e', '#8ab17d', '#a56cc1'];

export function buildImageDataUrl(category: string, seed: number, brand = 'Grocer') {
  const accent = imagePalette[seed % imagePalette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="48" fill="#f8faf6"/><rect x="72" y="72" width="496" height="496" rx="36" fill="#ffffff" stroke="#dbe7d8"/><circle cx="476" cy="170" r="64" fill="${accent}" opacity="0.8"/><circle cx="188" cy="470" r="74" fill="${accent}" opacity="0.4"/><text x="96" y="166" fill="#173223" font-family="Arial, sans-serif" font-size="40">${category.toUpperCase()}</text><text x="96" y="224" fill="#173223" font-family="Georgia, serif" font-size="58">${brand}</text><text x="96" y="548" fill="#5d7466" font-family="Arial, sans-serif" font-size="28">Item ${String(seed).padStart(4, '0')}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildProducts(profile: MobileProfileConfig): Product[] {
  const seeds = (profile.catalog.seedProducts || []).map((product, index) => ({
    ...product,
    id: product.id || index + 1,
    image: product.image || buildImageDataUrl(product.category, product.id || index + 1, profile.branding.name),
    inStock: product.inStock !== false,
    rating: product.rating ?? getRating(index),
    reviews: product.reviews ?? getReviews(index),
    specifications: product.specifications ?? profile.catalog.generation.categorySpecifications[product.category],
  }));

  const products = [...seeds];
  const generation = profile.catalog.generation;
  const suffixes = ['Classic', 'Daily Pick', 'Value Pack', 'Prime', 'Fresh Cut', 'Smart Buy', 'Signature', 'Express', 'Reserve', 'Family Pack'];
  const descriptors = ['Freshly packed', 'Daily essential', 'Fast-moving', 'Premium quality', 'Kitchen-ready', 'Popular basket', 'Weekly favorite', 'Top value'];
  let nextId = products.length + 1;
  let index = 0;

  while (products.length < generation.minProductCount) {
    const category = generation.categories[index % generation.categories.length];
    const brand = generation.brands[index % generation.brands.length];
    const suffix = suffixes[index % suffixes.length];
    const basePrice = generation.basePriceStart + ((index * generation.priceStep) % generation.priceModulo);
    const price = Math.round(basePrice + category.length * generation.categoryPriceFactor);
    const discounted = generation.discountEvery > 0 && nextId % generation.discountEvery === 0;
    const originalPrice = discounted ? Math.round(price * (1 + generation.discountRate)) : undefined;
    const name = `${brand} ${category} ${suffix} ${String(nextId).padStart(4, '0')}`;

    products.push({
      id: nextId,
      name,
      description: `${descriptors[index % descriptors.length]} ${category.toLowerCase()} from ${brand}.`,
      price,
      originalPrice,
      image: buildImageDataUrl(category, nextId, profile.branding.name),
      category,
      inStock: nextId % 11 !== 0,
      rating: getRating(index + 5),
      reviews: getReviews(index + 11),
      sku: `${brand.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${category.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(nextId).padStart(4, '0')}`,
      specifications: generation.categorySpecifications[category] ?? { Pack: 'Standard', Storage: 'Room temperature' },
    });

    nextId += 1;
    index += 1;
  }

  return products;
}

export function buildCategories(products: Product[]) {
  return Array.from(new Set(products.map((product) => product.category)));
}

function getRating(seed: number) {
  return Number((4.1 + (seed % 8) * 0.1).toFixed(1));
}

function getReviews(seed: number) {
  return 240 + ((seed * 173) % 4200);
}
