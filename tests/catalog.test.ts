import { describe, expect, it } from 'vitest';
import raw from '../data/raw/products.json';
import { allProducts, findProductByVariant, getProduct, productsForConcern } from '../src/lib/catalog.ts';
import { CONCERNS } from '../src/lib/types.ts';

describe('catalog', () => {
  it('returns a product by handle', () => {
    expect(getProduct('pdrn-salmon-dna-serum').title).toBe('PDRN Salmon DNA Vitamin C E Ferulic Serum');
  });

  it('throws on an unknown handle so content typos fail the build', () => {
    expect(() => getProduct('nope')).toThrow('Unknown product: nope');
  });

  it('exposes every product from the raw capture', () => {
    expect(allProducts()).toHaveLength(raw.products.length);
  });

  it('finds a product by variant id', () => {
    expect(findProductByVariant(37732981637275)?.handle).toBe('day-glow-serum');
    expect(findProductByVariant(1)).toBeUndefined();
  });

  it.each(CONCERNS)('surfaces single products for %s, bestsellers first', (concern) => {
    const list = productsForConcern(concern);
    expect(list.length).toBeGreaterThan(0);
    expect(list.length).toBeLessThanOrEqual(4);
    expect(list.every((p) => !p.isBundle && p.concerns.includes(concern) && p.available)).toBe(true);
    const anyBestseller = allProducts().some((p) => !p.isBundle && p.available && p.concerns.includes(concern) && p.isBestseller);
    if (anyBestseller) expect(list[0]!.isBestseller).toBe(true);
  });

  it('orders bestsellers by review count, unrated last', () => {
    const list = productsForConcern('anti-aging', 10);
    const best = list.filter((p) => p.isBestseller).map((p) => p.rating?.count ?? -1);
    expect(best).toEqual([...best].sort((a, b) => b - a));
  });
});
