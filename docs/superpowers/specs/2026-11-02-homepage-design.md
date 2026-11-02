# SeoulCeuticals Homepage — Design

**Date:** 2026-11-02 · **Source brief:** `SEOULCEUTICALS_CLAUDE_CODE_MASTER_BRIEF.md` (direction A, Clinical Editorial) · **Scope:** homepage only.

## 1. Intent

Rebuild the seoulceuticals.com homepage as a standalone, art-directed prototype that shows the SeoulCeuticals team the new direction: *clinical in clarity, organic in movement, editorial in composition, frictionless in commerce.* The current live homepage already has the right content and order; the problem is execution (template look, loud pink, pop-ups). This prototype keeps the content truthful and the shopping real, and changes the craft.

**Audience (Claude's assumption, not confirmed):** the SeoulCeuticals team reviewing a direction. So the first viewport and one signature chapter get the most polish, but every button must work.

## 2. Goals / non-goals / anti-goals

**Goals**
- A distinctive first viewport that says what the brand sells within seconds.
- One memorable signature experience (the Formula chapter), not effects everywhere.
- Real products, prices, compare-at prices, ratings and images from the live store.
- Real add-to-cart: a bag inside the prototype that hands off to the live Shopify cart.
- Purpose-built mobile composition, reduced-motion and no-WebGL fallbacks.

**Non-goals**
- Migrating the Shopify store, building Liquid sections, or a headless Storefront API integration.
- Pages other than the homepage (links go to the live site).
- Search, account, newsletter back end (links/hand-offs to the live site instead).

**Anti-goals (would be a failure even if it "works")**
- Generic AI aesthetics: glowing orbs, neon shaders, liquid metal (common in 21st.dev/originkit).
- Calling SeoulCeuticals Korean-owned or Korean-made; implying every formula holds every ingredient.
- Invented claims, reviews, ratings, before/afters, packaging or logos.
- Buttons that look functional but do nothing.

## 3. Constraints discovered during recon

- **Repo:** empty except the brief → brief's "empty concept repository" rule applies.
- **Live store is behind a Cloudflare bot challenge.** Scripts (curl) get 403; a real browser passes after ~8s. Browsers on other origins can't read `products.json` (CORS). → Product data is a **committed snapshot**, captured through a real browser, with a documented refresh path.
- **Images:** `cdn.shopify.com/s/files/1/0527/3806/4539/files/<name>` serves every asset (product + homepage) with `access-control-allow-origin: *` and `?width=` resizing. `seoulceuticals.com/cdn/...` URLs are challenged — never use them.
- **Catalog:** 55 products (22 singles, 33 bundles), each tagged `concern:anti-aging|brightening|hydration|soothing|acne-pores` and many tagged `bestseller`. All single-variant ("Default Title").
- **Packaging** is saturated magenta + cobalt; logo is orange Hangul 서울 + "Seoul Ceuticals" wordmark.

## 4. Decisions (Claude's calls, user may override)

| Area | Decision |
|---|---|
| Framework | **Astro 7 + TypeScript (strict)**, static output. One `.astro` component per section; client behaviour in small vanilla TS modules. Maps cleanly onto future Shopify sections. |
| Motion | **GSAP 3.15 + ScrollTrigger** (all plugins free since 3.13). **Lenis** only on fine-pointer devices without reduced motion; native scroll elsewhere. One ticker. |
| WebGL | **Three.js**, dynamically imported only on capable desktop when the Formula chapter approaches. One renderer, one full-bleed shader plane. Paused offscreen / tab hidden. |
| Fonts | **General Sans** (Fontshare, ITF FFL, self-hosted WOFF2, 400/500/600) + **Instrument Serif** (OFL, `@fontsource`, 400 + italic). |
| Palette | Brief palette. Persimmon `#C96E4F` echoes the real orange logo. Magenta appears only via product photography. |
| Data | `src/data/store.snapshot.json` (normalized), built from a raw `products.json` captured in-browser + homepage ratings captured from the live DOM, each with `capturedAt`. |
| Cart | Bag state in `localStorage` (variant IDs + qty only). Checkout → `https://seoulceuticals.com/cart/<variantId>:<qty>,…` (Shopify cart permalink → real checkout). Header shows bag count. |
| Content | Editorial copy, concern mapping, ritual steps, ingredient pairings, reviews, proof points live in `src/content/*.ts` — never inside animation code. |
| Claims | Reuse only what the live site/About page publishes. Exclude pending sign-off: "money back", "first to combine", "clinically proven", SkinCeuticals comparison, sensitive-skin suitability, results timeframes. List all in `docs/QA.md`. |
| Cut | Live "Why women make the switch" comparison table (claims-heavy). |

## 5. Art direction

- **Canvas:** warm porcelain `#F3F0E9`; ink `#191B19` type; silver hairlines; sage only in ingredient moments; persimmon for accents/active states/primary CTA hover; one graphite dark chapter (Formula) for cinematic contrast.
- **Type:** General Sans for UI/body/most display; Instrument Serif (often italic) for one phrase per headline and ingredient names. Fluid `clamp()` scale; tiny uppercase tracked labels for metadata (`KOREAN-INSPIRED FORMULAS / MODERN ACTIVES`).
- **Grid:** 12-col editorial grid, asymmetric but ordered; large gutters on desktop.
- **Inspiration taken (not copied):**
  - Hero → *Maison Alaïa* (oversized type + single image, near-empty frame).
  - Formula liquid → *IntegratedBio* (soft translucent fluid, calm sans headline); cursor-disturbed fluid from *originkit Ink Flow* but milky, not glowing.
  - Ingredient reveals → *Podium* (organic blob masks).
  - Brand story → *Kettmeir* "Progressio in traditione" (product among still-life, heritage × progress).
  - Product staging → *Giellygreen* (calm tonal stages so packaging carries colour).
  - Footer → *Trove / Nothin' / Decimals* (giant wordmark cropped by the page edge, serif sign-off).

## 6. Page storyboard

| # | Section | Content source | Behaviour |
|---|---|---|---|
| — | Header | live nav (Shop, Bundles, Best Sellers, Chronicles, Quiz) → live URLs; real logo | Transparent over hero → solid porcelain after hero; bag count; full-screen mobile menu with focus trap + Esc |
| 00 | **Hero** "Skincare, *reformulated.*" | live `pdrn-bundle.jpg` + supporting copy from brief | Mask reveal of image, headline lines reveal as units, subtle pointer parallax; CTAs: Explore the formulas (→ #formula), Shop bestsellers (→ #bestsellers). Proof line: 4.6/5 · 6,900+ reviews · Free US shipping |
| 01 | **Proof strip** | live About "By the numbers" (2M+, 6,900+, 4.6, 35,000+) | Quick horizontal reveal; numbers readable immediately (no slow count-up) |
| 02 | **Philosophy** "Korean-inspired ingredients. *Modern skincare science.*" | brief + About | Oversized type mask reveal; two small images (skin/formula) in organic masks |
| 03 | **The Formula** (signature) | About page's four pairings, each verified against its product's description | Desktop: pinned scene, scroll scrubs through 4 pairings; WebGL: two milky droplets (heritage ingredient + modern active) drift, merge into one formula, then the real product pack shot resolves in DOM with name/price/add-to-cart. Mobile/reduced-motion/no-WebGL: stacked cards with an SVG "goo" two-drop illustration |
| 04 | **Flagship five** | live "Flagship line": Day Glow Vit C, Snail Repair Cream, PDRN Vit C E Ferulic, Volufiline Snail Mucin, Snail Eye Cream | Product cards (image stage, rating if present, price + compare-at, one-line factual benefit, Add to bag with loading/success/error), staggered reveal, tiny desktop tilt |
| 05 | **Shop by concern** | 5 live concerns → live collections + `concern:*` tags | Accessible tablist; selecting a concern shows short copy + top single products from snapshot + "Shop all" link; disclaimer "for product discovery, not medical advice" |
| 06 | **Real results** | 4 live before/after pairs + live review quotes (Joe, Drea, Natalie, Paige) with product association | Before/after compare (keyboard-operable range); "Customer-submitted photos" label; 4.6 · 6,900+ reviews |
| 07 | **Daily ritual** AM / PM | live 3-step ritual (AM · Wake / AM+PM · Treat / AM+PM · Repair) incl. retinol + SPF warning | Tabs AM/PM filter by the live labels; each step: product, why, add to bag |
| 08 | **Brand story** "Korean-inspired, transparently made" | About: founded in US 2016; Korean-sourced snail mucin, ginseng, rice bran, PDRN, centella; US-manufactured; Korean product-development expertise | Editorial timeline/ledger; CTA Discover our story → live About |
| 09 | **FAQ** | live FAQ answers that make no pending claims | Native `<details>` accordion |
| 10 | **Closing** "Your daily ritual, *reconsidered.*" | live `sc-closer-bg.jpg` | Campaign image reveal, CTA Shop bestsellers, Free US shipping |
| — | **Footer** | live footer links (About, Reviews, Really Korean?, Quiz, Subscriptions, Privacy, Refund, Terms, Contact, FAQ, Returns, Collabs, Login) | Giant cropped "Seoul Ceuticals" wordmark; newsletter hands off to live site |
| — | **Bag drawer** | snapshot | Line items, qty ±, remove, subtotal, "Checkout on seoulceuticals.com" (permalink) |

## 7. Quality bars

- Lighthouse-style targets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; hero image not lazy-loaded; explicit image dimensions; Three.js never in the initial bundle.
- One `<h1>`; semantic landmarks; visible focus; all interactions keyboard + touch; WCAG AA contrast.
- `prefers-reduced-motion`: no Lenis, no pin/scrub, no parallax, no WebGL; static compositions shown.
- No console errors, no horizontal overflow at 360–1920px.

## 8. Left to the builder

Exact spacing values, easing curves, shader maths, breakpoints, component internals, and test granularity — within the constraints above.

## 9. Deliverables

Working site (`npm run dev` / `npm run build`), `README.md`, `docs/ASSETS.md` (asset gap list), `docs/QA.md` (checks run, coverage, known issues, claims awaiting approval).
