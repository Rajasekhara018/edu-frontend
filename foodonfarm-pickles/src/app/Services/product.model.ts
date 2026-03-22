export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  featured?: boolean;
  weightOptions: string[];
  collectionSlugs?: string[];
}
