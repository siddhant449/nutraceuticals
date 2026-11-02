/**
 * "Two drops, one formula": two milky droplets (heritage ingredient + modern active) on graphite.
 * Signed-distance metaballs joined with a smooth-min whose blend widens as uMerge → 1.
 * Shading is deliberately restrained — soft subsurface gradient, a faint rim, one soft highlight,
 * low-frequency wobble and fine grain. No bloom, no glow halo, no hue shifts beyond the tints.
 */
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uRes;       // drawing buffer size (px)
  uniform vec2 uCenter;    // droplet pair centre (px, GL origin bottom-left)
  uniform float uRadiusA;  // px
  uniform float uRadiusB;  // px
  uniform float uSep;      // max half-separation (px)
  uniform float uMerge;    // 0 apart → 1 merged
  uniform float uTime;
  uniform vec2 uPointer;   // -1..1
  uniform vec3 uTintA;
  uniform vec3 uTintB;
  uniform vec3 uBg;
  uniform vec3 uMilk;

  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  // Interleaved gradient noise for grain — no sin() moiré at large pixel coordinates.
  float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float alphaInside(float d) { return 1.0 - smoothstep(-12.0, 0.0, d); }
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  void main() {
    vec2 p = gl_FragCoord.xy;
    float r = max(uRadiusA, uRadiusB);
    float ease = uMerge * uMerge * (3.0 - 2.0 * uMerge);
    float sep = uSep * (1.0 - ease);

    vec2 drift = uPointer * r * 0.035;
    vec2 a = uCenter + vec2(-sep, 0.0) + drift;
    vec2 b = uCenter + vec2(sep, 0.0) - drift * 0.6;

    // Low-frequency surface wobble (≤ ~2% of radius).
    float w = (noise(p / (r * 0.55) + uTime * 0.05) - 0.5) * r * 0.04;

    float dA = length(p - a) - uRadiusA + w;
    float dB = length(p - b) - uRadiusB + w;
    float k = r * mix(0.35, 0.9, ease);
    float d = smin(dA, dB, k);

    // Background: graphite with a faint central lift + fine grain.
    vec2 uv = p / uRes;
    float vign = smoothstep(1.1, 0.15, length(uv - vec2(0.5, 0.52)));
    vec3 bg = uBg * (0.92 + 0.12 * vign);
    bg += (ign(p + floor(fract(uTime * 0.5) * 64.0) * 5.588238) - 0.5) * 0.025;

    // Droplet colour: tints weighted by proximity, milk toward the core and the light.
    float wa = 1.0 / max(1.0, dA + uRadiusA);
    float wb = 1.0 / max(1.0, dB + uRadiusB);
    vec3 tint = mix(uTintB, uTintA, wa / (wa + wb));
    float depth = clamp(-d / r, 0.0, 1.0);
    vec2 light = (uCenter + vec2(-0.32, 0.38) * r);
    float lit = 1.0 - clamp(length(p - light) / (r * 1.6), 0.0, 1.0);
    vec3 col = mix(tint, uMilk, pow(depth, 0.7) * 0.45 + lit * 0.3);

    float rim = 1.0 - smoothstep(0.0, r * 0.2, -d);
    col = mix(col, uMilk, rim * 0.22);
    float spec = smoothstep(r * 0.2, 0.0, length(p - light - vec2(r * 0.06, -r * 0.04)));
    col += spec * 0.1 * alphaInside(d);

    // Soft contact shadow under the merged droplet, kept subtle.
    float shadow = smoothstep(r * 1.4, 0.0, length((p - uCenter - vec2(0.0, -r * 1.05)) * vec2(0.55, 2.2)));
    bg *= 1.0 - shadow * 0.25;

    float alpha = 1.0 - smoothstep(-1.5, 1.5, d);
    gl_FragColor = vec4(mix(bg, col, alpha), 1.0);
  }
`;
