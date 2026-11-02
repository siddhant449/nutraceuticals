# SEOULCEUTICALS — CLAUDE CODE MASTER CREATIVE + DEVELOPMENT BRIEF

> **Project:** SeoulCeuticals homepage redesign  
> **Creative direction:** A — Clinical Editorial  
> **Experience concept:** Skin is a living system  
> **Quality ambition:** Awwwards-level digital flagship experience  
> **Core stack preference:** GSAP + ScrollTrigger + Lenis + Three.js/WebGL, integrated into the repository's existing framework and commerce platform  
> **Scope:** Homepage only unless the existing project architecture requires small shared-component changes.

---

# 0. HOW TO USE THIS DOCUMENT

You are working as a senior creative developer, interaction designer, frontend architect, motion designer, and e-commerce UX engineer. Treat this document as the source of truth for the redesign direction.

**First inspect the complete existing repository. Then implement the redesign in the existing project. Do not blindly scaffold a new app, replace the framework, or migrate the store.**

Work autonomously through the project: inspect, plan internally, implement, run checks, inspect the rendered result where browser tooling is available, fix issues, and summarize what is complete. Do not stop after producing a plan or a wireframe. Do not ask me to choose between obvious implementation details; make strong design decisions consistent with this brief. If a real blocker exists (missing credentials, inaccessible store data, missing licensed imagery, unavailable 3D source asset), implement the best working fallback and clearly report the blocker.

## Mandatory first actions

1. Inspect the repository structure, `package.json`, lockfile, framework, routes, current homepage, design tokens, CSS architecture, build tooling, installed dependencies, Shopify/theme integration, analytics, and existing reusable components.
2. Identify whether this is:
   - a Shopify Liquid theme;
   - a React/Next.js headless Shopify storefront;
   - another existing storefront framework; or
   - a standalone concept/prototype with no live commerce connection.
3. Read all existing `README`, `CLAUDE.md`, `AGENTS.md`, local development notes, and project conventions before editing.
4. Run the current project locally and capture/inspect the existing homepage if the environment supports it. Record what already works and must not regress.
5. Keep all existing product, cart, checkout, variant, navigation, tracking, consent, and customer-service behavior intact.
6. Write a short implementation checklist in the project (or your task notes) and then proceed directly into implementation.

## Architecture decision rule — do not ignore this

- **If this is a Shopify Liquid theme:** implement with Liquid sections/snippets, Shopify section settings/schema, existing product/collection objects, theme assets, and the current cart/checkout mechanisms. Do not create a separate Next.js app. Do not replace Shopify's cart with fake local state.
- **If this is already a React/Next.js headless Shopify storefront:** retain the current framework and its existing Storefront API/cart integration. Do not replace a working integration with a new one. Use the project's current version and conventions.
- **If this is another functioning stack:** preserve it and adapt the creative direction to it.
- **If this is an empty concept repository:** build a polished front-end prototype using the lightest compatible architecture, with data structured so Shopify integration can be added later. Use clearly marked mock data only in this case.
- A full headless migration is explicitly out of scope unless the existing repository is already headless or the project owner has separately approved it.

Do not expose private API keys, admin tokens, customer data, or secrets in client-side code or commits. Never invent Shopify credentials. Do not change production configuration.

---

# 1. BRAND STRATEGY AND POSITIONING

## Brand truth

SeoulCeuticals is a **US-founded (2016), Korean-inspired skincare brand**. It combines selected ingredients sourced from South Korea with clinically respected active ingredients. Its formulas are manufactured in the United States. It respects Korean skincare heritage and works with Korean skincare expertise, but it must not be represented as a Korean-owned or Korean-manufactured company.

Current live brand messaging and About page communicate:

- Korean-inspired skincare innovation.
- A combination of ingredients associated with Korean skincare and modern cosmetic actives.
- Select ingredients sourced from South Korea, including snail mucin, ginseng, rice bran, PDRN and centella (verify exact list against each product and current source before using it in a product-specific context).
- Product manufacturing in the United States.
- A positioning built around potent, pure, effective and accessible skincare.
- Current site-level proof points include more than 2 million units sold, more than 6,900 site reviews, a 4.6 average star rating, and more than 35,000 subscribers. These values can change; use the live store's current values, not hardcoded assumptions.

**Never describe SeoulCeuticals as a Korean company, Korean-owned company, or Korean-manufactured brand.** Do not imply that every formula contains every named ingredient. Do not invent clinical trials, dermatologist endorsements, certifications, efficacy percentages, test results, or customer outcomes.

## Strategic positioning

**Korean-inspired ingredients. Modern skincare science. Formulas made for real routines.**

The brand should feel like a premium editorial beauty and science experience, while retaining its approachable product pricing and direct, understandable shopping proposition.

## Brand personality

- Intelligent, not clinical-cold.
- Modern, not futuristic sci-fi.
- Sensory, not overly decorative.
- Confident, not exaggerated.
- Premium in art direction, accessible in attitude.
- Science-aware, but never medical or diagnostic.
- Respectful of Korean ingredient heritage, without decorative cultural stereotypes.

## Avoid

- Generic beige Shopify skincare template.
- Overused pastel pink beauty branding.
- Neon green, cyberpunk, holographic gradients, glowing blue interfaces, or generic AI aesthetics.
- A fake medical/dermatology interface.
- Decorative Korean characters, pseudo-Hangul, temples, flags, or cultural motifs used as props.
- Claims such as “clinically proven” unless the exact claim and evidence are supplied and approved.
- Claims that a cosmetic product treats, cures, diagnoses, or prevents a disease.
- Fake reviews, made-up customer names, invented before/after images, or fabricated skin transformations.
- A website that looks expensive but hides product prices, product details, add-to-cart, shipping information, or key trust information.

---

# 2. CREATIVE CONCEPT

## Concept name: SKIN IS A LIVING SYSTEM

**Creative direction:** Clinical Editorial × Organic Science × Cinematic Beauty.

Treat the homepage as a sequence of connected visual chapters, not a stack of unrelated Shopify sections. The visual narrative moves from the surface of skin, into the texture of a formula, through ingredient stories, and back out to the product and daily ritual.

The central creative metaphor is **the relationship between skin, ingredients, and formulation**. The experience is not a medical skin scanner and must not imitate Lovi's product functionality. Lovi is a digital skin-health platform; borrow its clarity, sequencing, confidence, and guided storytelling—not its face-scan/AI feature claims.

### The three visual worlds

1. **SKIN** — macro skin texture, hydrated surfaces, fine lines, pores, soft highlights, real human close-up photography, subtle reflections.
2. **SCIENCE** — translucent liquid, serum droplets, glass, fluid refraction, ingredient details, restrained technical annotations, molecular/particle motifs only where relevant.
3. **EDITORIAL** — large expressive typography, controlled whitespace, asymmetric grid, campaign photography, art-directed compositions, confident page rhythm.

These worlds should transition into each other. Do not present them as three separate design templates.

## Desired emotional reaction

The visitor should feel that they entered a carefully art-directed beauty brand—not a generic online store. The first few seconds should create a distinctive impression. The rest of the page should build product understanding and trust, then make shopping easy.

## Visual references

- **Lovi — https://lovi.care/**: clear scroll narrative, productized interface storytelling, layered transitions, strong use of visual demonstrations. Do not copy its face scan, AI cosmetologist, product interface or copy.
- **Dieux Skin — https://www.dieuxskin.com/**: formula transparency, approachable science communication, product education.
- **Typology — https://www.typology.com/**: ingredient-led organization, restrained typography, clear information hierarchy.
- **Aesop — https://www.aesop.com/**: premium editorial tone, tactile art direction, product photography and restraint.
- **Rhode — https://www.rhodeskin.com/**: strong campaign imagery, cohesive product world, confident brand consistency.
- **COSRX — https://www.cosrx.com/**: ingredient/product hierarchy and clear K-beauty product communication.
- **Peach & Lily — https://www.peachandlily.com/**: skincare education, routines and guided product discovery.
- **Soft Services — https://softservices.com/**: distinctive product storytelling and educational e-commerce patterns.

For broader inspiration, examine curated beauty and interactive work on Awwwards, SiteInspire, Godly, Minimal Gallery, and The Brand Identity. Look for actual full-page interactions, not just screenshots. Do not copy another site's exact layout, assets, animation sequence, or identity.

---

# 3. ART DIRECTION AND DESIGN SYSTEM

## Color palette

Use the palette below as the starting point. It is a direction, not a prison; tune contrast and actual values after seeing product photography and the existing brand assets.

```css
:root {
  --color-porcelain: #F3F0E9;
  --color-porcelain-deep: #EAE6DD;
  --color-ink: #191B19;
  --color-graphite: #292B28;
  --color-sage: #A5AD93;
  --color-sage-deep: #68735F;
  --color-persimmon: #C96E4F;
  --color-silver: #D9D9D3;
  --color-white: #FFFFFF;
  --color-muted: #777970;
  --color-border: rgba(25, 27, 25, 0.14);
}
```

### Color usage

- Warm porcelain: primary light canvas.
- Ink/graphite: typography and selected cinematic/dark chapters.
- Botanical sage: ingredient and formula moments, used sparingly.
- Burnt persimmon: signature accent, active states and occasional CTA emphasis.
- Silver: hairline dividers, scientific micro-details and neutral UI.
- White: product image backgrounds when required by actual source photography.

Do not make every section a different colored panel. The palette should feel coherent and editorial.

## Typography

Use an expressive, contemporary sans-serif for navigation, body, product information and most headlines, paired with a restrained editorial serif for selected statements or ingredient names.

Preferred exploration:
- Sans direction: General Sans, Satoshi, Neue Montreal, or a legally available equivalent already in the repo.
- Serif direction: Cormorant Garamond, Instrument Serif, Canela-like licensed equivalent, or a suitable already-installed alternative.

Important:
- Check font licenses and existing font assets before adding fonts.
- Do not hotlink random font files.
- Prefer self-hosted WOFF2 with appropriate preload only for critical weights.
- Avoid loading too many weights/styles.
- Strong hierarchy: expressive display headline, readable body, tiny uppercase technical labels, product metadata.
- Use fluid type with `clamp()` and keep text widths intentional.

## Layout system

- Editorial asymmetric grid, but maintain a clear reading order.
- Large margins and generous vertical rhythm on desktop.
- Consistent page gutters; responsive container widths.
- Use a baseline spacing scale and reusable layout primitives.
- Product cards should have consistent image stage, content alignment, price visibility, and action placement.
- Use asymmetry as a deliberate art-direction device, not random misalignment.
- Maintain a comfortable text measure; avoid long full-width paragraphs.
- Use section numbers and small metadata only when they add meaning.

## Photography and asset direction

Prioritize real product photography and genuine customer imagery from approved brand/store assets.

New asset direction:
- Macro, believable human skin texture with diverse, natural, unretouched-looking skin.
- Serum textures, liquid surfaces, glass and botanical ingredient still life.
- Controlled studio light, soft shadow, tactile materials, subtle reflections.
- Premium beauty editorial rather than generic stock-photo wellness imagery.
- Product packaging must match the actual SeoulCeuticals packaging, labels, dimensions and colorways.

**Do not generate fake product packaging, fake brand logos, fabricated testimonials, or synthetic before/after results.** If suitable assets are missing, use a tasteful image placeholder or existing approved product image and create an asset request list. Do not use an unrelated image and pretend it is the product.

## Image treatment

- Prefer high-quality art-directed compositions over decorative stock images.
- Preserve natural product label legibility where possible.
- Avoid excessive blur, grain, glow, bloom and chromatic aberration.
- Use subtle film grain only if it supports the visual direction and does not compromise performance or legibility.
- Provide appropriate `object-position` controls for mobile crops.
- Use responsive image sources and modern formats (AVIF/WebP) where the existing platform supports them.

---

# 4. HOMEPAGE INFORMATION ARCHITECTURE AND STORYBOARD

Build the homepage in the order below. Keep all sections connected through transitions, spacing and a consistent visual system. It is okay to adapt exact implementation to the current platform, but preserve the sequence and commercial intent.

## 00 — Opening / Hero: “Your skin. Reimagined.”

**Purpose:** Create an immediate, unforgettable visual identity while clearly stating what the brand sells.

### Desktop art direction

- Full-viewport or near-full-viewport opening scene.
- Warm porcelain or a deep graphite/porcelain contrast, depending on the strongest available image/3D art direction.
- Large display typography, carefully placed and not obscuring the product.
- One real flagship product or the current PDRN trio as the hero object. Product must be recognizable and accurately represented.
- Organic macro background or translucent liquid/glass environment.
- Small editorial metadata such as `KOREAN-INSPIRED FORMULAS / MODERN ACTIVES`.
- Header is restrained and transparent/quiet over the opening scene, then transitions to a legible solid treatment after scrolling.
- Primary CTA: `EXPLORE THE FORMULAS` or equivalent.
- Secondary CTA: `SHOP BESTSELLERS`.
- Proof strip can include real, current site-level rating/review/free-shipping facts if those are verified and geographically correct.

### Headline direction

Use one of these as the starting copy, then select the most powerful fit to the layout:
- `YOUR SKIN. REIMAGINED.`
- `SKINCARE, REFORMULATED.`
- `A NEW PERSPECTIVE ON SKINCARE.`

Suggested supporting copy:
`Korean-inspired ingredients meet modern skincare actives in thoughtfully formulated essentials for your daily ritual.`

Avoid stacking three headlines or writing long paragraphs in the hero.

### Signature motion

- Initial preloader only if necessary; do not add a long fake loading sequence.
- Product/hero composition reveals through a restrained mask or opacity/position transition.
- Hero image or 3D object has subtle parallax and lighting/reflection movement.
- Typography enters in a deliberate hierarchy, not every word flying in separately.
- On first meaningful scroll, the product composition subtly shifts/reframes, setting up the next chapter.
- The hero must remain visually strong if WebGL fails or is disabled.

### Mobile hero

- Do not squeeze the desktop composition into a narrow screen.
- Recompose headline, image and CTA for portrait orientation.
- Use a still image/video poster or simplified 2D composition as the default mobile path unless real mobile WebGL performance is excellent.
- Keep CTA visible without requiring a long scroll.

## 01 — Brand proof / Trust strip

**Purpose:** Establish credibility quickly without looking like a row of generic Shopify badges.

Possible content, only when current and verified:
- `4.6/5 average rating`
- `6,900+ reviews`
- `2M+ units sold`
- `35,000+ subscribers`
- shipping/guarantee information only for the correct market and current policy.

Use data from live Shopify settings, approved content, or an existing app integration where possible. Do not hardcode a value that is already available dynamically. If values are static editorial content, place them in a content setting/CMS field and document the update source.

Motion: restrained horizontal reveal, number count-up only if it does not delay readability or misrepresent values. Respect reduced motion.

## 02 — Philosophy / Brand statement

**Purpose:** State the brand proposition in a memorable editorial moment.

Suggested copy:
`KOREAN-INSPIRED INGREDIENTS. MODERN SKINCARE SCIENCE.`

Supporting statement:
`We bring together ingredients rooted in Korean skincare traditions and carefully selected cosmetic actives to make thoughtful, effective-feeling routines more accessible.`

Use oversized type, one selected serif phrase and a simple visual contrast between macro skin and formula imagery. No generic icon grid.

## 03 — Signature chapter: The Formula / Ingredient pairing

**Purpose:** Make the brand's ingredient/formulation proposition distinctive and understandable.

Visual metaphor:
Two or more ingredients move into a translucent liquid/formula composition. The visual should feel organic and tactile, not like a medical animation or a generic molecular-network screensaver.

Content structure:
- `INGREDIENT HERITAGE` — explain a relevant Korean-sourced ingredient.
- `MODERN ACTIVES` — explain a relevant cosmetic active.
- `THE FORMULA` — explain how the specific ingredients work together in the featured product.

Only show combinations that exist in the actual featured formula. Never imply every ingredient is in every product. Pull the exact INCI/formula details from current product data or approved brand copy. If accurate ingredient/product data cannot be found, show a general brand philosophy with no unsupported pairing claim.

Possible ingredient topics, after verifying exact product associations:
- Snail mucin / snail secretion filtrate.
- Centella asiatica.
- Panax ginseng.
- Rice bran / rice-derived ingredients.
- PDRN.
- Vitamin C derivatives, retinol, kojic acid, hyaluronic acid or other actives only where present in the specific product.

Interaction idea:
- Scroll scrubs a fluid/texture transition.
- Ingredient labels appear as quiet annotations.
- An optional hover/tap reveals a concise explanation.
- The formula reveal resolves into the actual product pack shot.

This is the main brand-differentiation chapter. Make it beautiful, but keep the ingredient education readable and factual.

## 04 — Flagship products / Bestsellers

**Purpose:** Turn desire into a clear purchase path.

Use real products, live product data, actual prices, variants, availability, sale pricing and reviews from the store. Do not hardcode a fake catalogue.

Potential initial hierarchy from current public product content (verify in live store before use):
- Day Glow Vitamin C Serum.
- Snail Repair Cream Moisturizer.
- PDRN Salmon DNA Vitamin C E Ferulic Serum.
- Volufiline Snail Mucin Serum.
- Snail Eye Cream.

The live site's current hero promotes a PDRN trio/bundle, while its product listing includes established products such as Day Glow Vitamin C Serum and Snail Repair Cream. Do not assume the bundle must remain the hero; use the actual current merchandising priorities and stock status.

Product-card requirements:
- Product image on a clean, considered stage.
- Product title.
- Price and compare-at price when applicable.
- Review rating/count only when present and sourced.
- Short, factual product benefit/ingredient description.
- Variant selector only if required.
- Functional add-to-cart/quick-add using the existing commerce integration.
- Visible focus, hover and loading/success/error states.
- No fake add-to-cart interactions.

Motion: product cards reveal with staggered but restrained movement. Product imagery may have a tiny perspective shift on desktop pointer movement, but must not distort labels or cause motion sickness. Avoid horizontal carousels that hide product discovery unless the user can clearly navigate them.

## 05 — Shop by skin concern / Guided discovery

**Purpose:** Help customers find a suitable product without pretending to diagnose skin.

Suggested concerns based on current website language, to verify with product catalogue:
- Dark spots & uneven tone.
- Fine lines & firmness.
- Glass skin & glow.
- Dry, sensitive & reactive skin.
- Breakouts & clogged pores.

Interaction:
- Clear, accessible cards or a horizontal/vertical editorial selector.
- Selecting a concern filters or surfaces relevant products/routines from approved mappings.
- Show a short explanation and product CTA.
- The mapping should be content-driven and editable, not buried in animation code.
- State explicitly that the tool is for product discovery, not medical diagnosis or individualized medical advice.
- Keyboard and touch support are mandatory.

Avoid face scanning, health scoring, AI diagnosis, or claims that the site analyzes a visitor's skin.

## 06 — Real customer results / Social proof

**Purpose:** Build trust with genuine evidence and customer voices.

Use only brand-approved real customer photos/reviews. Preserve source context, consent and any legally required disclaimer. Do not manufacture before-and-after images, alter skin to exaggerate a result, or present a testimonial as clinical proof.

Features:
- Editorial photo grid or carefully staged comparison cards.
- Before/after slider only where source images are genuine, permissioned, comparable, and clearly labelled.
- Customer quote and verified product association when available.
- Review count and average rating from the live store/review platform.
- A clear disclosure for customer-submitted content where appropriate.

If valid imagery is unavailable, use genuine review excerpts and product photography rather than fake transformations.

## 07 — Daily ritual / AM + PM routine

**Purpose:** Translate a product catalogue into a simple, useful routine.

Suggested interaction:
- Toggle or tabs: `AM` and `PM`.
- Show ordered steps with the correct current products and short explanations.
- Selecting a step reveals product information and a product link/add-to-cart.
- The UI must work with keyboard, screen reader and touch.
- The routine and ingredient/safety statements must be checked against the actual product instructions.
- If a product contains retinol or another ingredient requiring specific use guidance, show only the currently approved instructions from product packaging/brand content. Do not invent combinations or usage frequency.

Avoid suggesting unsafe product stacking. Where brand guidance says to use SPF with a particular product, preserve that guidance.

## 08 — Brand story / Korean-inspired, transparently made

**Purpose:** Communicate the brand's origin and sourcing honestly and beautifully.

Use a cinematic editorial layout with botanical ingredient imagery, actual production/ingredient imagery if available, and a clear sequence:
- Founded in the United States in 2016.
- Inspired by Korean skincare heritage.
- Selected ingredients sourced from South Korea.
- Formulas manufactured in the United States.
- Korean skincare expertise is part of product development, as stated by the brand.

Do not hide the manufacturing distinction in a footnote. Transparency is a strength and should be expressed confidently.

CTA: `DISCOVER OUR STORY` linking to the existing About page.

## 09 — Closing campaign / Final conversion

**Purpose:** End with a memorable image and an obvious next action.

- Bold campaign art direction, preferably a large genuine product/skin image.
- Short closing statement such as `YOUR DAILY RITUAL, RECONSIDERED.`
- CTA to shop bestsellers or explore the collection.
- Include relevant shipping/guarantee reassurance only when current and market-correct.

## 10 — Footer

Keep it visually coherent but practical:
- Shop links and collections.
- About/brand story.
- Help, contact, shipping, returns and FAQ links.
- Newsletter signup if the current integration exists.
- Social links.
- Country/currency/market selector where supported.
- Payment methods and legal links.
- Accessible contrast and clear focus states.

Do not remove existing legal, policy, accessibility or customer support links.

---

# 5. SIGNATURE WEBGL EXPERIENCE — CREATIVE AND TECHNICAL SPEC

## Principle

Use WebGL to create one memorable, connected visual experience—not to turn every section into a 3D demo. A strong DOM-first website with one exceptional WebGL chapter is better than a heavy site full of unnecessary 3D.

## Proposed visual sequence: “The Skin Surface”

The visual journey is a metaphorical campaign sequence, not a literal biological simulation.

### Scene A — Surface

- Abstract, tactile, skin-like organic surface or high-quality macro photographic plate.
- Translucent liquid highlights and subtle movement.
- Soft lighting, shallow visual depth and premium editorial contrast.
- Brand headline and actual product pack shot layered as HTML where possible.

### Scene B — Formula

- Camera/texture transition into a transparent serum/liquid environment.
- A few carefully art-directed droplets/particles.
- Ingredient micro-labels appear with appropriate factual content.
- Avoid a generic node graph or overly literal molecule model.

### Scene C — Ingredients

- Botanical/ingredient visual transition with genuine or commissioned assets.
- Keep ingredient representation accurate to the product being described.
- Use restrained motion and readable annotations.

### Scene D — Product reveal

- Resolve the environment into a hero product composition.
- Use the real product image or an approved accurate 3D model.
- Product name, short factual value proposition, price/CTA and accessible controls remain regular DOM elements.
- WebGL is visual presentation only; product data and cart logic are not inside the canvas.

## Implementation approach

1. Inspect whether an approved 3D model, image sequence, product video, or campaign asset already exists.
2. If a high-quality real 3D pack shot is unavailable, do not fake a brand package. Use layered product photography with depth, masks and a tasteful shader-based liquid environment.
3. Create WebGL lazily/client-side so server rendering and initial content do not depend on WebGL.
4. Render a high-quality static poster immediately. Upgrade to WebGL after the initial page is stable and the device supports it.
5. Use `IntersectionObserver` or an equivalent visibility gate to initialize the canvas only near the hero/feature chapter.
6. Stop or reduce render work when the canvas is not visible, the tab is hidden, or the user requests reduced motion.
7. Dispose geometries, materials, textures, render targets and event listeners on teardown.
8. Clamp device pixel ratio (for example, 1–1.5 on mobile and no more than 2 on high-density desktop) and tune based on measured performance.
9. Use a responsive quality tier: desktop high, tablet medium, mobile low/static where required.
10. Keep the canvas `aria-hidden="true"` if it is decorative. All essential text, controls and product data must exist in accessible HTML.

## Shader direction

If implementing custom GLSL:
- Keep the shader mathematically stable and inexpensive.
- Use restrained refraction, noise and distortion, not a constant high-frequency swirl.
- Animate from scroll progress or a small number of parameters; avoid unnecessary independent loops.
- Keep the effect subtle enough that product labels and overlay text remain readable.
- Ensure there is a no-WebGL fallback.

## WebGL anti-patterns to avoid

- A spinning bottle as the only “wow” moment.
- Full-screen shader that hides the product or makes text unreadable.
- Huge 4K textures loaded up front on every device.
- Multiple independent WebGL canvases when one scene/renderer can do the job.
- A renderer that continues animating offscreen.
- WebGL-based text, buttons, navigation or product pricing.
- Blocking the page while 3D assets load.
- A canvas with no accessible equivalent or fallback.

---

# 6. MOTION DESIGN SYSTEM — GSAP + SCROLLTRIGGER + LENIS

Motion should feel intentional, tactile, smooth and editorial. Every animation needs a reason. Avoid a “GSAP demo reel” where every element moves independently.

## Global principles

- One primary scroll system.
- One coordinated animation clock where feasible.
- Use transforms and opacity for most motion.
- Prefer composed timelines rather than dozens of unrelated tweens.
- Do not animate layout properties continuously if a transform will work.
- Avoid pinning every section; use only for the signature formula/hero chapter if it genuinely improves the narrative.
- Do not trap users in scroll-jacked interactions.
- Do not hijack normal anchor navigation or keyboard scrolling.
- Keep scroll distance reasonable; don't make users scroll through enormous pinned scenes just to reach products.
- Test touch devices and reduced-motion settings early.

## Motion vocabulary

### Typography
- Clip-path/mask reveal for key display headlines.
- Lines/phrases reveal as coherent units.
- Small metadata fades/slides a few pixels into position.
- Stagger only when hierarchy benefits from it.
- Avoid per-letter animation across every heading.

### Images
- Image mask reveal, subtle scale settle, parallax with small ranges.
- No constant zoom on every image.
- Preserve image focal point during responsive crop.

### Products
- Small perspective shift on desktop pointer movement.
- Restrained 3D tilt, no aggressive spin.
- Hover action labels and quick-add feedback.
- Ensure hover is never the only way to reveal essential information.

### Navigation
- Header surface/contrast transition after the hero.
- Underline/opacity microinteraction for nav links.
- Full-screen menu with clean focus management and escape-to-close.
- Disable page scroll when menu is open, then restore correctly.

### Section transitions
- Use overlapping colors/images, a shared visual motif, or typography continuity.
- Avoid arbitrary page wipes between unrelated sections.

## Suggested timing and easing

Use as starting values; tune by eye and test on real devices.

```js
const motion = {
  fast: 0.25,
  standard: 0.65,
  reveal: 0.9,
  editorial: 1.15,
  stagger: 0.07,
  ease: "power3.out",
  smooth: "power2.inOut",
};
```

- Microinteractions: ~0.18–0.35s.
- Standard reveals: ~0.55–0.85s.
- Campaign reveals: ~0.8–1.2s.
- Avoid slow entrances that delay understanding or shopping.

## Lenis integration

Use Lenis only if it improves the existing scroll experience and does not conflict with Shopify/theme behavior, overlays, anchors, browser history, accessibility or other libraries.

Preferred GSAP ticker integration (adapt to the installed package version and framework lifecycle):

```js
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smoothWheel: true,
  // Keep settings modest; tune on real hardware.
});

lenis.on("scroll", ScrollTrigger.update);

const tick = (time) => {
  lenis.raf(time * 1000); // GSAP ticker time is seconds; Lenis raf expects ms.
};

gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);

// On teardown:
// gsap.ticker.remove(tick);
// lenis.destroy();
```

Important:
- Do not simultaneously use Lenis `autoRaf: true` and a GSAP ticker RAF loop.
- Do not create multiple Lenis instances across nested components/routes.
- Add a proper cleanup for SPA route changes / React effects / theme lifecycle.
- Make in-page anchors work and verify menu, modal, cart drawer and nested scroll behavior.
- Respect reduced-motion preferences; fall back to native scroll when appropriate.
- If Lenis creates more problems than value in the existing architecture, keep native scrolling and use GSAP ScrollTrigger directly. Smooth scrolling is not a requirement at the expense of usability.

## GSAP usage

- Register plugins once in the correct client-side entry point.
- Use `gsap.context()` / framework-safe cleanup patterns for component-scoped animations where appropriate.
- Use `ScrollTrigger.matchMedia()` or current responsive equivalents for viewport-specific scenes.
- Create and kill triggers correctly during route changes/unmount.
- Refresh after image/font/layout changes only when necessary; avoid repeated refresh loops.
- For pinned scenes, animate inner elements, not the pinned element itself.
- Use markers only in development and remove/disable them in production.
- Check which GSAP plugins are available and licensed in the project. Do not assume a paid plugin is available. If SplitText is unavailable, use accessible markup/CSS masks or a legally available alternative.

## Motion behavior by section

- Hero: single composed reveal, subtle pointer response and one scroll transition.
- Proof strip: quick reveal; numbers readable immediately.
- Brand philosophy: headline mask reveal and restrained image movement.
- Formula chapter: the primary pinned/scrubbed sequence, if stable and justified.
- Product collection: staggered entry, micro hover states, no over-animation.
- Skin concerns: selection state transition and product result reveal.
- Social proof: gentle stagger or slider movement; preserve reading speed.
- AM/PM routine: clean content transitions; interaction must not depend on scroll.
- Brand story: campaign image reveal and editorial type.
- Footer: minimal reveal only.

---

# 7. INTERACTION, SHOPPING AND UX REQUIREMENTS

## Navigation

- Keep key routes discoverable: Shop, Bestsellers, Ingredients/Our Approach, About, Help.
- Preserve current navigation structure where it contains important routes.
- Add a search entry if the current site supports search.
- Cart icon shows real cart state/count.
- Header remains usable at every viewport width.

## Product discovery

- Product cards must use real store data.
- Category/concern links must go somewhere meaningful.
- Do not invent concern-to-product mappings; build them from existing approved merchandising/product data.
- Product cards should expose enough information for a confident click.

## Add to cart

- Use current Shopify/theme commerce implementation.
- Preserve selected variant, selling plan (if applicable), quantity, discounts, inventory behavior, and error states.
- Show an accessible confirmation and update cart count/state.
- Test cart drawer and cart page behavior.
- Never make a button that looks functional but does nothing.

## Newsletter

- Reuse the current newsletter integration and consent pattern.
- Validate fields and show meaningful success/error states.
- Do not store email addresses in localStorage or an unapproved third-party endpoint.

## Social proof and reviews

- Reuse existing approved review integration.
- Don't fake ratings or review counts.
- Don't display review excerpts without their source/permission.

## Mobile behavior

Mobile is a separate composition, not merely a smaller desktop:
- Reorder image, title, proof, and CTA for portrait reading.
- Use native touch scrolling by default unless Lenis has a measured benefit and remains comfortable.
- Disable pointer follower/custom cursor.
- Reduce or replace WebGL with a poster/image/video sequence when device performance requires it.
- Remove large pinned scenes that cause awkward mobile scroll distance.
- Keep product cards swipeable only if there are visible affordances and keyboard alternatives.
- Buttons and interactive targets should be comfortably touchable (aim for at least 44×44 CSS px).
- Avoid horizontal overflow.

---

# 8. TECHNICAL ARCHITECTURE AND CODE QUALITY

Adapt names and locations to the existing repo. The following is a conceptual organization, not a mandate to restructure a working theme.

For a React-based project, a possible organization is:

```text
src/
  components/
    layout/
      SiteHeader.*
      SiteFooter.*
      NavigationMenu.*
    home/
      HomeHero.*
      ProofStrip.*
      BrandPhilosophy.*
      FormulaExperience.*
      ProductCollection.*
      SkinConcernFinder.*
      CustomerResults.*
      DailyRitual.*
      BrandStory.*
      ClosingCampaign.*
    product/
      ProductCard.*
      ProductQuickAdd.*
  motion/
    MotionProvider.*
    lenis.*
    gsap.*
    useReducedMotion.*
  webgl/
    SkinSurfaceScene.*
    LiquidMaterial.*
    WebGLFallback.*
  styles/
    tokens.*
    typography.*
    motion.*
```

For Shopify Liquid, create focused sections/snippets and small theme assets following the theme's own architecture instead of importing a React component tree.

## Engineering rules

- Keep business data separate from presentation.
- Prefer server-rendered/HTML-first product content where the framework supports it.
- Do not make core content dependent on JavaScript.
- Lazy load below-the-fold media and noncritical code.
- Load hero-critical visual assets intentionally; do not lazy-load the main LCP image.
- Use dynamic import for Three.js and WebGL scene modules.
- Keep WebGL independent from commerce and navigation.
- Avoid global event listeners without cleanup.
- Avoid duplicating scroll/animation providers.
- Avoid unnecessary dependencies. Check existing dependency versions before installing.
- Do not use `any` or suppress errors to hide implementation problems in TypeScript.
- Preserve linting, formatting and naming conventions.
- Add comments only where non-obvious lifecycle/animation behavior needs explanation.
- Do not write a giant monolithic homepage component.
- Ensure route transitions and browser back behavior remain correct.

## Data architecture

Use actual product and collection data from the current store integration. If there is no live data access in a prototype, keep a clearly named mock data file and document every placeholder.

Concern mapping, routine steps, ingredient-to-product relationships, testimonials, proof-point values and featured products should be editable content—not constants embedded in animation timelines.

## Shopify-specific guardrails

- Preserve current cart, checkout, product variants, inventory, discounts, shipping markets, customer account and analytics functionality.
- In Liquid, use native `product`, `collection`, `routes`, localization and section settings rather than creating hardcoded routes.
- In headless projects, use the current Storefront API version and current repository's data/cache strategy. Shopify's Storefront API supports products, collections, search, cart and checkout handoff; Hydrogen is Shopify's supported toolkit for headless React storefronts, but do not migrate unless already appropriate.
- Do not expose Admin API tokens to the browser.
- Do not send customer data to WebGL or animation systems.
- Do not create a parallel checkout.
- Preserve consent-gated analytics and privacy requirements.

---

# 9. PERFORMANCE, ACCESSIBILITY, SEO AND QUALITY GATES

Awwwards-level design is not an excuse for a slow, inaccessible or confusing shop.

## Performance targets

Aim for strong real-world Core Web Vitals, measured on mobile as well as desktop:
- LCP: at or below 2.5s under good field conditions.
- INP: at or below 200ms.
- CLS: at or below 0.1.

Additional implementation goals:
- Render useful HTML and the hero fallback immediately.
- Avoid blocking the main thread with large synchronous JS.
- Keep the initial JS payload controlled; dynamically import WebGL and heavy animation code.
- Avoid shipping a 3D engine to users who never reach the relevant chapter if architecture permits.
- Compress images and textures; use responsive image sizing.
- Use explicit dimensions/aspect ratios to prevent layout shifts.
- Preload only genuinely critical assets (likely one hero font and/or hero visual, not every image).
- Avoid excessive scroll listeners and React state updates on every frame.
- Pause animation while offscreen or tab-hidden.
- Profile on a mid-range phone, not just a high-end desktop.

## Accessibility

- Semantic landmarks: header, nav, main, section, footer.
- Correct heading hierarchy; do not choose heading levels solely for visual size.
- All links and buttons work by keyboard.
- Visible focus indicators.
- Menu traps/restores focus correctly and closes with Escape.
- All interaction has a touch/keyboard alternative.
- Color contrast meets WCAG AA for body text and controls.
- Respect `prefers-reduced-motion: reduce`.
- When reduced motion is enabled, remove pinned scrub sequences, parallax, cursor effects and nonessential motion; show the meaningful static composition.
- Avoid flashing, fast strobing, large continuous motion and vestibularly uncomfortable movement.
- Decorative canvas has no redundant screen-reader output; content and controls remain HTML.
- Add useful alt text to meaningful images; use empty alt for decorative images.
- Form fields have labels, errors and status announcements.

## SEO

- Preserve current title, meta description, canonical URL and indexability unless you intentionally improve them with approved copy.
- Homepage gets one clear H1.
- Preserve internal links to products, collections, About, help and policies.
- Do not hide important textual content inside canvas or video.
- Maintain structured data already provided by Shopify/theme/apps. Do not add duplicate or fabricated Product/Review schema.
- Keep image alt text descriptive and factual.
- Ensure social sharing metadata is present.

## Browser and device testing

At minimum test:
- Latest Chrome desktop.
- Safari/WebKit if available.
- iOS Safari or responsive touch emulation.
- Android Chrome or responsive touch emulation.
- Desktop reduced-motion preference.
- Mobile reduced-motion preference.
- Keyboard-only navigation.
- WebGL disabled or unsupported.
- Slow network / throttled CPU where possible.
- Cart and add-to-cart flows.
- Menu, search, newsletter and all CTAs.

---

# 10. CONTENT AND CLAIMS RULES

Use a confident editorial voice, but every factual product/brand claim must be grounded in live store data or approved source content.

Approved direction for general brand copy:
- `Korean-inspired ingredients. Modern skincare science.`
- `Thoughtfully formulated essentials for your daily ritual.`
- `Ingredient heritage meets contemporary formulation.`
- `A more considered approach to everyday skincare.`

Before using these claims, verify current brand/legal guidance:
- “Cruelty-free”.
- “Clinically proven” or “clinically tested”.
- “Dermatologist recommended”.
- “Visible results” with a timeframe.
- Percentages/concentrations of an ingredient.
- “First”, “only”, “best”, “number one” or comparative superiority.
- Any guarantee, refund, free-shipping or delivery claim.

Do not invent scientific studies or cite unrelated research as evidence for a specific finished product. Ingredient research does not automatically substantiate a finished-product efficacy claim.

Do not state a product is suitable for everyone, hypoallergenic, non-comedogenic, pregnancy-safe, safe for sensitive skin, or compatible with all ingredients unless the exact statement is approved and evidenced.

---

# 11. DELIVERABLES

Complete the following in the repository:

1. **Redesigned homepage** — fully implemented, responsive, and connected to the existing commerce/data system.
2. **Reusable homepage sections/components** — modular and maintainable.
3. **Motion system** — one clean Lenis/GSAP setup where appropriate, with lifecycle cleanup and reduced-motion support.
4. **WebGL hero/formula experience** — lazy-loaded with static fallback and responsive quality tiers, or a clearly documented image/CSS-based equivalent if real assets/performance do not justify WebGL.
5. **Functional product interactions** — real product links, real variant-aware add-to-cart and real cart state.
6. **Mobile art direction** — not just breakpoint compression.
7. **Accessibility and performance fallbacks** — keyboard, touch, reduced motion, unsupported WebGL, slow device.
8. **Asset gap list** — identify missing commissioned product photography, campaign imagery, product 3D model, texture or video assets. Do not fabricate them.
9. **README/update note** — explain how to run, what changed, new dependencies, motion architecture, content sources, asset requirements and any limitations.
10. **QA report** — checks run, device/browser coverage, known issues, and what requires credentials or human brand/legal approval.

---

# 12. IMPLEMENTATION ORDER

Follow this order to prevent polishing the wrong thing:

## Phase 1 — Audit and foundation

- Inspect repo and live homepage patterns.
- Identify the commerce architecture.
- Preserve important routes and functionality.
- Establish design tokens, typography and global layout.
- Build header/footer foundation.

## Phase 2 — Hero proof of concept

- Build the first screen to a high level of polish.
- Create the visual composition and fallback first.
- Add the first scroll transition.
- Add WebGL only after the static visual is already strong.
- Test mobile and reduced motion now—not at the end.

**Do not move on until the hero looks intentional and premium at desktop and mobile widths.**

## Phase 3 — Story chapters

- Philosophy.
- Ingredient/formula experience.
- Product collection.
- Skin concern discovery.
- Customer results.
- AM/PM ritual.
- Brand story.
- Closing campaign.

## Phase 4 — E-commerce integration and responsive polish

- Product data.
- Variant/add-to-cart.
- Cart state.
- Search/navigation.
- Newsletter.
- Responsive art direction and touch behavior.

## Phase 5 — Performance, accessibility and final QA

- Remove unnecessary effects/dependencies.
- Audit JS and image payloads.
- Test reduced motion and WebGL fallback.
- Test keyboard interactions and all purchase paths.
- Fix overflow, layout shifts, console errors and broken links.
- Re-test all breakpoints after animation work.

---

# 13. DEFINITION OF DONE

Do not consider the project done just because the page compiles.

The project is complete when:

- The first viewport feels distinctive, art-directed and brand-specific.
- There is one memorable signature experience, not random effects everywhere.
- Visual transitions connect the page into a coherent narrative.
- The page clearly communicates what SeoulCeuticals sells and why the formulas are distinctive.
- Product imagery, prices, availability, ratings and CTAs are real and accurate.
- Product discovery and add-to-cart work.
- No existing commerce-critical behavior has regressed.
- The page has a purpose-built mobile layout.
- Animations are smooth on realistic hardware and do not make shopping harder.
- Reduced-motion and no-WebGL fallbacks are polished.
- No invented claims, testimonials, product images or proof points appear.
- No accessibility-critical content is hidden in canvas.
- No console errors, broken internal links, layout overflow or unresolved build errors remain.
- The README and QA report explain how the implementation works.

**Awwwards-level ambition is a creative quality target, not a guaranteed award.** Prioritize original art direction, coherence, craft, usability and performance over the number of effects or technologies used.

---

# 14. FINAL INSTRUCTION TO CLAUDE CODE

Start by inspecting the repository and report the actual framework, commerce architecture, existing components, and assets available. Then implement the homepage in that architecture.

Make strong creative decisions. Do not downgrade this into a generic template. Do not spend time creating a long proposal instead of building. Do not stop after the hero unless a genuine asset/credential blocker prevents the remaining work; in that case, finish every section possible with honest fallbacks and list the exact missing dependency.

The result should feel like a premium editorial skincare campaign brought to life through interaction: **clinical in clarity, organic in movement, editorial in composition, and frictionless in commerce.**

---

# REFERENCE LINKS

## Brand and current content
- SeoulCeuticals homepage: https://seoulceuticals.com/
- SeoulCeuticals About page: https://seoulceuticals.com/pages/about-us
- SeoulCeuticals all products: https://seoulceuticals.com/collections/all

## Inspiration
- Lovi: https://lovi.care/
- Dieux Skin: https://www.dieuxskin.com/
- Typology: https://www.typology.com/
- Aesop: https://www.aesop.com/
- Rhode: https://www.rhodeskin.com/
- COSRX: https://www.cosrx.com/
- Peach & Lily: https://www.peachandlily.com/
- Soft Services: https://softservices.com/
- Awwwards: https://www.awwwards.com/
- SiteInspire: https://www.siteinspire.com/
- Godly: https://godly.website/

## Technical documentation — consult versions compatible with the repo
- GSAP: https://gsap.com/docs/v3/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP ticker: https://gsap.com/docs/v3/GSAP/gsap.ticker/
- Lenis: https://github.com/darkroomengineering/lenis
- Three.js: https://threejs.org/docs/
- Shopify Storefront API: https://shopify.dev/docs/api/storefront/latest
- Shopify Hydrogen: https://shopify.dev/docs/api/hydrogen/latest
- Shopify headless overview: https://shopify.dev/docs/storefronts/headless/overview
- Web Vitals: https://web.dev/articles/vitals
- WCAG: https://www.w3.org/WAI/standards-guidelines/wcag/

**Important:** Always consult the documentation for the actual installed versions. Do not copy an API example from a different major version without checking compatibility.
