import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_MOTION_QUERY } from '../motion/tokens.ts';
import { scrollToY } from '../motion/index.ts';
import { canUseWebGL } from './capability.ts';
import { mergeFor } from '../../lib/formula-merge.ts';
import type { FormulaScene } from './formula-scene.ts';

export interface FormulaProgressDetail {
  /** 0..1 across the whole pinned scene */
  progress: number;
  /** active pairing index */
  index: number;
  /** 0..1 within the active pairing */
  local: number;
}

/** Scene progress for the optional WebGL layer (Task 8) — the DOM owns the story. */
export const formulaEvents = new EventTarget();

const SEGMENT_SCROLL = 85; // % of viewport height per pairing

export function initFormula(): void {
  const section = document.querySelector<HTMLElement>('[data-formula]');
  if (!section) return;
  const articles = [...section.querySelectorAll<HTMLElement>('[data-pairing]')];
  const ticks = [...section.querySelectorAll<HTMLButtonElement>('[data-formula-tick]')];
  const motionOn = document.documentElement.classList.contains('motion');

  // Stacked layout (mobile, tablet, no pin): drops merge once as each card enters view.
  if (motionOn) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-merged');
          io.unobserve(e.target);
        }),
      { threshold: 0.4 },
    );
    articles.forEach((a) => io.observe(a));
  } else {
    articles.forEach((a) => a.classList.add('is-merged'));
  }

  gsap.matchMedia().add(DESKTOP_MOTION_QUERY, () => {
    const stage = section.querySelector<HTMLElement>('[data-formula-stage]');
    if (!stage) return;
    section.classList.add('is-pinned');
    articles.forEach((a) => a.classList.add('is-merged'));
    const n = articles.length;

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    articles.forEach((a, i) => {
      const q = gsap.utils.selector(a);
      const at = i;
      if (i > 0) {
        tl.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 0.08 }, at - 0.04);
        tl.fromTo(q('[data-pairing-side="a"]'), { opacity: 0, x: -48 }, { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' }, at);
        tl.fromTo(q('[data-pairing-side="b"]'), { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' }, at);
      }
      tl.fromTo(q('[data-drop="a"]'), { x: -112 }, { x: 0, duration: 0.38, ease: 'power1.inOut' }, at + 0.06)
        .fromTo(q('[data-drop="b"]'), { x: 116 }, { x: 0, duration: 0.38, ease: 'power1.inOut' }, at + 0.06)
        .fromTo(q('[data-pairing-render]'), { opacity: 0, scale: 0.8, y: 36 }, { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power2.out' }, at + 0.42)
        .fromTo(q('[data-pairing-result]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, at + 0.52);
      if (i < n - 1) tl.to(a, { opacity: 0, duration: 0.1 }, at + 0.9);
    });
    tl.to({}, { duration: 0.05 }, n - 0.05);

    const countEl = section.querySelector<HTMLElement>('[data-formula-count]');
    const nameEl = section.querySelector<HTMLElement>('[data-formula-name]');
    let shown = -1;
    const setActive = (idx: number): void => {
      if (idx === shown) return;
      shown = idx;
      ticks.forEach((t, k) => (k === idx ? t.setAttribute('aria-current', 'step') : t.removeAttribute('aria-current')));
      articles.forEach((a, k) => a.classList.toggle('is-active', k === idx));
      if (countEl) countEl.textContent = String(idx + 1).padStart(2, '0');
      if (nameEl) nameEl.textContent = ticks[idx]?.dataset.name ?? '';
    };
    setActive(0);

    const st = ScrollTrigger.create({
      animation: tl,
      trigger: stage,
      start: 'top top',
      end: `+=${n * SEGMENT_SCROLL}%`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const scaled = self.progress * n;
        const index = Math.min(n - 1, Math.floor(scaled));
        setActive(index);
        formulaEvents.dispatchEvent(
          new CustomEvent<FormulaProgressDetail>('progress', { detail: { progress: self.progress, index, local: scaled - index } }),
        );
      },
    });

    const scrollToPairing = (i: number): void => scrollToY(st.start + (st.end - st.start) * ((i + 0.62) / n));
    const onTick = (e: Event): void => scrollToPairing(Number((e.currentTarget as HTMLElement).dataset.formulaTick));
    ticks.forEach((t) => t.addEventListener('click', onTick));
    // Keyboard / screen-reader users moving into a pairing bring it on screen.
    const onFocusIn = (e: FocusEvent): void => {
      const article = (e.target as HTMLElement).closest<HTMLElement>('[data-pairing]');
      if (!article) return;
      const i = Number(article.dataset.pairing);
      if (i !== shown) scrollToPairing(i);
    };
    section.addEventListener('focusin', onFocusIn);

    const teardownWebGL = canUseWebGL() ? mountWebGL(section, stage) : () => {};

    return () => {
      ticks.forEach((t) => t.removeEventListener('click', onTick));
      section.removeEventListener('focusin', onFocusIn);
      articles.forEach((a) => a.classList.remove('is-active'));
      teardownWebGL();
      section.classList.remove('is-pinned');
    };
  });
}

/**
 * Lazily imports Three.js when the chapter approaches, renders only while the chapter is on
 * screen and the tab is visible, and disposes everything on teardown.
 */
function mountWebGL(section: HTMLElement, stage: HTMLElement): () => void {
  const canvas = section.querySelector<HTMLCanvasElement>('[data-formula-canvas]');
  const visual = section.querySelector<HTMLElement>('[data-pairing-visual]');
  if (!canvas || !visual) return () => {};
  const tints = JSON.parse(section.dataset.tints ?? '[]') as [string, string][];

  let scene: FormulaScene | null = null;
  let disposed = false;
  let onScreen = false;
  let rendering = false;
  const tintState = { a: tints[0]?.[0] ?? '#E9A88F', b: tints[0]?.[1] ?? '#E7B65C' };
  let currentIndex = 0;
  // Progress can arrive before the lazily imported scene exists (e.g. page loaded mid-chapter);
  // keep the latest so the scene starts in the right state.
  let lastDetail: FormulaProgressDetail | null = null;

  const layout = (): void => {
    if (!scene) return;
    const s = stage.getBoundingClientRect();
    const v = visual.getBoundingClientRect();
    const unit = v.width / 400; // SVG viewBox units → px
    scene.setLayout({
      cx: v.left - s.left + v.width / 2,
      cy: v.top - s.top + v.height / 2,
      radiusA: 118 * unit,
      radiusB: 108 * unit,
      sep: 114 * unit,
    });
    scene.resize();
  };

  const tick = (time: number): void => scene?.render(time);
  const updateLoop = (): void => {
    const shouldRender = !!scene && onScreen && document.visibilityState === 'visible';
    if (shouldRender && !rendering) gsap.ticker.add(tick);
    if (!shouldRender && rendering) gsap.ticker.remove(tick);
    rendering = shouldRender;
  };

  const applyInstant = (detail: FormulaProgressDetail): void => {
    if (!scene) return;
    currentIndex = detail.index;
    const [a, b] = tints[detail.index] ?? [tintState.a, tintState.b];
    tintState.a = a;
    tintState.b = b;
    scene.setTints(a, b);
    scene.setMerge(mergeFor(detail.local, detail.index === tints.length - 1));
  };

  const onProgress = (e: Event): void => {
    lastDetail = (e as CustomEvent<FormulaProgressDetail>).detail;
    const { index, local } = lastDetail;
    if (!scene) return;
    scene.setMerge(mergeFor(local, index === tints.length - 1));
    if (index !== currentIndex) {
      currentIndex = index;
      const [a, b] = tints[index] ?? [tintState.a, tintState.b];
      gsap.to(tintState, {
        a,
        b,
        duration: 0.65,
        ease: 'power2.inOut',
        onUpdate: () => scene?.setTints(tintState.a, tintState.b),
      });
    }
  };
  const onPointer = (e: PointerEvent): void => {
    const r = stage.getBoundingClientRect();
    scene?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };
  const onResize = (): void => layout();
  // A GPU reset or driver loss: fall back to the SVG drops instead of a blank canvas.
  const onLost = (): void => {
    section.classList.remove('has-webgl');
    gsap.ticker.remove(tick);
    rendering = false;
  };
  canvas.addEventListener('webglcontextlost', onLost);
  const onVisibility = (): void => updateLoop();

  const visibility = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      onScreen = self.isActive;
      updateLoop();
    },
  });

  const loader = new IntersectionObserver(
    async ([entry]) => {
      if (!entry?.isIntersecting || scene) return;
      loader.disconnect();
      try {
        const { createFormulaScene } = await import('./formula-scene.ts');
        if (disposed) return;
        scene = createFormulaScene(canvas);
        scene.setTints(tintState.a, tintState.b);
        if (lastDetail) applyInstant(lastDetail);
        layout();
        scene.render(0);
        section.classList.add('has-webgl');
        onScreen = visibility.isActive;
        updateLoop();
      } catch {
        section.classList.remove('has-webgl'); // SVG drops remain
      }
    },
    { rootMargin: '50% 0px' },
  );
  loader.observe(section);

  formulaEvents.addEventListener('progress', onProgress);
  stage.addEventListener('pointermove', onPointer);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  ScrollTrigger.addEventListener('refresh', onResize);

  return () => {
    disposed = true;
    loader.disconnect();
    visibility.kill();
    gsap.ticker.remove(tick);
    formulaEvents.removeEventListener('progress', onProgress);
    stage.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    ScrollTrigger.removeEventListener('refresh', onResize);
    canvas.removeEventListener('webglcontextlost', onLost);
    scene?.destroy();
    scene = null;
    section.classList.remove('has-webgl');
    // destroy() force-loses the context; swap in a fresh canvas so a later mount can get a new one.
    canvas.replaceWith(canvas.cloneNode(false));
  };
}
