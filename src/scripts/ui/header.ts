import { closeDialog, openDialog, wireDialog } from './dialog.ts';

/** Header turns solid once the page scrolls past the sentinel; mobile menu dialog. */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');
  if (header && sentinel) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry?.isIntersecting);
    }).observe(sentinel);
  }

  // Sections with data-header-theme="dark" switch the header to its dark treatment while they sit
  // under the header band. The theme can change live (the ritual's night mode) via sc:header-theme.
  const themed = document.querySelectorAll<HTMLElement>('[data-header-theme]');
  if (header && themed.length) {
    const under = new Set<HTMLElement>();
    const update = (): void => {
      header.classList.toggle('is-dark', [...under].some((s) => s.dataset.headerTheme === 'dark'));
    };
    const band = (): string => `0px 0px -${Math.max(0, window.innerHeight - header.offsetHeight)}px 0px`;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? under.add(e.target as HTMLElement) : under.delete(e.target as HTMLElement)));
        update();
      },
      { rootMargin: band() },
    );
    themed.forEach((s) => io.observe(s));
    document.addEventListener('sc:header-theme', update);
  }

  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLElement>('[data-menu-open]');
  if (!menu || !openBtn) return;
  wireDialog(menu);
  openBtn.addEventListener('click', () => openDialog(menu, openBtn));
  menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => closeDialog(menu));
  });
}
