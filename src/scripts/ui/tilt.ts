import gsap from 'gsap';
import { DESKTOP_MOTION_QUERY } from '../motion/tokens.ts';

const MAX_DEG = 4;

/** Restrained perspective tilt on product image stages (fine pointer, motion allowed only). */
export function initTilt(root: ParentNode = document): void {
  gsap.matchMedia().add(DESKTOP_MOTION_QUERY, () => {
    const stages = [...root.querySelectorAll<HTMLElement>('[data-tilt]')];
    const cleanups = stages.map((stage) => {
      gsap.set(stage, { transformPerspective: 900 });
      const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.6, ease: 'power3' });
      const move = (e: PointerEvent): void => {
        const r = stage.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * MAX_DEG * 2);
        rx(-((e.clientY - r.top) / r.height - 0.5) * MAX_DEG * 2);
      };
      const leave = (): void => {
        rx(0);
        ry(0);
      };
      stage.addEventListener('pointermove', move);
      stage.addEventListener('pointerleave', leave);
      return () => {
        stage.removeEventListener('pointermove', move);
        stage.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  });
}
