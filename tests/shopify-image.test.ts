import { describe, expect, it } from 'vitest';
import { shopifyImage, shopifySrcset } from '../src/lib/shopify-image.ts';

const FILES = 'https://cdn.shopify.com/s/files/1/0527/3806/4539/files/';

describe('shopifyImage', () => {
  it('appends width while keeping the version param', () => {
    expect(shopifyImage(`${FILES}a.jpg?v=17`, 800)).toBe(`${FILES}a.jpg?v=17&width=800`);
  });
  it('replaces an existing width', () => {
    expect(shopifyImage(`${FILES}a.jpg?v=17&width=160`, 800)).toBe(`${FILES}a.jpg?v=17&width=800`);
  });
  it('upgrades protocol-relative URLs', () => {
    expect(shopifyImage('//cdn.shopify.com/s/files/1/0527/3806/4539/files/a.jpg', 400)).toBe(`${FILES}a.jpg?width=400`);
  });
  it('rewrites challenged live-domain file URLs to the CDN', () => {
    expect(shopifyImage('https://seoulceuticals.com/cdn/shop/files/before1.jpg', 600)).toBe(`${FILES}before1.jpg?width=600`);
    expect(shopifyImage('//seoulceuticals.com/cdn/shop/files/x.png?v=2', 300)).toBe(`${FILES}x.png?v=2&width=300`);
  });
});

describe('shopifySrcset', () => {
  it('builds a width-descriptor srcset', () => {
    const u = `${FILES}a.jpg?v=1`;
    expect(shopifySrcset(u, [400, 800])).toBe(`${shopifyImage(u, 400)} 400w, ${shopifyImage(u, 800)} 800w`);
  });
});
