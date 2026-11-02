# QA report

Date: 2026-11-02 · Build: Astro 7.4.4 production build served with `astro preview` · Browser: Chromium via Playwright

## Automated checks

| Check | Result |
|---|---|
| `npm run check` (TypeScript strict, 71 files) | 0 errors, 0 warnings, 0 hints |
| `npm test` (Vitest, 10 files) | 99 / 99 pass |
| `npm run build` | pass |
| Initial JS | 56 KB gzipped (GSAP, ScrollTrigger, Lenis, app code); no Three.js |
| Lazy WebGL chunk | 130 KB gzipped, requested only near the Formula chapter on capable desktops |
| CSS | 11 KB gzipped · HTML 19 KB gzipped |

The test suite pins the things most likely to go wrong in a commerce prototype:

- the snapshot normalizer, catalog lookups and concern mapping;
- the bag model: quantity limits, corrupt or stale `localStorage`, and the checkout permalink;
- Shopify image URLs: version params and challenged live-domain URLs;
- content truth:
  - every referenced product exists;
  - each formula pairing is supported by its product description or documented label evidence;
  - ritual timings and the retinol + SPF caution are intact;
  - the ritual imagery shows the named product;
- the claims lint: no "Korean-made / clinically proven / money back / guarantee / first to / dermatologist…" and no em or en dashes.

## Browser checks (Playwright)

| Area | Result |
|---|---|
| Horizontal overflow at 360, 390, 768, 1024, 1440, 1920 | none |
| Headings | exactly one `h1`; h2 per section, h3/h4 inside |
| Images | all have `alt` (empty only when decorative) plus `width`/`height` |
| Accessible names | every button and link has one |
| Bag | add → count + "Added" + live announcement; qty ±, remove, subtotal; checkout `https://seoulceuticals.com/cart/37732981637275:2` |
| Bag resilience | `localStorage` set to garbage → empty bag, no errors; unknown variant dropped |
| Dialogs | bag drawer and mobile menu: Esc closes, focus returns to the opener; page scroll locked with and without Lenis (verified at 390 px, reduced motion: scrollY 1200 → 1200) |
| Anchors with Lenis | "Shop bestsellers" lands 89 px from the top (just under the header); the landing section is revealed immediately |
| Keyboard | Tab reaches formula ticks, product links, add buttons, concern tabs (←/→/Home/End), compare sliders (arrows), ritual switch (Enter), FAQ; visible focus ring throughout |
| Reduced motion | no Lenis, no pin, no WebGL, interlude unmasked, 0 hidden elements; toggling the preference mid-visit throws no errors |
| No WebGL (`getContext` → null) | SVG goo droplets shown, no errors |
| Blocked JS | content becomes visible after the 3 s failsafe |
| A throwing initialiser (IntersectionObserver removed) | error logged, other modules still run, `html.motion` removed, 0 hidden elements |
| WebGL after a responsive teardown (1440 → 900 → 1440) | canvas replaced, scene rebuilt (`has-webgl`), no console errors |
| Pinned Formula, keyboard | Tab from pairing 1's Add button moves into pairing 2 and the pin scrolls to it; all four pairings are in the accessibility tree |
| Shop by concern | all five concerns render at the same stage height (645 px at 1440, 682 px at 1840); tabs, photo and collection link share the same top and bottom lines |
| Hero | no element overlaps the headline, copy or product details at 1920, 1840, 1440, 1366, 1280, 1024, 768, 390 (box-collision check); CTA inside the first viewport at all of them |
| Formula chapter | four pairings in order, pin releases cleanly, ticks jump to pairings, header switches to dark |
| Ritual | AM shows 3 steps; PM shows steps 02 and 03 with "Morning only" on step 01, the retinol caution, and the dark header |
| CLS (CPU 4× throttle) | 0 at 1440 × 900, 0.01 at 390 × 844 |

## Not verified / known issues

- **LCP could not be measured reliably in this harness** (it stopped emitting paint timing mid-session). The hero's
  large images (cream surface, snail still life) are `fetchpriority=high`, not lazy, and never start clipped or at
  opacity 0 (the porcelain veil is a separate layer that fades over them). **Run Lighthouse / PageSpeed on a deployed
  URL before sign-off.**
- **Intermittent `net::ERR_NETWORK_CHANGED`** on the test machine caused occasional CDN image failures in the test
  browser. The same URLs returned 200 via curl. If this occurs in production, self-host the hero and ritual images.
- Safari / WebKit and real iOS / Android devices were not tested (Chromium only, with touch-width emulation).
- The Formula pin length (4 × 85 % of the viewport) was tuned on 900 to 1080 px tall screens; check very short landscape laptops.
- Header dark/light detection computes its band at load; resizing the window height mid-visit can offset it slightly.
- Review findings deferred (minor): drawer focus after removing a line and per-line quantity announcements; no "max 10"
  message on Add; `shopify-image` does not rewrite `www.` or `/cdn/shop/products/` URLs; ritual switch uses
  `aria-pressed` (a radio group would be cleaner); hero/interlude scroll tweens keep running if reduced motion is
  switched on mid-visit; GLSL `smoothstep` with reversed edges; `destroyMotion` unused; `og:image` unset.

## Needs brand / legal approval

Claims published on the live site that this prototype intentionally does **not** use:

- "See the difference, or your money back" (guarantee)
- "First to combine…" (four About-page "industry firsts")
- "Cruelty-free" (About page, FAQ)
- "Will this work on mature or sensitive skin? Yes…" (suitability claim)
- "How soon will I see results? 1 to 2 weeks… 4 to 8 weeks" (results timeframe)
- "Why combine… repair and hydrate at a level clinical actives don't touch" (comparative efficacy)
- The SkinCeuticals comparison in the Day Glow description and the "Why women make the switch" table
- "70,000+ ratings & reviews across the web"
- Promise section: "the actives that started the glass skin movement" and "a clinical active that's proven to do the
  specific job" (reworded to "the ingredients behind the glass skin look" / "a modern active chosen for the job")
- Closer: "Visibly brightens tone and softens fine lines" (reworded to "Formulated to brighten the look of tone and
  soften the look of fine lines")

Used, but needs the brand to confirm current policy and market:

- "Free US shipping on every order" (live announcement bar and hero, 2026-11-02): shown in the proof strip, menu,
  footer, closing section and bag drawer.
- "Sourced from South Korea" on each Formula heritage ingredient comes from the brand-level About page list; confirm
  per product.

Content decisions to confirm:

- Formula pairing 4 (Centella asiatica + Kojic acid → Ultra Brightening Kojic Acid Cream) relies on the cream's
  label (lists "CICA") and the About page; the store description does not mention centella. Confirm against the INCI.
- FAQ answers are the live site's text with punctuation only adjusted (no dashes). One FAQ ("Which ingredients come
  from South Korea?") is assembled from About-page sentences.
- Proof points (2M+, 6,900+, 4.6, 35,000+) are static values copied 2026-11-02 in `src/content/site.ts`.

## Needs credentials to go further

- Live ratings and reviews (Judge.me API).
- Newsletter (the existing Klaviyo / Shopify form). The prototype links to the live site instead of capturing emails.
- Live prices and stock (Storefront API token), instead of the snapshot.
