import { DESKTOP_MOTION_QUERY } from '../motion/tokens.ts';

/** WebGL only on capable desktop with motion allowed; everything else keeps the SVG drops. */
export function canUseWebGL(): boolean {
  if (!matchMedia(DESKTOP_MOTION_QUERY).matches) return false;
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
