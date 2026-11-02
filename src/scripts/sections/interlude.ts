import gsap from 'gsap';
import { DESKTOP_MOTION_QUERY } from '../motion/tokens.ts';

/**
 * Red-gel quote interlude: a drop of serum spreads from a small ellipse to full-bleed as the
 * section scrolls in (scrubbed), the texture settles from 1.25× to 1×, the gel drifts slowly while
 * on screen, and on desktop a soft light follows the pointer across the surface.
 */
export function initInterlude(): void {
  const section = document.querySelector<HTMLElement>('[data-interlude]');
  if (!section || !document.documentElement.classList.contains('motion')) return;
  const mask = section.querySelector<HTMLElement>('[data-interlude-mask]');
  const scale = section.querySelector<HTMLElement>('[data-interlude-scale]');
  if (!mask || !scale) return;

  // Only animate the drift while visible.
  new IntersectionObserver(([entry]) => section.classList.toggle('is-live', !!entry?.isIntersecting)).observe(section);

  const scrub = { trigger: section, start: 'top bottom', end: 'top 15%', scrub: 0.8 };
  gsap.fromTo(
    mask,
    { clipPath: 'ellipse(9% 7% at 50% 52%)' },
    { clipPath: 'ellipse(85% 90% at 50% 50%)', ease: 'power2.inOut', scrollTrigger: scrub },
  );
  gsap.fromTo(scale, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { ...scrub, end: 'bottom top' } });

  gsap.matchMedia().add(DESKTOP_MOTION_QUERY, () => {
    const lx = gsap.quickTo(mask, '--lx', { duration: 1.2, ease: 'power3' });
    const ly = gsap.quickTo(mask, '--ly', { duration: 1.2, ease: 'power3' });
    gsap.set(mask, { '--lx': 62, '--ly': 38 });
    const onMove = (e: PointerEvent): void => {
      const r = mask.getBoundingClientRect();
      lx(((e.clientX - r.left) / r.width) * 100);
      ly(((e.clientY - r.top) / r.height) * 100);
    };
    mask.addEventListener('pointermove', onMove);
    return () => mask.removeEventListener('pointermove', onMove);
  });
}
