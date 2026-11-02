/**
 * The Formula chapter — the four ingredient pairings from /pages/about-us ("Industry firsts"),
 * each naming the one product that contains both. Every `note` paraphrases that product's store
 * description. `keywords` are checked by tests/content.test.ts against the description; a keyword
 * the description omits must be backed by documented `labelEvidence` from the brand's own packaging.
 */
import type { ProductImage } from '../lib/types.ts';
import { asset } from './site.ts';

export interface Ingredient {
  name: string;
  detail?: string;
  kind: 'heritage' | 'active';
  origin?: 'Sourced from South Korea';
  note: string;
  /** Art-direction tint for the droplet visual. */
  tint: string;
}

export interface Pairing {
  id: string;
  heritage: Ingredient;
  active: Ingredient;
  productHandle: string;
  keywords: [string, string];
  labelEvidence?: { source: string; lists: string[] };
  formulaNote: string;
  /** Transparent brand render used on the About page. */
  render: ProductImage;
}

const KOREA = 'Sourced from South Korea' as const;

export const formulaIntro = {
  label: 'The formula',
  headline: { lead: 'Ingredient heritage meets', accent: 'contemporary formulation.' },
  body: 'Four formulas, four pairings. Each joins an ingredient sourced from South Korea with a modern active, shown exactly as they appear in the named product.',
  footnote: 'Each pairing is specific to the product named. Not every formula contains every ingredient.',
} as const;

export const pairings: Pairing[] = [
  {
    id: 'pdrn-vitamin-c',
    heritage: {
      name: 'PDRN',
      detail: 'Salmon DNA',
      kind: 'heritage',
      origin: KOREA,
      note: 'A polynucleotide included to support the look of skin renewal, elasticity and texture.',
      tint: '#E9A88F',
    },
    active: {
      name: 'Vitamin C',
      kind: 'active',
      note: 'Helps visibly brighten skin and even the look of tone, with ferulic acid for stability.',
      tint: '#E7B65C',
    },
    productHandle: 'pdrn-salmon-dna-serum',
    keywords: ['PDRN', 'Vitamin C'],
    formulaNote: 'PDRN and vitamin C in one serum, with ferulic acid, hyaluronic acid and centella asiatica.',
    render: asset('sc-first-pdrn.png', 800, 800, 'PDRN + Vitamin C Serum bottle'),
  },
  {
    id: 'snail-retinol',
    heritage: {
      name: 'Snail mucin',
      detail: '97.5% snail filtrate',
      kind: 'heritage',
      origin: KOREA,
      note: 'Used at 97.5% concentration to soothe and replenish alongside the actives.',
      tint: '#E8E6DE',
    },
    active: {
      name: 'Retinol',
      detail: 'In liposomes',
      kind: 'active',
      note: 'Delivered in liposomes and paired with bakuchiol for a gentler approach to retinol.',
      tint: '#E3C77A',
    },
    productHandle: 'ultra-retinol-serum',
    keywords: ['retinol', 'snail'],
    formulaNote: 'Retinol liposomes, bakuchiol and 97.5% snail filtrate, with hyaluronic acid.',
    render: asset('sc-first-retinol.png', 800, 800, 'Ultra Retinol Night Serum bottle'),
  },
  {
    id: 'snail-volufiline',
    heritage: {
      name: 'Snail mucin',
      detail: '97.5% snail filtrate',
      kind: 'heritage',
      origin: KOREA,
      note: 'Hydrates and softens for smoother-looking skin.',
      tint: '#E8E6DE',
    },
    active: {
      name: 'Volufiline®',
      detail: '5%',
      kind: 'active',
      note: 'Included to help improve the look of fullness and plumpness.',
      tint: '#A5AD93',
    },
    productHandle: 'volufiline-snail-mucin-serum',
    keywords: ['volufiline', 'snail'],
    formulaNote: 'Volufiline® and snail filtrate, with hyaluronic acid in four forms and cica.',
    render: asset('sc-first-volufiline.png', 800, 800, 'Ultra Snail + Volufiline Serum bottle'),
  },
  {
    id: 'centella-kojic',
    heritage: {
      name: 'Centella asiatica',
      detail: 'Cica',
      kind: 'heritage',
      origin: KOREA,
      note: 'A traditional Korean skincare botanical, listed as cica on the cream’s label.',
      tint: '#8E9A7A',
    },
    active: {
      name: 'Kojic acid',
      kind: 'active',
      note: 'Included to target the look of dark spots and uneven pigment.',
      tint: '#F1E3C6',
    },
    productHandle: 'ultra-brightening-kojic-acid-cream',
    keywords: ['kojic', 'cica'],
    labelEvidence: {
      source: 'Product label in the brand render sc-first-kojic.png (About page, “Centella Asiatica + Kojic Acid”), captured 2026-11-02',
      lists: ['cica'],
    },
    formulaNote: 'Kojic acid with niacinamide and licorice root, plus cica, in a night cream.',
    render: asset('sc-first-kojic.png', 800, 800, 'Ultra Brightening Kojic Acid Cream jar'),
  },
];
