import { describe, expect, it } from 'vitest';
import { getProduct } from '../src/lib/catalog.ts';
import { keyIngredients } from '../src/lib/ingredients.ts';

describe('keyIngredients', () => {
  it('reads names from the "Key ingredients" list, keeping decimals intact', () => {
    const d = 'Intro text. Key ingredients 97.5% snail filtrate — hydrates. Vitamin C — brightens. Ferulic acid — stabilises vitamin C.';
    expect(keyIngredients(d)).toEqual(['97.5% snail filtrate', 'Vitamin C', 'Ferulic acid']);
  });

  it('returns an empty list when there is no ingredient section', () => {
    expect(keyIngredients('Just a description.')).toEqual([]);
  });

  it('parses the live Day Glow description', () => {
    expect(keyIngredients(getProduct('day-glow-serum').description).slice(0, 3)).toEqual(['Vitamin C', 'Ferulic acid', 'Vitamin E']);
  });

  it('parses the live Snail Repair Cream description including its first item', () => {
    expect(keyIngredients(getProduct('multi-function-all-in-one-anti-aging-snail-repair-cream').description)[0]).toBe('97.5% concentration snail filtrate');
  });
});
