/** Before/after compare: a native range input drives the after-image clip (drag, click, arrows). */
export function initCompare(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-compare]').forEach((figure) => {
    const frame = figure.querySelector<HTMLElement>('.compare__frame');
    const range = figure.querySelector<HTMLInputElement>('.compare__range');
    if (!frame || !range) return;
    const update = (): void => {
      const value = Number(range.value);
      frame.style.setProperty('--pos', `${value}%`);
      range.setAttribute('aria-valuetext', `${100 - value}% after`);
    };
    range.addEventListener('input', update);
    update();
  });
}
