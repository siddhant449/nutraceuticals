# SeoulCeuticals Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, art-directed SeoulCeuticals homepage prototype with real store data, a real bag → Shopify cart hand-off, and one signature WebGL "Formula" chapter.

**Architecture:** Astro 7 static site. Pure, unit-tested TS libs (`src/lib`) for catalog, money, images and bag logic; editable content modules (`src/content`) that are tested against the store snapshot; one `.astro` component per section; small vanilla TS client modules for motion, UI and a lazily imported Three.js scene.

**Tech Stack:** Astro 7.4, TypeScript (strict), Vitest 5, GSAP 3.15 (+ScrollTrigger), Lenis 1.3, Three 0.187, General Sans (Fontshare, self-hosted), Instrument Serif (`@fontsource/instrument-serif`).

**Spec:** `docs/superpowers/specs/2026-11-02-homepage-design.md` (brief: `SEOULCEUTICALS_CLAUDE_CODE_MASTER_BRIEF.md`)

**Version control:** the folder is not a git repo and the user hasn't asked for commits, so this plan has no commit steps. Offer `git init` + commits at the end.

## Global Constraints

- Never describe SeoulCeuticals as Korean-owned/-made. Origin copy: "Founded in the U.S. in 2016", "select ingredients sourced from South Korea", "manufactured in the United States".
- Banned in all content (enforced by the claims lint test): `korean-owned`, `korean owned`, `korean-made`, `made in korea`, `clinically proven`, `clinically tested`, `money back`, `money-back`, `guarantee`, `first to`, `dermatologist`, `hypoallergenic`, `non-comedogenic`, `pregnancy`, `cure`.
- Images only from `https://cdn.shopify.com/s/files/1/0527/3806/4539/files/…` (never `seoulceuticals.com/cdn/…`, which is behind a Cloudflare challenge).
- Palette tokens exactly: porcelain `#F3F0E9`, porcelain-deep `#EAE6DD`, ink `#191B19`, graphite `#292B28`, sage `#A5AD93`, sage-deep `#68735F`, persimmon `#C96E4F`, silver `#D9D9D3`, white `#FFFFFF`, muted `#777970`, border `rgba(25,27,25,0.14)`.
- Motion tokens: fast 0.25, standard 0.65, reveal 0.9, editorial 1.15, stagger 0.07, ease `power3.out`, smooth `power2.inOut`.
- Breakpoints: mobile < 768px, tablet 768–1023px, desktop ≥ 1024px. Pinned scenes and WebGL only at desktop + `(pointer: fine)` + no reduced motion.
- Live links go to `https://seoulceuticals.com<path>`.
- No Three.js in the initial bundle; no `any`; no Lenis `autoRaf` (GSAP ticker drives it).
- **Visual check (VC)**, used by UI tasks: with `npm run dev` running, use Playwright MCP to open `http://localhost:4321/`, screenshot at 1440×900 and 390×844 (save in `.playwright-mcp/`), confirm 0 console errors and `document.documentElement.scrollWidth <= window.innerWidth`, then repeat once with `browser_emulate_media` reduced motion and confirm every section heading is visible (computed opacity 1).

## Review Focus

1. **Corrupted or stale bag in localStorage** (bad JSON, a variant no longer in the snapshot) → the bag loads empty or drops the unknown lines, never throws. Pinned in Task 3 (`parseBag`, `reconcile`).
2. **Qty edge values** (0, negative, NaN, > 10) → 0 or less removes the line, above 10 clamps to 10, and the checkout URL never contains qty ≤ 0. Pinned in Task 3.
3. **Product without a compare-at price or a rating** → no strikethrough, no "Save %" badge, no "0.0 (0)" stars. Pinned in Task 3 (`savingsPercent`) and Task 2 (`rating: null`).
4. **JS fails or reduced motion is on** → no content stuck at `opacity: 0`. The `.motion` class has a 3s failsafe removal. Pinned in Task 5 by the reduced-motion part of the VC and a failsafe check.
5. **Shopify image URL already has `?v=`** → the width is appended as `&width=`, the `v` is kept, and protocol-relative or live-domain URLs are rewritten to cdn.shopify.com. Pinned in Task 3.

---

## File Structure

```
astro.config.mjs · package.json · tsconfig.json · vitest.config.ts
data/raw/products.json         raw /products.json (captured in-browser)
data/raw/ratings.json          { [handle]: {value,count} } from live DOM
data/raw/home.json             live homepage text: FAQ answers, reviews, asset dims, logo URL
scripts/build-snapshot.mjs     raw → src/data/store.snapshot.json
public/fonts/general-sans/     WOFF2 400/500/600 + LICENSE
src/data/store.snapshot.json
src/lib/types.ts · snapshot.ts · catalog.ts · money.ts · shopify-image.ts · cart.ts
src/content/site.ts · home.ts · formula.ts · concerns.ts · ritual.ts · results.ts
src/styles/tokens.css · base.css · type.css · layout.css
src/layouts/BaseLayout.astro
src/components/ui/Img.astro · Button.astro · Label.astro
src/components/product/ProductCard.astro · Price.astro · Rating.astro · AddToBag.astro
src/components/layout/SiteHeader.astro · MobileMenu.astro · BagDrawer.astro · SiteFooter.astro
src/components/home/Hero · ProofStrip · Philosophy · FormulaChapter · Flagship · ConcernFinder · Results · Ritual · BrandStory · Faq · Closing (.astro)
src/scripts/motion/tokens.ts · index.ts · reveals.ts
src/scripts/ui/bag-store.ts · bag-ui.ts · header.ts · menu.ts · tabs.ts · compare.ts · tilt.ts
src/scripts/webgl/capability.ts · formula-scene.ts · shaders.ts · formula-controller.ts
src/pages/index.astro
tests/*.test.ts
README.md · docs/ASSETS.md · docs/QA.md
```

---

### Task 1: Scaffold, tokens, fonts, base layout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/styles/{tokens,base,type,layout}.css`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `public/fonts/general-sans/*`, `src/scripts/motion/tokens.ts`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description: string }`. CSS custom properties `--c-porcelain … --c-border` (palette above), `--font-sans: 'General Sans'`, `--font-serif: 'Instrument Serif'`, a fluid type scale (`--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-body`, `--fs-small`, `--fs-label`), `--gutter` and `.container`/`.grid-12` utilities. `motion` export in `tokens.ts` matching Global Constraints.

- [ ] **Step 1:** Write `package.json` by hand: scripts `dev`, `build`, `preview`, `check` (`astro check`), `test` (`vitest run`), `snapshot` (`node scripts/build-snapshot.mjs`). Install `astro@7.4.4 gsap@3.15.0 lenis@1.3.27 three@0.187.0 @fontsource/instrument-serif@5.3.0` and dev deps `@astrojs/check typescript vitest@5.0.5 @types/three@0.187.0`. First check the Astro 7 docs/changelog for the tsconfig preset name and `<script>` processing.
- [ ] **Step 2:** Download the General Sans zip from `https://api.fontshare.com/v2/fonts/download/general-sans` into the scratchpad, unzip it there, and copy only the 400, 500 and 600 WOFF2 files plus the licence into `public/fonts/general-sans/`.
- [ ] **Step 3:** Write the tokens and base CSS: `@font-face` with `font-display: swap`, preload only the 500 weight, `body` background porcelain and colour ink, `:focus-visible` as a 2px persimmon outline with offset, and `::selection`. Add the `<head>` inline script `document.documentElement.classList.add(matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced-motion' : 'motion')`. Meta: title "SeoulCeuticals | Korean-Inspired Skincare with PDRN & Snail Mucin", description and OG tags.
- [ ] **Step 4:** Run `npm run build && npm run check`. Expected: build succeeds, 0 errors. Run `npm run dev` and fetch `http://localhost:4321/`. Expected: 200 with General Sans applied (check computed `font-family` via Playwright).

### Task 2: Store data capture + snapshot builder + catalog

**Files:**
- Create: `data/raw/{products,ratings,home}.json`, `src/lib/types.ts`, `src/lib/snapshot.ts`, `scripts/build-snapshot.mjs`, `src/data/store.snapshot.json`, `src/lib/catalog.ts`
- Test: `tests/snapshot.test.ts`, `tests/catalog.test.ts`

**Interfaces:**
- Produces (`types.ts`): `type Concern = 'anti-aging'|'brightening'|'hydration'|'soothing'|'acne-pores'`; `ProductImage {src;width;height;alt}`; `Rating {value:number;count:number}`; `Product {handle;title;type;tags:string[];concerns:Concern[];isBundle:boolean;isBestseller:boolean;variantId:number;price:number /*cents*/;compareAtPrice:number|null;available:boolean;images:ProductImage[];description:string /*plain text*/;rating:Rating|null;url:string}`; `StoreSnapshot {capturedAt:string;source:string;products:Product[]}`.
- Produces (`snapshot.ts`, dependency-free so Node can run it with type stripping): `toCents(price: string): number`, `htmlToText(html: string): string`, `normalizeProducts(raw: {products: unknown[]}, ratings: Record<string, Rating>, capturedAt: string): StoreSnapshot`.
- Produces (`catalog.ts`): `getProduct(handle: string): Product` (throws `Unknown product: <handle>`), `findProductByVariant(id: number): Product | undefined`, `productsForConcern(c: Concern, limit = 4): Product[]` (singles only; bestsellers first, then by rating count descending), `allProducts(): Product[]`.

- [ ] **Step 1: Capture raw data with Playwright MCP.** Open `https://seoulceuticals.com/` and wait about 9s for the Cloudflare check to pass. Then use `browser_evaluate` to:
    - (a) Save `JSON.stringify(await (await fetch('/products.json?limit=250')).json())` to `data/raw/products.json`.
    - (b) Read the rating value and count from each product card on `/collections/all`, opened in the same tab. Find the selectors by inspecting the cards, and save the result to `data/raw/ratings.json`.
    - (c) From the homepage, save to `data/raw/home.json`:
        - the full FAQ question/answer pairs (open every `<details>` first);
        - every review card (name, text, product title);
        - the header logo `src`;
        - `naturalWidth`/`naturalHeight` for `pdrn-bundle.jpg`, `sc-closer-bg.jpg`, `sc-promise-bg.jpg`, the 8 before/after images and `collection1-5.jpg`.
    - Check each saved file is valid JSON; if the tool wraps the output, unwrap it.
- [ ] **Step 2: Write failing tests** in `tests/snapshot.test.ts`:

```ts
expect(toCents('19.98')).toBe(1998)
expect(toCents('108.91')).toBe(10891)
expect(htmlToText('<p>Vitamin C &amp; <b>E</b></p>')).toBe('Vitamin C & E')
const snap = normalizeProducts({ products: [rawFixture] }, { 'day-glow-serum': { value: 4.5, count: 1938 } }, '2026-11-02')
expect(snap.products[0]).toMatchObject({ handle: 'day-glow-serum', price: 1998, compareAtPrice: 2299, isBestseller: true, concerns: ['anti-aging','brightening'], rating: { value: 4.5, count: 1938 }, url: 'https://seoulceuticals.com/products/day-glow-serum' })
// compare_at null or <= price → compareAtPrice null; unrated handle → rating null; missing image alt → product title; protocol-relative image src → https
```

  `rawFixture` is a trimmed copy of the real `day-glow-serum` entry plus a variant with `compare_at_price: null`.
- [ ] **Step 3:** Run `npm test`. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement `snapshot.ts`. In `scripts/build-snapshot.mjs`, read the raw files, call `normalizeProducts`, and write `src/data/store.snapshot.json` with 2-space JSON and `source: "https://seoulceuticals.com/products.json"`.
- [ ] **Step 5:** Write `tests/catalog.test.ts` against the real snapshot:
    - `getProduct('pdrn-salmon-dna-serum').title === 'PDRN Salmon DNA Vitamin C E Ferulic Serum'`
    - `getProduct('nope')` throws
    - `productsForConcern('acne-pores')` has length ≥ 1, contains no `isBundle`, and its first item has `isBestseller` true whenever any bestseller exists for that concern
    - `allProducts().length === 55`
- [ ] **Step 6:** Implement `catalog.ts` (imports the snapshot JSON), run `npm run snapshot && npm test`. Expected: all PASS.

### Task 3: Pure libs — money, Shopify images, bag

**Files:**
- Create: `src/lib/money.ts`, `src/lib/shopify-image.ts`, `src/lib/cart.ts`
- Test: `tests/money.test.ts`, `tests/shopify-image.test.ts`, `tests/cart.test.ts`

**Interfaces:**
- Produces: `formatMoney(cents: number): string`; `savingsPercent(price: number, compareAt: number | null): number | null`; `shopifyImage(src: string, width: number): string`; `shopifySrcset(src: string, widths: number[]): string`; `type BagLine = { variantId: number; handle: string; qty: number }`; `MAX_QTY = 10`; `addLine(lines, item: {variantId: number; handle: string}, qty = 1): BagLine[]`; `setQty(lines, variantId, qty): BagLine[]`; `removeLine(lines, variantId): BagLine[]`; `parseBag(json: string | null): BagLine[]`; `reconcile(lines, knownVariantIds: Set<number>): BagLine[]`; `bagCount(lines): number`; `subtotal(lines, priceOf: (variantId: number) => number | undefined): number`; `checkoutUrl(lines): string | null`. All functions are immutable (they return new arrays).

- [ ] **Step 1: Write failing tests:**

```ts
expect(formatMoney(1998)).toBe('$19.98'); expect(formatMoney(10891)).toBe('$108.91')
expect(savingsPercent(1998, 2299)).toBe(13); expect(savingsPercent(1998, null)).toBeNull(); expect(savingsPercent(1998, 1998)).toBeNull()
expect(shopifyImage('https://cdn.shopify.com/s/files/1/0527/3806/4539/files/a.jpg?v=17', 800)).toBe('https://cdn.shopify.com/s/files/1/0527/3806/4539/files/a.jpg?v=17&width=800')
expect(shopifyImage('//cdn.shopify.com/s/files/1/0527/3806/4539/files/a.jpg', 400)).toBe('https://cdn.shopify.com/s/files/1/0527/3806/4539/files/a.jpg?width=400')
expect(shopifyImage('https://seoulceuticals.com/cdn/shop/files/before1.jpg', 600)).toBe('https://cdn.shopify.com/s/files/1/0527/3806/4539/files/before1.jpg?width=600')
expect(shopifySrcset(u, [400, 800])).toBe(`${shopifyImage(u,400)} 400w, ${shopifyImage(u,800)} 800w`)
let b = addLine([], { variantId: 1, handle: 'a' }); b = addLine(b, { variantId: 1, handle: 'a' }, 2)
expect(b).toEqual([{ variantId: 1, handle: 'a', qty: 3 }])
expect(setQty(b, 1, 0)).toEqual([]); expect(setQty(b, 1, -4)).toEqual([]); expect(setQty(b, 1, NaN)).toEqual([]); expect(setQty(b, 1, 99)[0].qty).toBe(10)
expect(addLine(setQty(b, 1, 10), { variantId: 1, handle: 'a' })[0].qty).toBe(10)
expect(parseBag('not json')).toEqual([]); expect(parseBag(null)).toEqual([]); expect(parseBag('[{"variantId":"x"}]')).toEqual([])
expect(reconcile([{ variantId: 1, handle: 'a', qty: 1 }, { variantId: 2, handle: 'b', qty: 1 }], new Set([2]))).toEqual([{ variantId: 2, handle: 'b', qty: 1 }])
expect(checkoutUrl([])).toBeNull()
expect(checkoutUrl([{ variantId: 11, handle: 'a', qty: 2 }, { variantId: 22, handle: 'b', qty: 1 }])).toBe('https://seoulceuticals.com/cart/11:2,22:1')
expect(subtotal([{ variantId: 11, handle: 'a', qty: 2 }], id => id === 11 ? 1998 : undefined)).toBe(3996)
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the three modules. `shopifyImage` rewrites the `seoulceuticals.com/cdn/shop/files/` prefix to the cdn.shopify.com files prefix and uses the `URL` API so the existing `v` is kept.
- [ ] **Step 4:** Run `npm test`. Expected: all PASS.

### Task 4: Content modules + truth tests

**Files:**
- Create: `src/content/{site,home,formula,concerns,ritual,results}.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces:
    - `site.ts`:
        - `live(path: string): string`
        - `nav: {label: string; href: string}[]`: Shop all `/collections/all`, Bundles `/collections/bundles`, Best Sellers `/collections/bestsellers`, Chronicles `/blogs/news`, Quiz `/pages/the-korean-skincare-quiz`
        - `footerGroups: {title: string; links: {label; href}[]}[]`: the live footer links
        - `proofPoints: {value: string; label: string}[]`: `2M+` Units sold to date · `6,900+` Reviews on this site · `4.6` Average star rating · `35,000+` People subscribe to our skincare
        - `shipping = 'Free US shipping on every order'`
        - `logo: {src; width; height; alt: 'SeoulCeuticals'}`
        - `proofSource = 'seoulceuticals.com/pages/about-us, captured 2026-11-02'`
    - `formula.ts`:
        - `Ingredient {name; kind: 'heritage'|'active'; origin?: string; note: string; tint: string}`
        - `Pairing {id; heritage: Ingredient; active: Ingredient; productHandle: string; keywords: [string, string]; formulaNote: string}`
        - `pairings: Pairing[]`, in this order:
            1. PDRN + Vitamin C → `pdrn-salmon-dna-serum`
            2. Snail Mucin + Retinol → `ultra-retinol-serum`
            3. Snail Mucin + Volufiline → `volufiline-snail-mucin-serum`
            4. Centella Asiatica + Kojic Acid → `ultra-brightening-kojic-acid-cream`
        - Tints: PDRN `#E9A88F`, Vitamin C `#E7B65C`, Snail Mucin `#E8E6DE`, Retinol `#E3C77A`, Volufiline `#A5AD93`, Centella `#8E9A7A`, Kojic Acid `#F1E3C6`.
        - Heritage `origin`: "Sourced from South Korea".
        - Every `note` and `formulaNote` paraphrases that product's snapshot `description` or the About page, with no efficacy claims beyond them.
    - `concerns.ts`: `ConcernEntry {id: Concern; label; intro; collectionUrl}`, `concerns: ConcernEntry[]`:
        - Dark spots & uneven tone → brightening
        - Fine lines & firmness → anti-aging
        - Glass skin & glow → hydration
        - Dry, sensitive & reactive → soothing
        - Breakouts & clogged pores → acne-pores
    - `ritual.ts`: `RitualStep {n: string; when: ('AM'|'PM')[]; verb: string; handle: string; note: string; caution?: string}`, `ritual: RitualStep[]` (live copy verbatim):
        1. `01` AM · Wake → `day-glow-serum`
        2. `02` AM+PM · Treat → `marine-mineral-plump-glow-essence`
        3. `03` AM+PM · Repair → `multi-function-all-in-one-anti-aging-snail-repair-cream`, caution "Contains retinol: wear SPF by day and don't stack another retinol."

        Also `stepsFor(t: 'AM'|'PM'): RitualStep[]`.
    - `results.ts`: `BeforeAfter {id; before: Img; after: Img}` (the 4 live pairs, cdn.shopify.com URLs, measured dimensions); `Review {name; text; productHandle; source}` (from `data/raw/home.json`, including Paige's quote).
    - `home.ts`: hero, philosophy, brandStory, closing and FAQ copy.
        - FAQ: keep the live answers verbatim, but drop the mature/sensitive-skin and "how soon" questions and any answer that fails the lint.
        - Hero headline: "Skincare, *reformulated.*"
        - Eyebrow: "Korean-inspired formulas / Modern actives"
        - Body: "Korean-inspired ingredients meet modern skincare actives in thoughtfully formulated essentials for your daily ritual."

- [ ] **Step 1: Write failing tests** (`tests/content.test.ts`):

```ts
const handles = [...pairings.map(p => p.productHandle), ...ritual.map(s => s.handle), ...reviews.map(r => r.productHandle), ...flagshipHandles]
handles.forEach(h => expect(() => getProduct(h)).not.toThrow())
pairings.forEach(p => p.keywords.forEach(k => expect(getProduct(p.productHandle).description.toLowerCase()).toContain(k.toLowerCase())))
expect(stepsFor('AM')).toHaveLength(3); expect(stepsFor('PM')).toHaveLength(2)
expect(ritual.find(s => s.handle.includes('snail-repair'))?.caution).toMatch(/SPF/)
expect(concerns).toHaveLength(5); concerns.forEach(c => expect(productsForConcern(c.id).length).toBeGreaterThan(0))
const BANNED = /korean[- ]owned|korean-made|made in korea|clinically (proven|tested)|money[- ]back|guarantee|first to|dermatologist|hypoallergenic|non-comedogenic|pregnan|\bcures?\b/i
deepStrings({ site, home, pairings, concerns, ritual, reviews }).forEach(s => expect(s).not.toMatch(BANNED))
```

  `flagshipHandles` is exported from `home.ts`: `['day-glow-serum','multi-function-all-in-one-anti-aging-snail-repair-cream','pdrn-salmon-dna-serum','volufiline-snail-mucin-serum','snail-eye-cream']`. `deepStrings` is a small helper in the test file that walks objects and arrays.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Write the content modules. If a pairing's keyword is missing from its product description, the pairing is wrong: re-check the About page and swap the product. Never weaken the test.
- [ ] **Step 4:** Run `npm test`. Expected: all PASS.

### Task 5: Shell — header, mobile menu, bag store/drawer, footer, motion foundation

**Files:**
- Create: `src/components/layout/{SiteHeader,MobileMenu,BagDrawer,SiteFooter}.astro`, `src/components/product/{Price,Rating,AddToBag}.astro`, `src/components/ui/{Img,Button,Label}.astro`, `src/scripts/ui/{bag-store,bag-ui,header,menu}.ts`, `src/scripts/motion/{index,reveals}.ts`
- Modify: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: `cart.ts`, `catalog.ts`, `money.ts`, `shopify-image.ts`, `site.ts`.
- Produces:
    - `<Img image={{src,width,height,alt}} widths={number[]} sizes="…" priority?>`: renders `srcset`, explicit width/height and `loading`/`fetchpriority`.
    - `<AddToBag product={Product}>`: renders `button[data-add-to-bag][data-variant-id][data-handle]`, or a disabled "Sold out" button when unavailable.
    - `<Price product>` shows a strikethrough compare-at price plus "Save N%" only when `savingsPercent` isn't null.
    - `<Rating rating>` renders nothing when `rating` is null.
    - The bag catalog JSON is embedded as `<script type="application/json" id="bag-catalog">` with `{[variantId]: {handle,title,price,image}}` for all available products.
    - `bag-store.ts`: `bag.get(): BagLine[]`, `bag.add(variantId, handle)`, `bag.setQty(variantId, qty)`, `bag.remove(variantId)`, `bag.subscribe(fn): () => void`. It persists to localStorage key `sc-bag-v1` with every read and write wrapped in try/catch, and reconciles against the bag catalog on load.
    - `motion/index.ts`: `initMotion(): { lenis: Lenis | null }`. It registers ScrollTrigger once and creates Lenis only for `(pointer: fine)` without reduced motion, driven by `gsap.ticker`. It calls `lenis.stop()`/`start()` on the custom events `sc:lock`/`sc:unlock`, and removes the `.motion` class if init hasn't finished within 3000 ms.
    - `reveals.ts`: `initReveals(root = document)`, which animates `[data-reveal="up|fade|mask|lines"]` with the motion tokens.

- [ ] **Step 1:** Build the header: real logo (`site.logo`), nav, and a bag button "Bag (n)" with `aria-live="polite"` on the count. Below 1024px it collapses to a menu button. It gets `.is-solid` (porcelain background plus hairline) after 80px of scroll.
- [ ] **Step 2:** Build `MobileMenu` and `BagDrawer` as `<dialog>` elements. Esc closes them and focus returns to the opener; they dispatch `sc:lock`/`sc:unlock`. The drawer has:
    - lines with image, title, price, a qty stepper (− / +, min 0 removes) and Remove;
    - the subtotal;
    - a "Checkout on seoulceuticals.com" link with `href = checkoutUrl(lines)`, disabled when the bag is empty;
    - an empty state linking to #bestsellers.
- [ ] **Step 3:** Build the footer:
    - a serif sign-off line;
    - the live link groups;
    - a newsletter link to the live homepage (the brief says to reuse the existing integration, which isn't reachable from here);
    - "© SeoulCeuticals";
    - a giant "Seoul Ceuticals" wordmark cropped by the bottom edge (`aria-hidden`, since the brand name is already in the logo).
- [ ] **Step 4:** Temporarily place one `<AddToBag product={getProduct('day-glow-serum')}>` on the index page.
- [ ] **Step 5:** Run the VC. Then, in Playwright:
    - click Add, and expect the header to read "Bag (1)" and the button to show "Added" for about 1.5s;
    - open the bag, press + once, and expect the checkout `href` to be `https://seoulceuticals.com/cart/37732981637275:2`;
    - press Esc, and expect focus back on the bag button;
    - run `localStorage.setItem('sc-bag-v1','garbage')` and reload, and expect "Bag (0)" with no console errors;
    - to check the failsafe, block `/_astro/*` scripts with `browser_route` (or the equivalent), reload, and confirm that after 3s `document.documentElement.classList.contains('motion')` is false and the content is visible.

### Task 6: Hero, proof strip, philosophy

**Files:**
- Create: `src/components/home/{Hero,ProofStrip,Philosophy}.astro`
- Modify: `src/pages/index.astro` (remove the Task 5 test button)

**Interfaces:**
- Consumes: `home.hero`, `home.philosophy`, `site.proofPoints`, `site.shipping`, `<Img>`, `<Button>`, `initReveals`.

- [ ] **Step 1: Build the Hero.** It holds the page's only `<h1>`.
    - Desktop: the eyebrow label is top-left. The display headline (serif italic on "reformulated.") spans columns 1–8, and its last line overlaps the image edge by about one column. The image `pdrn-bundle.jpg` (priority, not lazy, widths 640/960/1280/1600) is a tall 4:5 stage in columns 8–12.
    - Below the headline: the supporting copy, a primary "Explore the formulas" button (→ `#formula`) and a secondary "Shop bestsellers" link (→ `#bestsellers`), then the proof line "4.6/5 · 6,900+ reviews · Free US shipping".
    - Mobile order: eyebrow → headline → copy → CTAs → image. The CTAs must be inside the first 844px.
    - Motion: the image is revealed with `clip-path` (inset 100% → 0) over the reveal duration, the headline lines reveal as units, and the pointer parallax is ±12px (desktop only). On first scroll the image scales from 1 to 0.94 and moves up a little (scrubbed).
- [ ] **Step 2: Build the ProofStrip.** Four figures plus shipping on a hairline-ruled row, revealed with a quick horizontal stagger. The numbers appear as text immediately; there's no count-up.
- [ ] **Step 3: Build Philosophy.**
    - Headline: "Korean-inspired ingredients. *Modern skincare science.*"
    - Supporting statement from the brief.
    - Two small images in organic blob masks (SVG `clipPath`, Podium-style): `sc-promise-bg.jpg` and `collection3.jpg`, with alt text describing what they actually show.
- [ ] **Step 4:** Run the VC. The first viewport at 1440 and at 390 should look intentional. Fix the composition before moving on; the brief's Phase 2 gate says not to continue until the hero is premium at both widths.

### Task 7: Formula chapter — DOM, pinned scroll, fallback

**Files:**
- Create: `src/components/home/FormulaChapter.astro`, `src/scripts/webgl/formula-controller.ts`

**Interfaces:**
- Consumes: `pairings`, `getProduct`, `<Img>`, `<Price>`, `<AddToBag>`.
- Produces: the section `#formula` on a graphite background. Each pairing has an `article[data-pairing=<i>]` containing:
    - the heritage ingredient (serif name, the "Sourced from South Korea" label and a note);
    - the "+" join;
    - the modern active (name and note);
    - the formula result: product image, title, price, add to bag and a "View product" live link.

  It includes `<svg class="drops">` with a goo filter (feGaussianBlur + feColorMatrix) and two circles tinted with the pairing's tints, plus `<canvas data-formula-canvas aria-hidden="true">`. `formula-controller.ts` exports `initFormula(section: HTMLElement): () => void`, which returns a cleanup function.

- [ ] **Step 1:** Build the static DOM. With no JS, mobile or reduced motion, the pairings show as 4 stacked editorial cards. Each card's SVG drops sit merged (the end state), and the cards are fully readable.
- [ ] **Step 2:** In the desktop motion path (`gsap.matchMedia('(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)')`):
    - pin the section's inner stage and scrub through the 4 pairings over `+=300%`;
    - animate the inner elements only. The two drops travel from opposite sides and merge, the labels cross-fade, and the product resolves with a mask reveal;
    - keep a progress rail of 4 ticks, and make each tick a button that scrolls to its pairing;
    - on mobile, the drops merge once (CSS transition) when the card enters the viewport.
- [ ] **Step 3:** Run the VC.
    - Desktop: scrolling through `#formula` shows all 4 pairings in order, the pin releases cleanly, and the next section isn't overlapped.
    - Mobile: there's no pin, and the 4 cards are readable.
    - Tab through the section: every add-to-bag button and link is reachable.

### Task 8: WebGL formula scene

**Files:**
- Create: `src/scripts/webgl/{capability,shaders,formula-scene}.ts`
- Modify: `src/scripts/webgl/formula-controller.ts`

**Interfaces:**
- Produces:
    - `canUseWebGL(): boolean`: tests a `webgl2` context; requires the desktop media query and `navigator.hardwareConcurrency >= 4` when it's defined.
    - `createFormulaScene(canvas: HTMLCanvasElement): FormulaScene` with:
        - `setPairing(i: number, tints: [string, string]): void` (tints tween over 0.65s);
        - `setMerge(t: number): void` (0 = apart, 1 = merged);
        - `setPointer(x: number, y: number): void` (-1..1);
        - `resize(): void`, `start(): void`, `stop(): void`, `destroy(): void`.
- Shader (in `shaders.ts`): a full-screen triangle with an orthographic camera.
    - Two metaball SDF droplets combined with a smooth-min whose k depends on `uMerge`.
    - Shading is a milky subsurface look: a soft inner gradient from tint to porcelain, a fresnel rim of about 0.25 strength, one soft specular highlight, and low-frequency value noise (time × 0.05) wobbling the surfaces by at most 2% of the radius.
    - Background: a graphite radial gradient with grain at about 3% amplitude.
    - `uPointer` offsets the droplet field by at most 0.03.
    - No bloom, no glow halos, no hue shifts beyond the tints.

- [ ] **Step 1:** In `formula-controller.ts`, when `canUseWebGL()` is true:
    - use an IntersectionObserver with `rootMargin: '50% 0px'` to `await import('./formula-scene')`;
    - map ScrollTrigger progress to `setPairing` and `setMerge`;
    - render from `gsap.ticker` only while the section is visible and `document.visibilityState === 'visible'`;
    - set DPR to `Math.min(devicePixelRatio, 1.5)`;
    - hide the SVG drops once the first frame has rendered;
    - on cleanup, dispose the geometry, material and renderer and remove the listeners.
- [ ] **Step 2:** Run `npm run build`, then inspect `dist/_astro/*.js`. Expected: `three` code appears only in a separate chunk that isn't referenced by `index.html`'s initial `<script type="module">` (grep the entry chunk for `WebGLRenderer`, which should give no match).
- [ ] **Step 3:** Run the VC on desktop and take 3 screenshots at 10%, 45% and 90% of the section's scroll. Expected: the droplets are visible, separate and then merged, with readable labels and no glow. Then emulate no WebGL (`HTMLCanvasElement.prototype.getContext = () => null` via an init script) and confirm the SVG fallback shows with 0 console errors.

### Task 9: Flagship five + ProductCard

**Files:**
- Create: `src/components/product/ProductCard.astro`, `src/components/home/Flagship.astro`, `src/scripts/ui/tilt.ts`

**Interfaces:**
- Consumes: `flagshipHandles`, `getProduct`, `<Img>`, `<Price>`, `<Rating>`, `<AddToBag>`.
- Produces: `<ProductCard product index? note?>`, reused by Tasks 10 and 12. It has:
    - a porcelain-deep image stage (square, `object-fit: contain`, widths 320/480/640);
    - an optional index number;
    - the rating;
    - the title as a link to the live PDP;
    - a one-line `note`, defaulting to the key ingredients pulled from the title;
    - the price;
    - Add to bag.

  `initTilt(root)` gives a ±4° perspective tilt on the image only, for fine pointers without reduced motion.

- [ ] **Step 1:** Build `#bestsellers`.
    - Heading: "The flagship line" (label) plus "Multiple actives, *never just one.*" (from the live H2).
    - Layout: an editorial asymmetric grid of 5 cards (2 large, 3 small on desktop), a 2-column grid on tablet, and a single column on mobile. No carousel.
    - Card reveal: a staggered `up` reveal.
- [ ] **Step 2:** Run the VC. Check the real prices: Day Glow $19.98 with $22.99 struck through and "Save 13%", and rating 4.5 (1,938). Volufiline shows no rating. Add two different products and confirm the bag count is 2 and the drawer subtotal equals the sum.

### Task 10: Shop by concern

**Files:**
- Create: `src/components/home/ConcernFinder.astro`, `src/scripts/ui/tabs.ts`

**Interfaces:**
- Consumes: `concerns`, `productsForConcern`, `<ProductCard>`.
- Produces: `initTabs(root: HTMLElement)`, a generic WAI-ARIA tabs controller (roving tabindex, ←/→/Home/End, `aria-selected`, panels `hidden`). Task 12 reuses it.

- [ ] **Step 1:** Render all 5 panels server-side (works without JS; without JS the panels stack). Each panel has the intro copy, up to 4 `<ProductCard>`s, and "Shop all <label>" linking to the live collection. Below the panels: "For product discovery only — not a diagnosis or medical advice."
- [ ] **Step 2:** Run the VC. Keyboard: Tab into the tablist, then → twice, and expect "Glass skin & glow" selected with its panel visible. On touch (390 width) the tabs are a horizontally scrollable row with visible overflow affordance, and every tab is at least 44px tall.

### Task 11: Real results — before/after + reviews

**Files:**
- Create: `src/components/home/Results.astro`, `src/scripts/ui/compare.ts`

**Interfaces:**
- Consumes: `beforeAfters`, `reviews`, `getProduct`.
- Produces: `initCompare(el)`. Each compare widget is a `<input type="range" aria-label="Before and after comparison">` driving a clip on the "after" image. It works by drag, click and arrow keys.

- [ ] **Step 1:** Show the 4 compare widgets in a 2×2 grid (1 column on mobile), labelled "Before / After" and captioned "Customer-submitted photos, shared on seoulceuticals.com. Individual experiences vary." Show the reviews as editorial quotes, each with the name, "Verified review" (as labelled on the live site) and "Using the <product title>" linking to the live PDP. The header reads "4.6 average · 6,900+ reviews".
- [ ] **Step 2:** Run the VC. Focus a slider and press ← 5 times; expect the clip to move. Confirm there are no invented names, quotes or images by diffing against `data/raw/home.json`.

### Task 12: Daily ritual AM / PM

**Files:**
- Create: `src/components/home/Ritual.astro`

**Interfaces:**
- Consumes: `ritual`, `stepsFor`, `initTabs`, `<ProductCard>` (compact variant via a `compact` prop added here).

- [ ] **Step 1:** Build "Morning glow, *midnight repair.*" with AM/PM tabs (`initTabs`). The AM panel shows steps 01–03 and the PM panel shows 02–03, in order. Each step shows its number, the `when` label, the verb, the product (compact card) and the note. The retinol step shows its caution in a persimmon-ruled note, in both panels. Add a "Shop the full ritual" link to the live `/collections/bundles`.
- [ ] **Step 2:** Run the VC. Switch to PM and expect exactly 2 steps, with the caution text present.

### Task 13: Brand story, FAQ, closing

**Files:**
- Create: `src/components/home/{BrandStory,Faq,Closing}.astro`

**Interfaces:**
- Consumes: `home.brandStory`, `home.faq`, `home.closing`, `site.shipping`.

- [ ] **Step 1:** Build BrandStory, "Korean-inspired, *transparently made.*", as a Kettmeir-style still life: a large product image beside a numbered ledger:
    1. Founded in the U.S. in 2016
    2. Inspired by Korean skincare heritage
    3. Select ingredients sourced from South Korea: snail mucin, ginseng, rice bran, PDRN, centella
    4. Formulas manufactured in the United States
    5. Developed with Korean skincare expertise (product development consultant Ella Cho)

  The manufacturing line has the same type weight as the others, not a footnote. CTA: "Discover our story" → the live `/pages/about-us`.
- [ ] **Step 2:** Build the FAQ as native `<details>`/`<summary>` (one `h2`, questions as `summary`), with a "Still unsure? Contact us" link to the live `/pages/contact`.
- [ ] **Step 3:** Build Closing:
    - "Your daily ritual, *reconsidered.*"
    - Image: `sc-closer-bg.jpg`, full-bleed with a mask reveal on enter.
    - CTA: "Shop bestsellers" → `#bestsellers`.
    - The shipping line.
- [ ] **Step 4:** Run the VC across the full page. The section order matches spec §6.

### Task 14: QA, performance, docs, cleanup

**Files:**
- Create: `README.md`, `docs/ASSETS.md`, `docs/QA.md`
- Delete: research screenshots and logs in `.playwright-mcp/` (keep the folder in `.gitignore`)

- [ ] **Step 1:** Run `npm run check && npm test && npm run build`. Expected: 0 errors, all tests pass.
- [ ] **Step 2:** Run a Playwright pass on the built preview (`npm run preview`):
    - widths 360, 390, 768, 1024, 1440 and 1920 with no horizontal overflow;
    - exactly one `h1`;
    - every `img` has an `alt` attribute (empty only for decorative images) and `width`/`height`;
    - 0 console errors;
    - all internal anchors (`#formula`, `#bestsellers`) scroll correctly with Lenis on;
    - keyboard-only: Tab from the top reaches the bag, menu, tabs, sliders and every add button with visible focus;
    - reduced motion: no pinned section and all content visible.
- [ ] **Step 3:** Measure LCP and CLS with `PerformanceObserver` in Playwright on the preview with throttling (CPU 4×). Record the numbers in QA.md. Expected: LCP is the hero image and CLS < 0.1. Fix any layout shift.
- [ ] **Step 4:** Write the docs:
    - **README.md:**
        - how to run;
        - the architecture (libs/content/components/scripts);
        - the motion architecture;
        - the data refresh procedure: open seoulceuticals.com in a browser, save `/products.json?limit=250` to `data/raw/products.json`, then run `npm run snapshot`;
        - dependencies and licences.
    - **ASSETS.md:** the asset gaps:
        - ingredient macro photography (snail mucin, PDRN, centella, ginseng, rice);
        - skin macro campaign imagery;
        - packshots on neutral backgrounds for every flagship;
        - a product 3D model, if wanted;
        - a hero campaign video.
    - **QA.md:**
        - the checks run, with results;
        - browser coverage;
        - known issues;
        - claims awaiting approval: money-back guarantee, "first to combine", "cruelty-free", sensitive-skin suitability, results timeframe, SkinCeuticals comparison, "70,000+ ratings across the web";
        - things that need credentials (live reviews API, newsletter integration, Storefront API).
- [ ] **Step 5:** Final VC screenshots at 1440 and 390 for the hand-off summary.
