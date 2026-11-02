import { describe, expect, it } from 'vitest';
import { safeJson } from '../src/lib/safe-json.ts';

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe('safeJson', () => {
  it('cannot close the surrounding <script> element or open a comment', () => {
    const value = { t: 'Serum </script><script>alert(1)</script> <!--' };
    const out = safeJson(value);
    expect(out.toLowerCase()).not.toContain('</script');
    expect(out).not.toContain('<!--');
    expect(JSON.parse(out)).toEqual(value);
  });
  it('escapes JS line separators', () => {
    const value = { t: `a${LS}b${PS}c` };
    const out = safeJson(value);
    expect(out.includes(LS) || out.includes(PS)).toBe(false);
    expect(JSON.parse(out)).toEqual(value);
  });
});
