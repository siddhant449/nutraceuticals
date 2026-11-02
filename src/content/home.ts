/**
 * Homepage editorial copy. Brand copy follows the master brief's approved lines; facts come from
 * seoulceuticals.com (/pages/about-us and the homepage FAQ), captured 2026-11-02.
 * FAQ answers are verbatim where used. Omitted pending brand/legal sign-off (see docs/QA.md):
 * sensitive-skin suitability, results timeframe, comparative efficacy, "cruelty-free".
 */
import { asset, live } from './site.ts';

/**
 * Hero: "formula surface". A macro of real SeoulCeuticals cream texture with the brand's snail
 * still life (a garden snail on Snail Eye Cream beside an open jar, live homepage asset) in the
 * stage below the headline: snail mucin, the signature Korean-sourced ingredient, alive on the
 * product. Two real product renders float in soft focus. Every product shown is real and current.
 */
export const hero = {
  eyebrow: ['Korean-inspired formulas', 'Modern actives'],
  index: 'N° 01 · Snail mucin',
  headline: { lead: 'Skincare,', accent: 'reformulated.' },
  body: 'Korean-inspired ingredients meet modern skincare actives in thoughtfully formulated essentials for your daily ritual.',
  primary: { label: 'Explore the formulas', href: '#formula' },
  secondary: { label: 'Shop bestsellers', href: '#bestsellers' },
  surface: asset('sc-closer-bg.jpg', 2731, 4096, ''),
  product: asset(
    'sc-snail-banner-product.png',
    3376,
    1838,
    'A garden snail resting on a jar of SeoulCeuticals Snail Eye Cream beside an open jar of the cream',
  ),
  satellites: [
    asset('sc-first-pdrn.png', 800, 800, ''),
    asset('sc-first-retinol.png', 800, 800, ''),
  ],
  featuredHandle: 'snail-eye-cream',
} as const;

export const philosophy = {
  label: 'Our approach',
  headline: { lead: 'Korean-inspired ingredients.', accent: 'Modern skincare science.' },
  body: 'We bring together ingredients rooted in Korean skincare traditions and carefully selected cosmetic actives to make thoughtful, effective-feeling routines more accessible.',
  pillars: ['Potent', 'Pure', 'Effective', 'Affordable'],
  skin: asset('collection4.jpg', 1208, 1500, 'Close-up of freckled skin as a woman applies Snail Repair Cream'),
  formula: asset('sc-closer-bg.jpg', 2731, 4096, 'Macro view of a white cream texture'),
} as const;

export const flagship = {
  label: 'The flagship line',
  headline: { lead: 'Multiple actives,', accent: 'never just one.' },
  body: 'The formulas customers come back for, each one built on more than a single hero ingredient.',
  cta: { label: 'Shop all bestsellers', href: live('/collections/bestsellers') },
} as const;

export const flagshipHandles = [
  'day-glow-serum',
  'multi-function-all-in-one-anti-aging-snail-repair-cream',
  'pdrn-salmon-dna-serum',
  'volufiline-snail-mucin-serum',
  'snail-eye-cream',
] as const;

export const brandStory = {
  label: 'Our story',
  headline: { lead: 'Korean-inspired,', accent: 'transparently made.' },
  intro:
    'SeoulCeuticals was founded with deep respect for Korean skincare heritage, and with one goal: to make its traditions and ingredients accessible to a wider audience.',
  ledger: [
    {
      n: '01',
      title: 'Founded in the U.S. in 2016',
      body: 'A Korean-inspired skincare brand that merges respected cosmetic actives with traditional Korean ingredients.',
    },
    {
      n: '02',
      title: 'Inspired by Korean skincare heritage',
      body: 'Gentle formulations and the thoughtful layering of ingredients that support long-term skin health.',
    },
    {
      n: '03',
      title: 'Select ingredients sourced from South Korea',
      body: 'Snail mucin, panax ginseng extract, rice bran, PDRN and centella asiatica come from Korean suppliers with long histories in these materials.',
    },
    {
      n: '04',
      title: 'Formulas manufactured in the United States',
      body: 'Every SeoulCeuticals product is made in America, where those ingredients meet modern cosmetic actives.',
    },
    {
      n: '05',
      title: 'Developed with Korean skincare expertise',
      body: 'Product Development Consultant Ella Cho began her career working with Korean beauty formulations in Korea.',
    },
  ],
  cta: { label: 'Discover our story', href: live('/pages/about-us') },
  stillLife: asset(
    'hf_20260810_230201_53ebb4cc-4120-466d-b569-a0668d453ba8.png',
    4096,
    4096,
    'Korean ginseng roots, rice grains and centella leaves beside a spoon of clear gel on a wooden board',
  ),
  portrait: asset('Ella-Cho_12b3e90d-afa3-4e7c-a68d-878b587fa52e.jpg', 2000, 2000, 'Ella Cho, SeoulCeuticals Product Development Consultant'),
  snail: asset('sc-snail-banner-product.png', 3376, 1838, 'A garden snail resting on an open jar of SeoulCeuticals Snail Eye Cream'),
} as const;

export const faq = {
  label: 'Good to know',
  headline: { lead: 'Questions,', accent: 'answered.' },
  items: [
    {
      q: 'Are your formulations really Korean?',
      a: 'Our formulas are Korean-inspired. Seoul Ceuticals was founded in the U.S. in 2016 and our products are made in America, with ingredients sourced directly from South Korea: traditional ones used in Korean skincare for centuries, like Cica, Korean Ginseng, Rice Bran, Green Tea, Honey, Propolis, Safflower and Sea Minerals.',
    },
    {
      q: 'Which ingredients come from South Korea?',
      a: 'Our snail mucin, panax ginseng extract, rice bran, PDRN and centella asiatica all come from Korean suppliers with long histories in these materials. We work closely with our Korean partners on the authenticity and integrity of every batch.',
    },
    {
      q: 'I’m new to K-Beauty. Where do I start?',
      a: 'Start with the PDRN Bundle. It’s 3 formulas (serum, cream and eye cream) built to work as one simple routine, so you get the combination approach without piecing together 5 separate products. Once you know what your skin responds to, our Shop by Concern page will point you toward what to add next.',
    },
    {
      q: 'Is snail mucin vegan?',
      a: 'It isn’t vegan, since it’s an animal-derived ingredient. If you’re building a fully vegan routine, choose formulas without snail mucin, PDRN (salmon DNA), honey, propolis or royal jelly.',
    },
  ],
  more: { label: 'Still unsure? Contact us', href: live('/pages/contact') },
} as const;

/**
 * Our promise: the live homepage's "Our promise" section (sc-promise), captured 2026-11-02.
 * Headline verbatim. Body keeps the live structure but drops two unverified claims
 * ("started the glass skin movement", "clinical active that's proven"); see docs/QA.md.
 */
export const promise = {
  label: 'Our promise',
  headline: { lead: 'Great skincare shouldn’t', accent: 'make you choose a side.' },
  body: 'We use the ingredients behind the glass skin look: PDRN, snail mucin, centella and ginseng. Then we pair each one with a modern active chosen for the job it can’t do alone. What’s left is skincare that works for a routine whether you’re 25 and starting early, or 55+ and want your glow back.',
  image: asset('sc-promise-bg.jpg', 3000, 3000, ''),
} as const;

/**
 * Closing: the live homepage closer (sc-closer), captured 2026-11-02. Headline, rating line,
 * three reasons and the PDRN bundle CTA as published; reason 1 reworded from "Visibly brightens
 * tone and softens fine lines" to cosmetic "look of" phrasing (docs/QA.md).
 */
export const closing = {
  label: 'Your ritual',
  headline: { lead: 'Claim your', accent: 'radiant glow', tail: 'today.' },
  reasons: [
    'Formulated to brighten the look of tone and soften the look of fine lines',
    'Multiple actives in every formula, never just one',
    'Free US shipping, delivered to your door',
  ],
  productHandle: 'pdrn-salmon-dna-trio',
  cta: { label: 'Shop the PDRN bundle' },
  secondary: { label: 'Shop all bestsellers', href: '#bestsellers' },
  image: asset('sc-closer-bg.jpg', 2731, 4096, ''),
} as const;
