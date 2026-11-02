import gsap from 'gsap';

/** Small-range scrubbed parallax for [data-parallax="<yPercent>"] (tablet/desktop, motion allowed). */
export function initParallax(): void {
  if (!document.documentElement.classList.contains('motion')) return;
  gsap.matchMedia().add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax) || 0;
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });
}
