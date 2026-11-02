/** Motion tokens from the master brief §6 — tune by eye, keep in sync with tokens.css. */
export const motion = {
  fast: 0.25,
  standard: 0.65,
  reveal: 0.9,
  editorial: 1.15,
  stagger: 0.07,
  ease: 'power3.out',
  smooth: 'power2.inOut',
} as const;

export const DESKTOP_MOTION_QUERY =
  '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
