import { describe, expect, it } from 'vitest';
import { mergeFor } from '../src/lib/formula-merge.ts';

describe('mergeFor', () => {
  it('keeps drops apart before 6% of a pairing and merged after 44%', () => {
    expect(mergeFor(0, false)).toBe(0);
    expect(mergeFor(0.06, false)).toBe(0);
    expect(mergeFor(0.25, false)).toBeCloseTo(0.5, 5);
    expect(mergeFor(0.44, false)).toBe(1);
    expect(mergeFor(0.8, false)).toBe(1);
  });
  it('eases apart at the end of a pairing when another follows', () => {
    expect(mergeFor(0.95, false)).toBeCloseTo(0.5, 5);
    expect(mergeFor(1, false)).toBeCloseTo(0, 10);
  });
  it('stays merged at the end of the last pairing', () => {
    expect(mergeFor(0.95, true)).toBe(1);
    expect(mergeFor(1, true)).toBe(1);
  });
});
