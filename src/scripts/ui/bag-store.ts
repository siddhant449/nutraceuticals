import {
  addLine,
  parseBag,
  reconcile,
  removeLine,
  setQty,
  subtotal,
  type BagLine,
} from '../../lib/cart.ts';

export interface BagItemInfo {
  handle: string;
  title: string;
  price: number;
  image: string;
  url: string;
}

type Listener = (lines: BagLine[]) => void;

const KEY = 'sc-bag-v1';
let lines: BagLine[] = [];
let catalog = new Map<number, BagItemInfo>();
const listeners = new Set<Listener>();

function readCatalog(): Map<number, BagItemInfo> {
  const el = document.getElementById('bag-catalog');
  if (!el?.textContent) return new Map();
  try {
    const raw = JSON.parse(el.textContent) as Record<string, { h: string; t: string; p: number; i: string; u: string }>;
    return new Map(
      Object.entries(raw).map(([id, v]) => [Number(id), { handle: v.h, title: v.t, price: v.p, image: v.i, url: v.u }]),
    );
  } catch {
    return new Map();
  }
}

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable (private mode, blocked) — keep the in-memory bag */
  }
}

function commit(next: BagLine[]): void {
  lines = next;
  persist();
  listeners.forEach((fn) => fn(lines));
}

function load(): void {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  lines = reconcile(parseBag(raw), new Set(catalog.keys()));
}

export const bag = {
  init(): void {
    catalog = readCatalog();
    load();
    window.addEventListener('storage', (e) => {
      if (e.key !== KEY) return;
      lines = reconcile(parseBag(e.newValue), new Set(catalog.keys()));
      listeners.forEach((fn) => fn(lines));
    });
  },
  get: (): BagLine[] => lines,
  info: (variantId: number): BagItemInfo | undefined => catalog.get(variantId),
  subtotal: (): number => subtotal(lines, (id) => catalog.get(id)?.price),
  add(variantId: number, handle: string): void {
    if (!catalog.has(variantId)) return;
    commit(addLine(lines, { variantId, handle }));
  },
  setQty(variantId: number, qty: number): void {
    commit(setQty(lines, variantId, qty));
  },
  remove(variantId: number): void {
    commit(removeLine(lines, variantId));
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn(lines);
    return () => listeners.delete(fn);
  },
};
