/** Modal <dialog> helpers: scroll lock (incl. Lenis via sc:lock), focus return, backdrop click. */
const openers = new WeakMap<HTMLDialogElement, HTMLElement | null>();

export function openDialog(dialog: HTMLDialogElement, opener?: HTMLElement | null): void {
  if (dialog.open) return;
  openers.set(dialog, opener ?? (document.activeElement as HTMLElement | null));
  dialog.showModal();
  document.documentElement.classList.add('is-locked');
  document.dispatchEvent(new CustomEvent('sc:lock'));
}

export function closeDialog(dialog: HTMLDialogElement): void {
  if (dialog.open) dialog.close();
}

export function wireDialog(dialog: HTMLDialogElement): void {
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    document.dispatchEvent(new CustomEvent('sc:unlock'));
    const opener = openers.get(dialog);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog(dialog);
    const closer = (e.target as HTMLElement).closest('[data-dialog-close]');
    if (closer) closeDialog(dialog);
  });
}
