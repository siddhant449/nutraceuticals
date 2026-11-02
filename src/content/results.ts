/**
 * Customer results. Photos and quotes are exactly those published on the live homepage
 * (data/raw/home.json, captured 2026-11-02). Do not add or edit customer content here.
 */
import type { ProductImage } from '../lib/types.ts';
import { asset } from './site.ts';

export interface BeforeAfter {
  id: string;
  before: ProductImage;
  after: ProductImage;
}

export interface Review {
  name: string;
  text: string;
  /** Only when the live site labels the review as verified. */
  label?: 'Verified review';
  productHandle: string;
  source: string;
}

const SOURCE = 'seoulceuticals.com homepage, captured 2026-11-02';

export const resultsIntro = {
  label: 'See the transformation',
  headline: { lead: 'Real customers,', accent: 'real photos.' },
  body: 'Before-and-after photos shared by customers on seoulceuticals.com.',
  disclosure: 'Customer-submitted photos, shown as published on seoulceuticals.com. Individual experiences vary.',
} as const;

/** Red serum-gel macro texture from the live homepage quote band (sc-quote). Decorative. */
export const quoteTexture = asset('sc-quote-texture.jpg', 3106, 2000, '');
export const featuredReviewName = 'Paige';

const pair = (id: string, before: string, after: string, w: number, hb: number, ha = hb): BeforeAfter => ({
  id,
  before: asset(before, w, hb, `Customer photo ${id}, before`),
  after: asset(after, w, ha, `Customer photo ${id}, after`),
});

export const beforeAfters: BeforeAfter[] = [
  pair('1', 'before1.jpg', 'after1.jpg', 1000, 1000),
  pair('2', 'before-2.jpg', 'after-2.jpg', 1000, 1000),
  pair('3', 'sc-ba-1-before.png', 'sc-ba-1-after.png', 1194, 1154, 1157),
  pair('4', 'before-3.jpg', 'after-3.jpg', 1000, 1000),
];

export const reviews: Review[] = [
  {
    name: 'Joe',
    text: 'More even tone, fewer lines, and people keep commenting on my skin.',
    label: 'Verified review',
    productHandle: 'pdrn-snail-mucin-cream',
    source: SOURCE,
  },
  {
    name: 'Drea',
    text: 'After a few uses my skin was actually glowing. I ordered a second bottle before I finished the first.',
    label: 'Verified review',
    productHandle: 'miracle-clear-snail-mucin-cleanser',
    source: SOURCE,
  },
  {
    name: 'Natalie',
    text: 'Unlike other vitamin C serums, this doesn’t go tacky. Light, even, easy to layer under everything else.',
    label: 'Verified review',
    productHandle: 'pdrn-salmon-dna-serum',
    source: SOURCE,
  },
  {
    name: 'Paige',
    text: 'It really improved my 74-year-old complexion in such a short space of time.',
    productHandle: 'pdrn-salmon-dna-serum',
    source: SOURCE,
  },
];
