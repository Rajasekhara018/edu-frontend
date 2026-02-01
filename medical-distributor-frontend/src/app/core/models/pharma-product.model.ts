export interface PharmaProduct {
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
  manufacturer: string;
  pack: string;
  prescriptionRequired?: boolean;
  specifications?: Record<string, string>;
}
