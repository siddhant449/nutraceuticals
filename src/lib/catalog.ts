import snapshot from '../data/store.snapshot.json';
import type { Concern, Product, StoreSnapshot } from './types.ts';

const data = snapshot as StoreSnapshot;
const byHandle = new Map(data.products.map((p) => [p.handle, p]));
const byVariant = new Map(data.products.map((p) => [p.variantId, p]));

export const snapshotMeta = { capturedAt: data.capturedAt, source: data.source } as const;

export function allProducts(): Product[] {
  return data.products;
}

export function getProduct(handle: string): Product {
  const product = byHandle.get(handle);
  if (!product) throw new Error(`Unknown product: ${handle}`);
  return product;
}

export function findProductByVariant(id: number): Product | undefined {
  return byVariant.get(id);
}

/** Single, in-stock products for a concern: bestsellers first, then by review count (unrated last). */
export function productsForConcern(concern: Concern, limit = 4): Product[] {
  return data.products
    .filter((p) => !p.isBundle && p.available && p.concerns.includes(concern))
    .sort(
      (a, b) =>
        Number(b.isBestseller) - Number(a.isBestseller) || (b.rating?.count ?? -1) - (a.rating?.count ?? -1),
    )
    .slice(0, limit);
}
