import { describe, expect, it } from 'vitest';
import rawFixture from './fixtures/day-glow-serum.raw.json';
import { htmlToText, normalizeProducts, toCents } from '../src/lib/snapshot.ts';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

describe('toCents', () => {
  it('converts Shopify price strings to integer cents', () => {
    expect(toCents('19.98')).toBe(1998);
    expect(toCents('108.91')).toBe(10891);
    expect(toCents('37')).toBe(3700);
  });
});

describe('htmlToText', () => {
  it('strips tags and decodes common entities', () => {
    expect(htmlToText('<p>Vitamin C &amp; <b>E</b></p>')).toBe('Vitamin C & E');
  });
  it('turns block boundaries into spaces and collapses whitespace', () => {
    expect(htmlToText('<p>One</p><p>Two&nbsp;three</p>\n<ul><li>Four</li></ul>')).toBe('One Two three Four');
  });
});

describe('normalizeProducts', () => {
  const snap = normalizeProducts(
    { products: [rawFixture] },
    { 'day-glow-serum': { value: 4.5, count: 1938 } },
    '2026-11-02',
  );
  const p = snap.products[0]!;

  it('keeps snapshot metadata', () => {
    expect(snap.capturedAt).toBe('2026-11-02');
    expect(snap.source).toBe('https://seoulceuticals.com/products.json');
  });

  it('normalizes the commerce fields', () => {
    expect(p).toMatchObject({
      handle: 'day-glow-serum',
      title: 'Day Glow Vitamin C Serum',
      type: 'Serum',
      variantId: 37732981637275,
      price: 1998,
      compareAtPrice: 2299,
      available: true,
      isBestseller: true,
      isBundle: false,
      concerns: ['anti-aging', 'brightening'],
      rating: { value: 4.5, count: 1938 },
      url: 'https://seoulceuticals.com/products/day-glow-serum',
      description: 'Vitamin C & ferulic acid.',
    });
  });

  it('uses the product title as image alt and forces https', () => {
    expect(p.images[0]!.alt).toBe('Day Glow Vitamin C Serum');
    expect(p.images[1]!.src.startsWith('https://cdn.shopify.com/')).toBe(true);
    expect(p.images[0]!.width).toBeGreaterThan(0);
  });

  it('drops a compare-at price that is missing or not above the price', () => {
    const noCompare = clone(rawFixture);
    noCompare.variants[0]!.compare_at_price = null as unknown as string;
    const same = clone(rawFixture);
    same.variants[0]!.compare_at_price = '19.98';
    const out = normalizeProducts({ products: [noCompare, same] }, {}, 'x');
    expect(out.products[0]!.compareAtPrice).toBeNull();
    expect(out.products[1]!.compareAtPrice).toBeNull();
  });

  it('leaves rating null for an unrated product', () => {
    const out = normalizeProducts({ products: [rawFixture] }, {}, 'x');
    expect(out.products[0]!.rating).toBeNull();
  });

  it('drops a rating with no reviews', () => {
    const out = normalizeProducts({ products: [rawFixture] }, { 'day-glow-serum': { value: 0, count: 0 } }, 'x');
    expect(out.products[0]!.rating).toBeNull();
  });

  it('flags bundles by product type', () => {
    const bundle = clone(rawFixture);
    bundle.product_type = 'Bundle';
    expect(normalizeProducts({ products: [bundle] }, {}, 'x').products[0]!.isBundle).toBe(true);
  });
});
