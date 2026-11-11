/**
 * Warenkorb im Browser. Zustand liegt in localStorage (falls verfuegbar),
 * Aenderungen werden als `cart:change`-Event auf window verteilt.
 */
import {
  EMPTY_QUANTITIES,
  MAX_QTY_PER_PRODUCT,
  PRODUCTS,
  type ProductId,
  type Quantities,
} from '../config/shop';

const STORAGE_KEY = 'fritz-cart-v1';
export const CART_EVENT = 'cart:change';

let state: Quantities = load();

function load(): Quantities {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_QUANTITIES };
    const parsed = JSON.parse(raw) as Partial<Quantities>;
    const result = { ...EMPTY_QUANTITIES };
    for (const p of PRODUCTS) result[p.id] = clamp(Number(parsed[p.id] ?? 0));
    return result;
  } catch {
    return { ...EMPTY_QUANTITIES };
  }
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Privater Modus o.ae.: Warenkorb gilt dann nur fuer diesen Seitenaufruf.
  }
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(MAX_QTY_PER_PRODUCT, Math.max(0, Math.round(n)));
}

function emit(source: string): void {
  save();
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { cart: getCart(), source } }));
}

export function getCart(): Quantities {
  return { ...state };
}

export function setQty(id: ProductId, qty: number, source = 'set'): void {
  state = { ...state, [id]: clamp(qty) };
  emit(source);
}

export function addToCart(id: ProductId, qty = 1, source = 'add'): void {
  setQty(id, state[id] + qty, source);
}

export function clearCart(): void {
  state = { ...EMPTY_QUANTITIES };
  emit('clear');
}

export function onCartChange(handler: (cart: Quantities, source: string) => void): void {
  window.addEventListener(CART_EVENT, (event) => {
    const { cart, source } = (event as CustomEvent<{ cart: Quantities; source: string }>).detail;
    handler(cart, source);
  });
}

export function cartCount(cart: Quantities = state): number {
  return PRODUCTS.reduce((sum, p) => sum + cart[p.id], 0);
}
