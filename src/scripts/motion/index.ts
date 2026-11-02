import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Registered unconditionally: matchMedia-driven scenes can activate later (e.g. the visitor turns
// reduced motion off mid-visit) even when the page loaded with reduced motion.
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let initialized = false;

const tick = (time: number): void => {
  // GSAP ticker time is in seconds; Lenis expects milliseconds.
  lenis?.raf(time * 1000);
};

/**
 * One scroll system for the page. Lenis only on fine pointers without reduced motion,
 * driven by the GSAP ticker (no autoRaf). Dialogs pause it via sc:lock / sc:unlock.
 */
export function initMotion(): { lenis: Lenis | null; enabled: boolean } {
  const root = document.documentElement;
  if (initialized) return { lenis, enabled: root.classList.contains('motion') };
  initialized = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    root.classList.remove('motion');
    root.classList.add('reduced-motion');
    return { lenis: null, enabled: false };
  }

  gsap.defaults({ ease: 'power3.out' });

  if (matchMedia('(pointer: fine)').matches) {
    // Anchor offset comes from html { scroll-padding-top }, which Lenis honours.
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('sc:lock', () => lenis?.stop());
    document.addEventListener('sc:unlock', () => lenis?.start());
  }

  return { lenis, enabled: true };
}

export const getLenis = (): Lenis | null => lenis;

/** Scroll to a document Y position through Lenis when active, natively otherwise. */
export function scrollToY(y: number): void {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

export function destroyMotion(): void {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  initialized = false;
}
