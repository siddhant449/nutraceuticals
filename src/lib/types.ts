export type Concern = 'anti-aging' | 'brightening' | 'hydration' | 'soothing' | 'acne-pores';

export const CONCERNS: readonly Concern[] = ['anti-aging', 'brightening', 'hydration', 'soothing', 'acne-pores'];

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Rating {
  value: number;
  count: number;
}

export interface Product {
  handle: string;
  title: string;
  type: string;
  tags: string[];
  concerns: Concern[];
  isBundle: boolean;
  isBestseller: boolean;
  variantId: number;
  /** Price in integer cents (USD). */
  price: number;
  /** Compare-at price in cents, or null when absent / not above price. */
  compareAtPrice: number | null;
  available: boolean;
  images: ProductImage[];
  /** Plain-text product description from the store. */
  description: string;
  rating: Rating | null;
  url: string;
}

export interface StoreSnapshot {
  capturedAt: string;
  source: string;
  products: Product[];
}
