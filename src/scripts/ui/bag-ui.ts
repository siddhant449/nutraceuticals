import { bagCount, checkoutUrl, type BagLine } from '../../lib/cart.ts';
import { formatMoney } from '../../lib/money.ts';
import { bag } from './bag-store.ts';
import { closeDialog, openDialog, wireDialog } from './dialog.ts';

const ADDED_MS = 1600;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderLine(line: BagLine): HTMLLIElement | null {
  const info = bag.info(line.variantId);
  if (!info) return null;
  const li = el('li', { class: 'bag-line', 'data-variant-id': String(line.variantId) });
  const img = el('img', { src: info.image, alt: '', width: '76', height: '76', loading: 'lazy' });
  const body = el('div');
  const title = el('a', { href: info.url, class: 'bag-line__title' }, info.title);
  const price = el('p', { class: 'bag-line__price tabular' }, formatMoney(info.price * line.qty));
  const row = el('div', { class: 'bag-line__row' });
  const qty = el('div', { class: 'qty', role: 'group', 'aria-label': `Quantity for ${info.title}` });
  qty.append(
    el('button', { type: 'button', 'data-qty': '-1', 'aria-label': `Decrease quantity of ${info.title}` }, '−'),
    el('output', { class: 'tabular', 'aria-live': 'polite' }, String(line.qty)),
    el('button', { type: 'button', 'data-qty': '1', 'aria-label': `Increase quantity of ${info.title}` }, '+'),
  );
  const remove = el('button', { type: 'button', class: 'bag-line__remove', 'data-remove': '' }, 'Remove');
  row.append(qty, remove);
  body.append(title, price, row);
  li.append(img, body);
  return li;
}

export function initBag(): void {
  bag.init();

  const drawer = document.querySelector<HTMLDialogElement>('[data-bag-drawer]');
  const list = document.querySelector<HTMLElement>('[data-bag-lines]');
  const empty = document.querySelector<HTMLElement>('[data-bag-empty]');
  const subtotalEl = document.querySelector<HTMLElement>('[data-bag-subtotal]');
  const checkout = document.querySelector<HTMLAnchorElement>('[data-bag-checkout]');
  const titleCount = document.querySelector<HTMLElement>('[data-bag-title-count]');
  const status = document.querySelector<HTMLElement>('[data-bag-status]');
  const counts = document.querySelectorAll<HTMLElement>('[data-bag-count]');
  const countLabels = document.querySelectorAll<HTMLElement>('[data-bag-count-label]');

  bag.subscribe((lines) => {
    const n = bagCount(lines);
    counts.forEach((c) => {
      c.textContent = String(n);
      c.classList.toggle('has-items', n > 0);
    });
    countLabels.forEach((c) => (c.textContent = `, ${n} ${n === 1 ? 'item' : 'items'}`));
    if (titleCount) titleCount.textContent = n ? `(${n})` : '';
    if (list) {
      const focusedVariant = (document.activeElement as HTMLElement | null)?.closest('.bag-line')?.getAttribute('data-variant-id');
      const focusedAction = (document.activeElement as HTMLElement | null)?.getAttribute('data-qty');
      list.replaceChildren(...lines.map(renderLine).filter((x): x is HTMLLIElement => x !== null));
      if (focusedVariant && focusedAction) {
        list.querySelector<HTMLElement>(`[data-variant-id="${focusedVariant}"] [data-qty="${focusedAction}"]`)?.focus();
      }
    }
    if (empty) empty.hidden = lines.length > 0;
    if (subtotalEl) subtotalEl.textContent = formatMoney(bag.subtotal());
    if (checkout) {
      const url = checkoutUrl(lines);
      if (url) {
        checkout.href = url;
        checkout.removeAttribute('aria-disabled');
      } else {
        checkout.removeAttribute('href');
        checkout.setAttribute('aria-disabled', 'true');
      }
    }
  });

  // Add-to-bag buttons anywhere on the page.
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-add-to-bag]');
    if (!btn || btn.disabled) return;
    const variantId = Number(btn.dataset.variantId);
    const info = bag.info(variantId);
    if (!info) return;
    bag.add(variantId, btn.dataset.handle ?? info.handle);
    const text = btn.querySelector<HTMLElement>('[data-add-text]');
    btn.dataset.state = 'added';
    if (text) text.textContent = 'Added';
    window.setTimeout(() => {
      delete btn.dataset.state;
      if (text) text.textContent = btn.dataset.label ?? 'Add to bag';
    }, ADDED_MS);
    const n = bagCount(bag.get());
    if (status) status.textContent = `${info.title} added to bag. ${n} ${n === 1 ? 'item' : 'items'} in bag.`;
  });

  if (!drawer || !list) return;
  wireDialog(drawer);
  document.querySelectorAll<HTMLElement>('[data-bag-open]').forEach((opener) =>
    opener.addEventListener('click', () => openDialog(drawer, opener)),
  );
  list.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>('.bag-line');
    if (!row) return;
    const variantId = Number(row.dataset.variantId);
    const line = bag.get().find((l) => l.variantId === variantId);
    if (!line) return;
    const step = target.closest<HTMLElement>('[data-qty]')?.dataset.qty;
    if (step) bag.setQty(variantId, line.qty + Number(step));
    else if (target.closest('[data-remove]')) {
      bag.remove(variantId);
      if (bag.get().length === 0) drawer.querySelector<HTMLElement>('[data-dialog-close]')?.focus();
    }
  });
  drawer.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', () => closeDialog(drawer)));
}
