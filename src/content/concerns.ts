/**
 * Shop-by-concern mapping. Labels and collection links are the live site's own (homepage "Shop by
 * skin concern"); the products shown come from each product's `concern:*` tag in the store snapshot.
 */
import type { Concern, ProductImage } from '../lib/types.ts';
import { asset, live } from './site.ts';

export interface ConcernEntry {
  id: Concern;
  label: string;
  intro: string;
  collectionUrl: string;
  image: ProductImage;
}

export const concernsIntro = {
  label: 'Start where it matters',
  headline: { lead: 'Shop by', accent: 'skin concern.' },
  body: 'Choose what you want to focus on and we’ll show the formulas tagged for it.',
  disclaimer: 'For product discovery only. Not a diagnosis or medical advice. If your skin is reactive, patch test first.',
} as const;

export const concerns: ConcernEntry[] = [
  {
    id: 'brightening',
    label: 'Dark spots & uneven tone',
    intro: 'Vitamin C, kojic acid and PDRN formulas, chosen for the look of dark spots and uneven tone.',
    collectionUrl: live('/collections/brightening'),
    image: asset('collection1.jpg', 1208, 1500, 'Woman applying Day Glow Vitamin C Serum with a dropper'),
  },
  {
    id: 'anti-aging',
    label: 'Fine lines & firmness',
    intro: 'Snail mucin, retinol and vitamin C formulas for the look of fine lines, texture and firmness.',
    collectionUrl: live('/collections/anti-aging'),
    image: asset('collection2.jpg', 1208, 1500, 'Woman holding the Ultra Snail + Volufiline Serum against her cheek'),
  },
  {
    id: 'hydration',
    label: 'Glass skin & glow',
    intro: 'Snail filtrate, marine minerals and layered hyaluronic acid for a dewy, hydrated look.',
    collectionUrl: live('/collections/hydration'),
    image: asset('collection3.jpg', 1208, 1500, 'Woman misting her face with Marine Mineral Plump & Glow Essence'),
  },
  {
    id: 'soothing',
    label: 'Dry, sensitive & reactive',
    intro: 'Snail mucin, green tea and niacinamide formulas for skin that feels dry or stressed.',
    collectionUrl: live('/collections/soothing'),
    image: asset('collection4.jpg', 1208, 1500, 'Woman applying Snail Repair Cream to her cheek'),
  },
  {
    id: 'acne-pores',
    label: 'Breakouts & clogged pores',
    intro: 'Willow-bark salicylic acid, gentle exfoliating acids and clay for the look of clogged pores.',
    collectionUrl: live('/collections/acne-pores'),
    image: asset('collection5.jpg', 1208, 1500, 'Woman applying Miracle Clear Skin Serum with a dropper'),
  },
];
