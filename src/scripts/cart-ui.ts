/**
 * Verbindet den Warenkorb mit der Seite:
 * - Buttons mit `data-add-to-cart="<produkt>"` legen in den Warenkorb
 *   (`data-then="checkout"` springt danach zum Bestellformular)
 * - Elemente mit `data-cart-count` zeigen die Anzahl Artikel
 * - kurze Bestaetigung (Toast) nach dem Hinzufuegen
 */
import { productById, type ProductId } from '../config/shop';
import { SITE } from '../config/site';
import { addToCart, cartCount, getCart, onCartChange } from './cart';

const ORDER_SECTION_ID = 'bestellen';

function renderCount(): void {
  const count = cartCount(getCart());
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

let toastTimer: number | undefined;

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('[data-cart-toast]');
  if (!toast) return;
  const text = toast.querySelector<HTMLElement>('[data-cart-toast-text]');
  if (text) text.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    window.setTimeout(() => (toast.hidden = true), 300);
  }, 3200);
}

export function goToCheckout(): void {
  const target = document.getElementById(ORDER_SECTION_ID);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.href = SITE.orderAnchor;
  }
}

function bindAddButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.addToCart as ProductId;
      const qty = Number(button.dataset.qty ?? 1);
      addToCart(id, qty, 'button');
      if (button.dataset.then === 'checkout') {
        goToCheckout();
      } else {
        showToast(`${productById(id).name} im Warenkorb`);
      }
    });
  });
}

renderCount();
bindAddButtons();
onCartChange(renderCount);
