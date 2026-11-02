import { describe, expect, it } from 'vitest';
import {
  MAX_QTY, addLine, bagCount, checkoutUrl, parseBag, reconcile, removeLine, setQty, subtotal, type BagLine,
} from '../src/lib/cart.ts';

const a = { variantId: 1, handle: 'a' };

describe('bag lines', () => {
  it('adds and merges quantities', () => {
    let b = addLine([], a);
    b = addLine(b, a, 2);
    expect(b).toEqual([{ variantId: 1, handle: 'a', qty: 3 }]);
  });

  it('does not mutate the input', () => {
    const start: BagLine[] = [{ variantId: 1, handle: 'a', qty: 1 }];
    addLine(start, a);
    expect(start[0]!.qty).toBe(1);
  });

  it('removes a line when qty is zero, negative or NaN', () => {
    const b = addLine([], a, 3);
    expect(setQty(b, 1, 0)).toEqual([]);
    expect(setQty(b, 1, -4)).toEqual([]);
    expect(setQty(b, 1, Number.NaN)).toEqual([]);
  });

  it('clamps quantity at MAX_QTY', () => {
    const b = addLine([], a);
    expect(MAX_QTY).toBe(10);
    expect(setQty(b, 1, 99)[0]!.qty).toBe(10);
    expect(addLine(setQty(b, 1, 10), a)[0]!.qty).toBe(10);
    expect(addLine([], a, 50)[0]!.qty).toBe(10);
  });

  it('removes a line by variant', () => {
    const b = addLine(addLine([], a), { variantId: 2, handle: 'b' });
    expect(removeLine(b, 1)).toEqual([{ variantId: 2, handle: 'b', qty: 1 }]);
  });

  it('counts items', () => {
    expect(bagCount([{ variantId: 1, handle: 'a', qty: 2 }, { variantId: 2, handle: 'b', qty: 3 }])).toBe(5);
  });
});

describe('persistence', () => {
  it('parses garbage and null as an empty bag', () => {
    expect(parseBag('not json')).toEqual([]);
    expect(parseBag(null)).toEqual([]);
    expect(parseBag('{"variantId":1}')).toEqual([]);
  });

  it('drops malformed lines and clamps quantities', () => {
    expect(parseBag('[{"variantId":"x"},{"variantId":5,"handle":"e","qty":40},{"variantId":6,"handle":"f","qty":0}]'))
      .toEqual([{ variantId: 5, handle: 'e', qty: 10 }]);
  });

  it('merges duplicate stored lines for one variant and clamps the total', () => {
    expect(parseBag('[{"variantId":1,"handle":"a","qty":6},{"variantId":1,"handle":"a","qty":6}]'))
      .toEqual([{ variantId: 1, handle: 'a', qty: 10 }]);
  });

  it('reconciles against known variants', () => {
    expect(reconcile([{ variantId: 1, handle: 'a', qty: 1 }, { variantId: 2, handle: 'b', qty: 1 }], new Set([2])))
      .toEqual([{ variantId: 2, handle: 'b', qty: 1 }]);
  });
});

describe('checkout', () => {
  it('is null for an empty bag', () => {
    expect(checkoutUrl([])).toBeNull();
  });

  it('builds a Shopify cart permalink', () => {
    expect(checkoutUrl([{ variantId: 11, handle: 'a', qty: 2 }, { variantId: 22, handle: 'b', qty: 1 }]))
      .toBe('https://seoulceuticals.com/cart/11:2,22:1');
  });

  it('sums the subtotal from a price lookup, ignoring unknown variants', () => {
    expect(subtotal([{ variantId: 11, handle: 'a', qty: 2 }, { variantId: 99, handle: 'z', qty: 1 }], (id) => (id === 11 ? 1998 : undefined)))
      .toBe(3996);
  });
});
