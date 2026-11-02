import gsap from 'gsap';
import { DESKTOP_MOTION_QUERY, motion } from '../motion/tokens.ts';

/**
 * Hero "formula surface".
 * - Intro: the porcelain veil lifts off the cream macro, headline lines rise, the serum floats up
 *   into the gap between them, satellites and metadata settle.
 * - Idle: each product floats on its own slow sine (paused while the hero is off screen).
 * - Pointer (desktop): every [data-depth] layer drifts by its depth, so the stack reads in 3D;
 *   a soft light follows the pointer across the surface.
 * - First scroll: the two lines part sideways, the serum rises toward the viewer, satellites scatter.
 * Each concern animates its own wrapper, so tweens never fight over one transform.
 */
export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || !document.documentElement.classList.contains('motion')) return;
  const q = gsap.utils.selector(hero);

  gsap
    .timeline({ defaults: { ease: motion.ease } })
    .to(q('[data-hero-veil]'), { opacity: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
    .fromTo(q('[data-hero-bg-img]'), { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
    // y: 0 clears the px offset GSAP parses from the CSS pre-state.
    .fromTo(q('[data-hero-line]'), { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: motion.editorial, stagger: 0.14 }, 0.2)
    .fromTo(
      q('[data-hero-product]'),
      { opacity: 0, yPercent: 22, rotation: 7 },
      { opacity: 1, yPercent: 0, rotation: 0, duration: 1.6, ease: 'expo.out' },
      0.35,
    )
    .fromTo(q('[data-hero-sat]'), { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out' }, 0.6)
    .fromTo(q('[data-hero-meta]'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: motion.standard, stagger: motion.stagger }, 0.85);

  const float = (sel: string, y: number, rotation: number, duration: number): gsap.core.Tween =>
    gsap.to(q(sel), { y, rotation, duration, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  const floats = [
    float('[data-hero-float="main"]', -14, 1.4, 3.4),
    float('[data-hero-float="slow"]', 10, -2.2, 4.2),
    float('[data-hero-float="slower"]', -9, 2, 5),
  ];
  new IntersectionObserver(([entry]) => floats.forEach((t) => (entry?.isIntersecting ? t.play() : t.pause()))).observe(hero);

  gsap
    .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to(q('[data-hero-scroll="back"]'), { xPercent: -16 }, 0)
    .to(q('[data-hero-scroll="front"]'), { xPercent: 12 }, 0)
    .to(q('[data-hero-scroll="product"]'), { yPercent: -16, scale: 1.14, rotation: 5 }, 0)
    .to(q('[data-hero-scroll="sat-a"]'), { xPercent: -70, yPercent: -40, opacity: 0 }, 0)
    .to(q('[data-hero-scroll="sat-b"]'), { xPercent: 60, yPercent: -70, opacity: 0 }, 0)
    .to(q('[data-hero-scroll="foot"]'), { yPercent: -30, opacity: 0 }, 0)
    .to(q('[data-hero-bg]'), { yPercent: 10 }, 0);

  gsap.matchMedia().add(DESKTOP_MOTION_QUERY, () => {
    const layers = q('[data-depth]').map((el) => ({
      depth: Number(el.dataset.depth) || 0,
      x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }),
    }));
    const bg = q('[data-hero-bg]')[0];
    const lx = bg ? gsap.quickTo(bg, '--lx', { duration: 1.4, ease: 'power3' }) : null;
    const ly = bg ? gsap.quickTo(bg, '--ly', { duration: 1.4, ease: 'power3' }) : null;
    if (bg) gsap.set(bg, { '--lx': 64, '--ly': 34 });

    const onMove = (e: PointerEvent): void => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        l.x(-nx * l.depth);
        l.y(-ny * l.depth * 0.6);
      });
      lx?.((nx + 0.5) * 100);
      ly?.((ny + 0.5) * 100);
    };
    hero.addEventListener('pointermove', onMove);
    return () => hero.removeEventListener('pointermove', onMove);
  });
}
