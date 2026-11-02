const DESIGNED_STAGGER = 0.07;
const MAX_TOTAL_STAGGER = 0.5;
const PASSED_THRESHOLD = -40;

/**
 * Splits a batch of entering elements: those already scrolled past (e.g. after an anchor jump)
 * appear instantly; the rest stagger, with the total stagger capped so a long jump never leaves
 * the landing section blank while a queue of off-screen reveals plays.
 */
export function partitionForReveal<T>(
  items: T[],
  topOf: (item: T) => number,
): { instant: T[]; staggered: T[]; each: number } {
  const instant = items.filter((i) => topOf(i) < PASSED_THRESHOLD);
  const staggered = items.filter((i) => topOf(i) >= PASSED_THRESHOLD);
  const each = staggered.length > 1 ? Math.min(DESIGNED_STAGGER, MAX_TOTAL_STAGGER / (staggered.length - 1)) : DESIGNED_STAGGER;
  return { instant, staggered, each };
}
