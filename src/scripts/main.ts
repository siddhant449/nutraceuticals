/**
 * Single client entry. Order matters: the motion system (ScrollTrigger + Lenis) is created
 * before any section registers scroll-driven animation.
 *
 * Every initialiser is isolated: if one throws, the error is logged, the others still run, and
 * html.motion is removed so no content is left in a hidden pre-reveal state. motionReady is set
 * only after all of them, which disarms the 3 s failsafe in BaseLayout's inline head script.
 */
import { initMotion } from './motion/index.ts';
import { initReveals } from './motion/reveals.ts';
import { initParallax } from './motion/parallax.ts';
import { initHeader } from './ui/header.ts';
import { initBag } from './ui/bag-ui.ts';
import { initHero } from './sections/hero.ts';
import { initFormula } from './webgl/formula-controller.ts';
import { initTilt } from './ui/tilt.ts';
import { initTabs } from './ui/tabs.ts';
import { initCompare } from './ui/compare.ts';
import { initInterlude } from './sections/interlude.ts';
import { initRitual } from './sections/ritual.ts';

const root = document.documentElement;
const steps: [string, () => unknown][] = [
  ['motion', initMotion],
  ['header', initHeader],
  ['bag', initBag],
  ['tabs', initTabs],
  ['compare', initCompare],
  ['hero', initHero],
  ['formula', initFormula],
  ['interlude', initInterlude],
  ['ritual', initRitual],
  ['reveals', initReveals],
  ['parallax', initParallax],
  ['tilt', initTilt],
];

for (const [name, init] of steps) {
  try {
    init();
  } catch (error) {
    console.error(`[seoulceuticals] ${name} failed to initialise`, error);
    root.classList.remove('motion');
  }
}
root.dataset.motionReady = 'true';
