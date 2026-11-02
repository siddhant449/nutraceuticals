import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { fragmentShader, vertexShader } from './shaders.ts';

export interface DropLayout {
  /** centre of the droplet pair in canvas CSS px (top-left origin) */
  cx: number;
  cy: number;
  radiusA: number;
  radiusB: number;
  /** max half-separation in CSS px */
  sep: number;
}

export interface FormulaScene {
  setTints(a: string, b: string): void;
  setMerge(t: number): void;
  setPointer(x: number, y: number): void;
  setLayout(layout: DropLayout): void;
  resize(): void;
  render(time: number): void;
  destroy(): void;
}

/** Raw sRGB components — the shader writes display values directly (no colour management). */
const toVec3 = (hex: string): Vector3 => {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/** One renderer, one full-screen plane. Presentation only — no product or cart data. */
export function createFormulaScene(canvas: HTMLCanvasElement): FormulaScene {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uRes: { value: new Vector2(1, 1) },
    uCenter: { value: new Vector2(0, 0) },
    uRadiusA: { value: 100 },
    uRadiusB: { value: 90 },
    uSep: { value: 80 },
    uMerge: { value: 0 },
    uTime: { value: 0 },
    uPointer: { value: new Vector2(0, 0) },
    uTintA: { value: toVec3('#E9A88F') },
    uTintB: { value: toVec3('#E7B65C') },
    uBg: { value: toVec3('#292B28') },
    uMilk: { value: toVec3('#F3F0E9') },
  };
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false });
  scene.add(new Mesh(geometry, material));

  let layout: DropLayout = { cx: 0, cy: 0, radiusA: 100, radiusB: 90, sep: 80 };
  const pointerTarget = new Vector2(0, 0);

  const applyLayout = (): void => {
    const h = canvas.clientHeight;
    uniforms.uCenter.value.set(layout.cx * dpr, (h - layout.cy) * dpr);
    uniforms.uRadiusA.value = layout.radiusA * dpr;
    uniforms.uRadiusB.value = layout.radiusB * dpr;
    uniforms.uSep.value = layout.sep * dpr;
  };

  const resize = (): void => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w * dpr, h * dpr);
    applyLayout();
  };
  resize();

  return {
    setTints(a, b) {
      uniforms.uTintA.value.copy(toVec3(a));
      uniforms.uTintB.value.copy(toVec3(b));
    },
    setMerge(t) {
      uniforms.uMerge.value = Math.min(1, Math.max(0, t));
    },
    setPointer(x, y) {
      pointerTarget.set(x, y);
    },
    setLayout(next) {
      layout = next;
      applyLayout();
    },
    resize,
    render(time) {
      uniforms.uTime.value = time;
      uniforms.uPointer.value.lerp(pointerTarget, 0.06);
      renderer.render(scene, camera);
    },
    destroy() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
