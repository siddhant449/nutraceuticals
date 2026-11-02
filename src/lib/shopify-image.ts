/** The store's file CDN. Live-domain /cdn/shop/files URLs sit behind a Cloudflare challenge. */
export const SHOPIFY_FILES = 'https://cdn.shopify.com/s/files/1/0527/3806/4539/files/';

const LIVE_FILES = /^(?:https?:)?\/\/seoulceuticals\.com\/cdn\/shop\/files\//;

export function shopifyImage(src: string, width: number): string {
  const absolute = src.replace(LIVE_FILES, SHOPIFY_FILES).replace(/^\/\//, 'https://');
  const url = new URL(absolute);
  url.searchParams.set('width', String(width));
  return url.toString();
}

export function shopifySrcset(src: string, widths: number[]): string {
  return widths.map((w) => `${shopifyImage(src, w)} ${w}w`).join(', ');
}
