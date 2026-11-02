# SeoulCeuticals homepage prototype

A standalone, art-directed rebuild of the seoulceuticals.com homepage (direction A, "Clinical Editorial").
It uses real store data and real product imagery, and hands the bag off to the live Shopify cart.

- Brief: `SEOULCEUTICALS_CLAUDE_CODE_MASTER_BRIEF.md`
- Design spec: `docs/superpowers/specs/2026-11-02-homepage-design.md`
- Plan: `docs/superpowers/plans/2026-11-02-seoulceuticals-homepage.md`
- QA report: `docs/QA.md` · Asset gaps: `docs/ASSETS.md`

## Run it

```bash
npm install
npm run dev        # http://localhost:4321 (Astro 7 runs the dev server in the background: `npx astro dev stop`)
npm test           # Vitest: data, cart, content truth and claims lint (99 tests)
npm run check      # astro check (TypeScript strict)
npm run build      # static site in dist/
npm run preview    # serve dist/
```

Node 22.6+ is required (the snapshot script loads TypeScript directly via type stripping).

## Architecture

```
src/lib/        pure, tested logic: snapshot normalizer, catalog, money, Shopify image URLs,
                bag model + checkout permalink, key-ingredient parser, reveal partition, merge curve
src/content/    every editable word, mapping and image choice (no copy lives in animation code)
src/data/       store.snapshot.json (generated, see "Refreshing store data")
src/components/ one .astro component per section (home/), shell (layout/), product/, ui/
src/scripts/    client code: main.ts (single entry), motion/, ui/, sections/, webgl/
tests/          Vitest suites
```

Sections, in order: Hero, Proof strip, Philosophy, The Formula (signature WebGL chapter), Flagship line,
Shop by concern, Real results, Red-gel quote interlude, Daily ritual (AM/PM day to night), Brand story, FAQ,
Our promise, Closing ("Claim your radiant glow today"), Footer.

### Commerce

- Product titles, prices, compare-at prices, availability, images and variant IDs come from the store's
  public `products.json`; ratings come from the live Judge.me badges. Both are snapshotted.
- The bag lives in `localStorage` (`sc-bag-v1`, variant IDs and quantities only). Corrupt or stale entries
  are dropped on load.
- Checkout is a Shopify cart permalink, `https://seoulceuticals.com/cart/<variantId>:<qty>,…`, which opens the
  store's real cart and checkout. Discounts, shipping, taxes and payment are all handled there.

### Motion

- One scroll system: Lenis (fine pointers only, no `autoRaf`) driven by `gsap.ticker`, feeding ScrollTrigger.
  Dialogs pause it through `sc:lock` / `sc:unlock`.
- Reveal pre-states only apply under `html.motion`. An inline head script removes that class after 3 s if the
  motion module never initialises, so blocked or failed JS cannot leave content hidden.
- `prefers-reduced-motion: reduce` disables Lenis, pinning, scrubbing, parallax, WebGL, the hero curtain,
  the interlude mask and the gel drift. Every section renders its finished static composition.
- Only one section pins: The Formula, on desktop with a fine pointer. Everything else scrubs or reveals in place.

### WebGL

`src/scripts/webgl/` holds a single Three.js renderer for The Formula: two milky metaball droplets that merge
as you scroll through each ingredient pairing. Three.js is imported dynamically only when the chapter
approaches on a capable desktop (≈130 KB gzipped, in its own chunk). The scene renders only while the chapter
is on screen and the tab is visible, uses a device pixel ratio of at most 1.5, and is disposed on teardown.
Without WebGL (or on mobile / reduced motion) the same drops are drawn with an SVG goo filter. Product data and
buttons are always DOM.

## Refreshing store data

The live store sits behind a Cloudflare bot check, so scripts cannot fetch it directly.

1. Open https://seoulceuticals.com in a browser, then open `/products.json?limit=250` and save it as `data/raw/products.json`.
2. Optionally refresh `data/raw/ratings.json` (handle → `{ value, count }` from the collection page badges).
3. Run `npm run snapshot`, then `npm test`. The content tests fail loudly if a referenced product disappears
   or if a formula pairing is no longer supported by its product description.

Images are served from `cdn.shopify.com/s/files/1/0527/3806/4539/files/…` with `?width=` resizing.
The brand logo and favicon are saved in `public/brand/`.

## Dependencies

| Package | Why |
|---|---|
| astro 7.4 | static site, components, bundling |
| gsap 3.15 (+ ScrollTrigger) | timelines and scroll animation (all plugins are free since 3.13) |
| lenis 1.3 | smooth wheel scrolling on fine pointers |
| three 0.187 | the Formula droplet shader (lazy) |
| @fontsource/instrument-serif | OFL serif, self-hosted |
| General Sans (`public/fonts/general-sans`) | ITF Free Font License, self-hosting for the brand's own site is permitted (`FFL.txt`). Do not redistribute the font files publicly. |

## Porting notes

- `noindex` is set in `BaseLayout.astro` so the prototype never competes with the live store. Remove it when porting.
- Each `src/components/home/*.astro` maps to one Shopify section; `src/content/*.ts` maps to section settings / metafields.
