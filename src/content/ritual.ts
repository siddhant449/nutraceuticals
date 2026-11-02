/**
 * Daily ritual — steps, timing labels, notes and the retinol caution are the live homepage's own copy
 * ("The daily routine", captured 2026-11-02). Do not add steps or change usage guidance here without
 * checking the product packaging.
 *
 * Imagery: steps 01–02 use the live ritual art (sc-ritual-step-1/2.png). The live step-3 art
 * (sc-ritual-step-3.png) pictures Snail Eye Cream, not the named Snail Repair Cream, so step 03
 * uses the Snail Repair Cream packshot instead (tested).
 */
import type { ProductImage } from '../lib/types.ts';
import { asset } from './site.ts';

export type RitualTime = 'AM' | 'PM';

export interface RitualStep {
  n: string;
  when: RitualTime[];
  verb: string;
  handle: string;
  note: string;
  caution?: string;
  image: ProductImage;
  /** CSS object-position + scale for the art-directed crop */
  focus: string;
  zoom?: number;
}

export const ritualIntro = {
  label: 'The daily routine',
  headline: { lead: 'Morning glow,', accent: 'midnight repair.' },
  body: 'Three formulas, one routine. Not a ten-step ritual to remember.',
  cta: { label: 'Shop routines & bundles', href: 'https://seoulceuticals.com/collections/bundles' },
  times: {
    AM: { label: 'Morning', caption: 'Three steps to start the day.' },
    PM: { label: 'Night', caption: 'Two steps before sleep.' },
  },
} as const;

export const ritual: RitualStep[] = [
  {
    n: '01',
    when: ['AM'],
    verb: 'Wake',
    handle: 'day-glow-serum',
    note: 'Vitamin C paired with ferulic acid to brighten tone and shield skin before the day starts.',
    image: asset('sc-ritual-step-1.png', 693, 560, 'Day Glow Vitamin C Serum bottle and dropper on a peach background'),
    focus: '38% 50%',
  },
  {
    n: '02',
    when: ['AM', 'PM'],
    verb: 'Treat',
    handle: 'marine-mineral-plump-glow-essence',
    note: 'A marine-mineral essence that layers lightweight hydration under whatever active you’re treating with.',
    image: asset('sc-ritual-step-2.png', 693, 560, 'Marine Mineral Plump & Glow Essence spray bottle on a lavender background'),
    focus: '55% 50%',
  },
  {
    n: '03',
    when: ['AM', 'PM'],
    verb: 'Repair',
    handle: 'multi-function-all-in-one-anti-aging-snail-repair-cream',
    note: 'Snail mucin and retinol, with centella and green tea, to repair and smooth.',
    caution: 'Contains retinol: wear SPF by day and don’t stack another retinol.',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0527/3806/4539/files/SeoulCeuticals_Snail_Repair_Cream.png?v=1786913491',
      width: 4096,
      height: 4096,
      alt: 'Snail Repair Cream Moisturizer jar',
    },
    focus: '50% 55%',
    zoom: 1.15,
  },
];

export function stepsFor(time: RitualTime): RitualStep[] {
  return ritual.filter((s) => s.when.includes(time));
}

export const whenLabel = (step: RitualStep): string => step.when.join(' + ');
