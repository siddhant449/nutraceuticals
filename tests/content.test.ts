import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getProduct, productsForConcern } from '../src/lib/catalog.ts';
import * as site from '../src/content/site.ts';
import * as home from '../src/content/home.ts';
import { formulaIntro, pairings } from '../src/content/formula.ts';
import { concerns, concernsIntro } from '../src/content/concerns.ts';
import { ritual, ritualIntro, stepsFor } from '../src/content/ritual.ts';
import { beforeAfters, resultsIntro, reviews } from '../src/content/results.ts';
import homeCapture from '../data/raw/home.json';

function deepStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => deepStrings(v, out));
  else if (value && typeof value === 'object' && typeof value !== 'function') {
    Object.values(value as Record<string, unknown>).forEach((v) => deepStrings(v, out));
  }
  return out;
}

const BANNED =
  /korean[- ]owned|korean-made|made in korea|clinically (proven|tested)|money[- ]back|guarantee|first to|dermatologist|hypoallergenic|non-comedogenic|pregnan|\bcures?\b/i;

describe('content references real products', () => {
  const handles = [
    ...pairings.map((p) => p.productHandle),
    ...ritual.map((s) => s.handle),
    ...reviews.map((r) => r.productHandle),
    ...home.flagshipHandles,
    home.closing.productHandle,
  ];
  it.each(handles)('%s exists in the snapshot', (h) => {
    expect(() => getProduct(h)).not.toThrow();
  });
});

describe('formula pairings are substantiated by the product description', () => {
  it('has four pairings', () => {
    expect(pairings).toHaveLength(4);
  });
  it('follows the About page "industry firsts" order', () => {
    expect(pairings.map((p) => p.id)).toEqual(['pdrn-vitamin-c', 'snail-retinol', 'snail-volufiline', 'centella-kojic']);
  });
  it.each(pairings.map((p) => [p.id, p] as const))('%s', (_id, p) => {
    const description = getProduct(p.productHandle).description.toLowerCase();
    for (const keyword of p.keywords) {
      const inDescription = description.includes(keyword.toLowerCase());
      const onLabel = p.labelEvidence?.lists.map((k) => k.toLowerCase()).includes(keyword.toLowerCase()) ?? false;
      expect(inDescription || onLabel, `${keyword} must be in the description or documented label evidence`).toBe(true);
    }
  });
  it('documents a source for any label evidence', () => {
    pairings.filter((p) => p.labelEvidence).forEach((p) => expect(p.labelEvidence!.source.length).toBeGreaterThan(10));
  });
  it('shows the brand render for every pairing', () => {
    pairings.forEach((p) => expect(p.render.src).toMatch(/sc-first-.+\.png$/));
  });
  it('labels every heritage ingredient as sourced from South Korea', () => {
    pairings.forEach((p) => expect(p.heritage.origin).toBe('Sourced from South Korea'));
  });
});

describe('ritual', () => {
  it('shows three steps in the morning and two at night', () => {
    expect(stepsFor('AM').map((s) => s.n)).toEqual(['01', '02', '03']);
    expect(stepsFor('PM').map((s) => s.n)).toEqual(['02', '03']);
  });
  it('pictures the named product on every step (live sc-ritual-step-3.png shows Snail Eye Cream, not Snail Repair Cream)', () => {
    ritual.forEach((s) => expect(s.image.src).toMatch(/^https:\/\/cdn\.shopify\.com\//));
    expect(ritual.map((s) => s.image.src).join(' ')).not.toContain('sc-ritual-step-3');
    expect(ritual.find((s) => s.n === '03')?.image.src).toContain('Snail_Repair_Cream');
  });
  it('keeps the retinol + SPF guidance on the repair step', () => {
    expect(ritual.find((s) => s.handle === 'multi-function-all-in-one-anti-aging-snail-repair-cream')?.caution).toMatch(/SPF/);
  });
});

describe('concerns', () => {
  it('maps the five live concerns', () => {
    expect(concerns.map((c) => c.id)).toEqual(['brightening', 'anti-aging', 'hydration', 'soothing', 'acne-pores']);
  });
  it.each(concerns.map((c) => c.id))('%s surfaces products', (id) => {
    expect(productsForConcern(id).length).toBeGreaterThan(0);
  });
});

describe('results', () => {
  it('uses the four live before/after pairs from the Shopify CDN', () => {
    expect(beforeAfters).toHaveLength(4);
    beforeAfters.forEach((b) => {
      expect(b.before.src).toMatch(/^https:\/\/cdn\.shopify\.com\//);
      expect(b.after.src).toMatch(/^https:\/\/cdn\.shopify\.com\//);
    });
  });
  it('only uses reviews published on the live homepage', () => {
    expect(reviews.map((r) => r.name)).toEqual(['Joe', 'Drea', 'Natalie', 'Paige']);
  });
  it('labels a review "Verified" only when the live site does', () => {
    const verified = new Set(homeCapture.reviews.filter((r) => /verified/i.test(r.label ?? '')).map((r) => r.name));
    reviews.forEach((r) => expect(r.label === 'Verified review', r.name).toBe(verified.has(r.name)));
  });
});

describe('promise and closing (live sections)', () => {
  it('keeps the live promise headline', () => {
    expect(`${home.promise.headline.lead} ${home.promise.headline.accent}`).toBe('Great skincare shouldn’t make you choose a side.');
  });
  it('drops the unverified "proven" and "started the movement" wording', () => {
    expect(home.promise.body).not.toMatch(/proven|started the/i);
    expect(home.closing.reasons.join(' ')).not.toMatch(/^Visibly/);
  });
  it('sends the closing CTA to the PDRN bundle', () => {
    expect(getProduct(home.closing.productHandle).title).toBe('PDRN Youthful Dewy Glow Routine');
  });
});

describe('claims lint', () => {
  const strings = deepStrings({ site, home, pairings, formulaIntro, concerns, concernsIntro, ritual, ritualIntro, reviews, resultsIntro });
  it('collects content strings', () => {
    expect(strings.length).toBeGreaterThan(50);
  });
  it('contains no unapproved claims', () => {
    const offenders = strings.filter((s) => BANNED.test(s));
    expect(offenders).toEqual([]);
  });
  it('uses no em or en dashes in copy (house style)', () => {
    expect(strings.filter((s) => /[—–]/.test(s))).toEqual([]);
  });
  it('uses no em or en dashes in component markup outside comments', () => {
    const files = readdirSync('src/components', { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.astro'))
      .map((f) => join('src/components', f));
    const offenders = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      return /[—–]/.test(text) ? [file] : [];
    });
    expect(offenders).toEqual([]);
  });
  it('never calls the brand Korean-made and states US manufacturing', () => {
    const all = strings.join(' ');
    expect(all).toMatch(/2016/);
    expect(all).toMatch(/manufactured in the United States|made in America|made in the U\.?S/i);
  });
});
