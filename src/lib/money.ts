const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}

/** Whole-percent saving against compare-at, or null when there is no genuine discount. */
export function savingsPercent(price: number, compareAt: number | null): number | null {
  if (compareAt === null || compareAt <= price) return null;
  const pct = Math.round(((compareAt - price) / compareAt) * 100);
  return pct >= 1 ? pct : null;
}
