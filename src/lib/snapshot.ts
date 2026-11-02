/**
 * Normalizes the store's public /products.json into the snapshot the site renders from.
 * Dependency-free and type-only imports so `node scripts/build-snapshot.mjs` can load it
 * directly via Node's TypeScript type stripping.
 */
import type { Concern, Product, ProductImage, Rating, StoreSnapshot } from './types.ts';

const STORE = 'https://seoulceuticals.com';
const CONCERN_SET = new Set<string>(['anti-aging', 'brightening', 'hydration', 'soothing', 'acne-pores']);

interface RawVariant {
  id: number;
  price: string;
  compare_at_price: string | null;
  available: boolean;
}
interface RawImage {
  src: string;
  width: number;
  height: number;
  alt?: string | null;
}
interface RawProduct {
  handle: string;
  title: string;
  product_type: string;
  tags: string[];
  body_html: string | null;
  variants: RawVariant[];
  images: RawImage[];
}

export function toCents(price: string): number {
  return Math.round(Number.parseFloat(price) * 100);
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…', reg: '®', trade: '™', deg: '°',
};

export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/li|\/h\d|\/div|\/ul|\/ol|\/tr)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

function httpsUrl(src: string): string {
  return src.startsWith('//') ? `https:${src}` : src;
}

function normalizeProduct(raw: RawProduct, ratings: Record<string, Rating>): Product {
  const variant = raw.variants.find((v) => v.available) ?? raw.variants[0];
  if (!variant) throw new Error(`Product without variants: ${raw.handle}`);
  const price = toCents(variant.price);
  const compare = variant.compare_at_price ? toCents(variant.compare_at_price) : null;
  const images: ProductImage[] = raw.images.map((img) => ({
    src: httpsUrl(img.src),
    width: img.width,
    height: img.height,
    alt: img.alt?.trim() || raw.title,
  }));
  return {
    handle: raw.handle,
    title: raw.title,
    type: raw.product_type,
    tags: raw.tags,
    concerns: raw.tags
      .filter((t) => t.startsWith('concern:') && CONCERN_SET.has(t.slice(8)))
      .map((t) => t.slice(8) as Concern),
    isBundle: raw.product_type.toLowerCase() === 'bundle',
    isBestseller: raw.tags.some((t) => t.toLowerCase() === 'bestseller'),
    variantId: variant.id,
    price,
    compareAtPrice: compare !== null && compare > price ? compare : null,
    available: raw.variants.some((v) => v.available),
    images,
    description: htmlToText(raw.body_html ?? ''),
    rating: ratings[raw.handle]?.count ? ratings[raw.handle]! : null,
    url: `${STORE}/products/${raw.handle}`,
  };
}

export function normalizeProducts(
  raw: { products: unknown[] },
  ratings: Record<string, Rating>,
  capturedAt: string,
): StoreSnapshot {
  return {
    capturedAt,
    source: `${STORE}/products.json`,
    products: (raw.products as RawProduct[]).map((p) => normalizeProduct(p, ratings)),
  };
}
