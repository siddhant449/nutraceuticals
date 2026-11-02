/** Pure bag model. Persisted lines hold only variant ids, handles and quantities. */
export interface BagLine {
  variantId: number;
  handle: string;
  qty: number;
}

export const MAX_QTY = 10;
const CART_BASE = 'https://seoulceuticals.com/cart/';

const clampQty = (qty: number): number => (Number.isFinite(qty) ? Math.min(MAX_QTY, Math.floor(qty)) : 0);

export function addLine(lines: BagLine[], item: { variantId: number; handle: string }, qty = 1): BagLine[] {
  const existing = lines.find((l) => l.variantId === item.variantId);
  if (!existing) {
    const next = clampQty(qty);
    return next > 0 ? [...lines, { variantId: item.variantId, handle: item.handle, qty: next }] : lines;
  }
  return setQty(lines, item.variantId, existing.qty + qty);
}

export function setQty(lines: BagLine[], variantId: number, qty: number): BagLine[] {
  const next = clampQty(qty);
  if (next <= 0) return removeLine(lines, variantId);
  return lines.map((l) => (l.variantId === variantId ? { ...l, qty: next } : l));
}

export function removeLine(lines: BagLine[], variantId: number): BagLine[] {
  return lines.filter((l) => l.variantId !== variantId);
}

function isLine(v: unknown): v is BagLine {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return Number.isSafeInteger(o.variantId) && typeof o.handle === 'string' && typeof o.qty === 'number';
}

export function parseBag(json: string | null): BagLine[] {
  if (!json) return [];
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  // Merge duplicate lines for one variant, then clamp, so a hand-edited or legacy bag can never
  // produce two rows or a permalink like 1:6,1:6.
  return data.filter(isLine).reduce<BagLine[]>((lines, l) => {
    const qty = clampQty(l.qty);
    return qty > 0 ? addLine(lines, { variantId: l.variantId, handle: l.handle }, qty) : lines;
  }, []);
}

export function reconcile(lines: BagLine[], knownVariantIds: Set<number>): BagLine[] {
  return lines.filter((l) => knownVariantIds.has(l.variantId));
}

export function bagCount(lines: BagLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function subtotal(lines: BagLine[], priceOf: (variantId: number) => number | undefined): number {
  return lines.reduce((sum, l) => sum + (priceOf(l.variantId) ?? 0) * l.qty, 0);
}

/** Shopify cart permalink — hands the bag to the live store's real cart/checkout. */
export function checkoutUrl(lines: BagLine[]): string | null {
  const valid = lines.filter((l) => l.qty > 0);
  if (valid.length === 0) return null;
  return CART_BASE + valid.map((l) => `${l.variantId}:${l.qty}`).join(',');
}
