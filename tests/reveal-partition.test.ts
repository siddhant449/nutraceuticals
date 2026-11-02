import { describe, expect, it } from 'vitest';
import { partitionForReveal } from '../src/lib/reveal-partition.ts';

describe('partitionForReveal', () => {
  it('shows elements already scrolled past instantly and staggers the rest', () => {
    const items = [{ id: 'a', top: -900 }, { id: 'b', top: -10 }, { id: 'c', top: 120 }, { id: 'd', top: 700 }];
    const { instant, staggered } = partitionForReveal(items, (i) => i.top);
    expect(instant.map((i) => i.id)).toEqual(['a']);
    expect(staggered.map((i) => i.id)).toEqual(['b', 'c', 'd']);
  });
  it('caps the stagger so a large jump never delays content by more than ~0.5s', () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ top: i * 10 }));
    const { each } = partitionForReveal(many, (i) => i.top);
    expect(each * (many.length - 1)).toBeLessThanOrEqual(0.5 + 1e-9);
  });
  it('keeps the designed stagger for small batches', () => {
    expect(partitionForReveal([{ top: 0 }, { top: 10 }], (i) => i.top).each).toBe(0.07);
  });
});
