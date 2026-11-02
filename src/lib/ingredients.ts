const MARKER = 'Key ingredients';
const SEP = ' — ';

/**
 * Extracts ingredient names from a store description's "Key ingredients Name — text. Name — text." list.
 * A name runs from the previous sentence end (". ") to the next " — ", so "97.5% snail filtrate" stays whole.
 */
export function keyIngredients(description: string): string[] {
  const start = description.indexOf(MARKER);
  if (start < 0) return [];
  const parts = description.slice(start + MARKER.length).trim().split(SEP);
  const names: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    const segment = parts[i]!;
    const cut = i === 0 ? 0 : segment.lastIndexOf('. ') + 2;
    const name = segment.slice(cut).trim();
    if (name) names.push(name);
  }
  return names;
}
