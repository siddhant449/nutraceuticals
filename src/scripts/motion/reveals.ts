import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './tokens.ts';
import { partitionForReveal } from '../../lib/reveal-partition.ts';

/**
 * Scroll reveals for [data-reveal="up|fade|mask|lines"]. Initial hidden states live in base.css
 * under html.motion, so without JS (or with reduced motion) content is simply visible.
 * Elements with [data-reveal-manual] are animated by their own section timeline instead.
 */
export function initReveals(root: ParentNode = document): void {
  if (!document.documentElement.classList.contains('motion')) return;
  const start = 'top 88%';

  const ups = gsap.utils
    .toArray<HTMLElement>(root.querySelectorAll('[data-reveal="up"]:not([data-reveal-manual])'));
  ScrollTrigger.batch(ups, {
    start,
    once: true,
    onEnter: (batch) => {
      const { instant, staggered, each } = partitionForReveal(batch as HTMLElement[], (el) => el.getBoundingClientRect().top);
      if (instant.length) gsap.set(instant, { opacity: 1, y: 0, overwrite: true });
      gsap.fromTo(
        staggered,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: motion.reveal, ease: motion.ease, stagger: each, overwrite: true },
      );
    },
  });

  root.querySelectorAll<HTMLElement>('[data-reveal="fade"]:not([data-reveal-manual])').forEach((el) => {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: motion.reveal, scrollTrigger: { trigger: el, start, once: true } });
  });

  root.querySelectorAll<HTMLElement>('[data-reveal="mask"]:not([data-reveal-manual])').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: motion.editorial, ease: 'power3.inOut', scrollTrigger: { trigger: el, start, once: true } },
    );
  });

  root.querySelectorAll<HTMLElement>('[data-reveal="lines"]:not([data-reveal-manual])').forEach((el) => {
    gsap.fromTo(
      el.querySelectorAll('.line > span'),
      { y: 0, yPercent: 105 },
      { y: 0, yPercent: 0, duration: motion.editorial, ease: motion.ease, stagger: 0.09, scrollTrigger: { trigger: el, start, once: true } },
    );
  });
}
