import { describe, expect, it } from 'vitest';
import { formatMoney, savingsPercent } from '../src/lib/money.ts';

describe('formatMoney', () => {
  it('formats cents as USD', () => {
    expect(formatMoney(1998)).toBe('$19.98');
    expect(formatMoney(10891)).toBe('$108.91');
    expect(formatMoney(5000)).toBe('$50.00');
  });
});

describe('savingsPercent', () => {
  it('rounds the discount against compare-at', () => {
    expect(savingsPercent(1998, 2299)).toBe(13);
    expect(savingsPercent(2099, 2499)).toBe(16);
  });
  it('is null without a real discount', () => {
    expect(savingsPercent(1998, null)).toBeNull();
    expect(savingsPercent(1998, 1998)).toBeNull();
    expect(savingsPercent(1998, 1500)).toBeNull();
    expect(savingsPercent(1998, 2005)).toBeNull(); // 0.35 % would round to "Save 0%"
  });
});
