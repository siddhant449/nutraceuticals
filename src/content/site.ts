/**
 * Site-wide content. Source: seoulceuticals.com (homepage, footer, /pages/about-us), captured 2026-11-02.
 * Proof points are editorial values copied from the live site — update them here when the store changes.
 */
import type { ProductImage } from '../lib/types.ts';
import { SHOPIFY_FILES } from '../lib/shopify-image.ts';

export const STORE = 'https://seoulceuticals.com';
export const live = (path: string): string => (path.startsWith('http') ? path : `${STORE}${path}`);

export const asset = (file: string, width: number, height: number, alt: string): ProductImage => ({
  src: `${SHOPIFY_FILES}${file}`,
  width,
  height,
  alt,
});

export interface Link {
  label: string;
  href: string;
}

export const logo = { src: '/brand/logo.svg', width: 192, height: 48, alt: 'SeoulCeuticals' } as const;
export const favicon = '/brand/favicon.png';

export const primaryNav: Link[] = [
  { label: 'Shop all', href: live('/collections/all') },
  { label: 'Best sellers', href: live('/collections/bestsellers') },
  { label: 'Bundles', href: live('/collections/bundles') },
  { label: 'The formula', href: '#formula' },
  { label: 'About', href: live('/pages/about-us') },
];

export const secondaryNav: Link[] = [
  { label: 'Skincare quiz', href: live('/pages/the-korean-skincare-quiz') },
  { label: 'Chronicles', href: live('/blogs/news') },
  { label: 'Search', href: live('/search') },
  { label: 'Account', href: live('/account') },
  { label: 'Contact', href: live('/pages/contact') },
];

export const footerGroups: { title: string; links: Link[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Serums', href: live('/collections/serums') },
      { label: 'Moisturizers', href: live('/collections/moisturizers') },
      { label: 'Masks', href: live('/collections/masks') },
      { label: 'Cleansers', href: live('/collections/cleansers') },
      { label: 'Toners & essence', href: live('/collections/toners') },
      { label: 'Bundles & routines', href: live('/collections/bundles') },
      { label: 'Snail mucin', href: live('/collections/snail') },
      { label: 'Shop all', href: live('/collections/all') },
    ],
  },
  {
    title: 'Learn more',
    links: [
      { label: 'About us', href: live('/pages/about-us') },
      { label: 'Reviews', href: live('/pages/reviews') },
      { label: 'Really Korean?', href: live('/pages/is-seoul-ceuticals-really-korean-where-is-it-made') },
      { label: 'The Korean Skincare Quiz', href: live('/pages/the-korean-skincare-quiz') },
      { label: 'Customer subscriptions', href: live('/pages/spurit-subscriptions') },
      { label: 'Chronicles', href: live('/blogs/news') },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', href: live('/pages/contact') },
      { label: 'FAQ', href: live('/pages/faq') },
      { label: 'Return policy', href: live('/pages/return-policy') },
      { label: 'Collabs', href: live('/pages/collabs') },
      { label: 'Customer login', href: live('/account') },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: live('/policies/privacy-policy') },
      { label: 'Refund policy', href: live('/policies/refund-policy') },
      { label: 'Terms of service', href: live('/policies/terms-of-service') },
    ],
  },
];

export const proofPoints: { value: string; label: string }[] = [
  { value: '2M+', label: 'Units sold to date' },
  { value: '6,900+', label: 'Reviews on this site' },
  { value: '4.6', label: 'Average star rating' },
  { value: '35,000+', label: 'People subscribe to our skincare' },
];
export const proofSource = 'seoulceuticals.com/pages/about-us (“By the numbers”), captured 2026-11-02';

export const rating = { value: '4.6', reviews: '6,900+' } as const;
/** Live announcement bar + hero ("Free US shipping on every order"), captured 2026-11-02.
 *  Market/minimum-order policy to be confirmed by the brand (docs/QA.md). */
export const shipping = 'Free US shipping on every order';

export const newsletter = {
  title: 'Notes on ingredients, routines and new formulas.',
  cta: { label: 'Subscribe on seoulceuticals.com', href: live('/') },
} as const;

export const signOff = 'Korean-inspired ingredients. Modern skincare science.';
