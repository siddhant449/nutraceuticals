/**
 * WAI-ARIA tabs: roving tabindex, ←/→/Home/End, automatic activation.
 * Markup: [data-tabs] > [role=tablist] > [role=tab][aria-controls]; panels [role=tabpanel].
 * Without JS every panel is visible (hidden is only applied here).
 */
export function initTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls') ?? ''));
    if (!tabs.length) return;
    group.classList.add('tabs-ready');

    const select = (index: number, focus = false): void => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = panels[i];
        if (panel) panel.hidden = !on;
      });
      if (focus) tabs[index]?.focus();
      // Keep the selected tab visible inside a horizontally scrolling tab row (mobile).
      const list = tabs[index]?.parentElement;
      const tab = tabs[index];
      if (list && tab && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: Math.max(0, tab.offsetLeft - list.offsetLeft - 16), behavior: 'smooth' });
      }
      group.dispatchEvent(new CustomEvent('tabs:change', { detail: { index } }));
    };

    const initial = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));
    select(initial);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const next =
          e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
          : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
          : e.key === 'Home' ? 0
          : e.key === 'End' ? last
          : -1;
        if (next < 0) return;
        e.preventDefault();
        select(next, true);
      });
    });
  });
}
