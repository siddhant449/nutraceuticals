const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * Droplet merge amount for a pairing's local scroll progress (0..1). Mirrors the DOM timeline
 * (drops travel between local 0.06 and 0.44) and eases apart in the last 10% only when another
 * pairing follows, so the final pairing stays resolved.
 */
export function mergeFor(local: number, isLast: boolean): number {
  if (!isLast && local > 0.9) return 1 - clamp01((local - 0.9) / 0.1);
  return clamp01((local - 0.06) / 0.38);
}
