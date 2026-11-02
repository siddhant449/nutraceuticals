import gsap from 'gsap';

type Time = 'AM' | 'PM';
const ORB_POSITION: Record<Time, number> = { AM: 0.16, PM: 0.84 };

/**
 * AM/PM switch: flips the section between day and night (CSS owns colour, layout and the
 * morning-only step), moves the orb along the dashed day arc, and announces the routine.
 */
export function initRitual(): void {
  const section = document.querySelector<HTMLElement>('[data-ritual]');
  if (!section) return;
  const buttons = [...section.querySelectorAll<HTMLButtonElement>('[data-ritual-time]')];
  const caption = section.querySelector<HTMLElement>('[data-ritual-caption]');
  const path = section.querySelector<SVGPathElement>('[data-ritual-path]');
  const orb = section.querySelector<HTMLElement>('[data-ritual-orb]');
  const captions = JSON.parse(section.dataset.captions ?? '{}') as Partial<Record<Time, string>>;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Orb position along the arc, in fractions of the arc box (viewBox is 1000 × 100, stretched).
  const placeOrb = (t: number): void => {
    if (!path || !orb) return;
    const p = path.getPointAtLength(path.getTotalLength() * t);
    orb.style.setProperty('--orb-x', String(p.x / 1000));
    orb.style.setProperty('--orb-y', String(p.y / 100));
  };
  const orbState = { t: ORB_POSITION.AM };
  placeOrb(orbState.t);

  const setTime = (time: Time): void => {
    if (section.dataset.time === time) return;
    section.dataset.time = time;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ritualTime === time)));
    if (caption) caption.textContent = captions[time] ?? '';
    section.dataset.headerTheme = time === 'PM' ? 'dark' : 'light';
    document.dispatchEvent(new CustomEvent('sc:header-theme'));
    gsap.to(orbState, {
      t: ORB_POSITION[time],
      duration: reduced.matches ? 0 : 1.2,
      ease: 'power2.inOut',
      onUpdate: () => placeOrb(orbState.t),
    });
  };

  buttons.forEach((b) => b.addEventListener('click', () => setTime(b.dataset.ritualTime as Time)));
}
