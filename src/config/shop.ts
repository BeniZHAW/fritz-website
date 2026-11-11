/**
 * Einzige Quelle fuer Produkte, Preise und Versandregel.
 * Das ERP rechnet beim Empfang einer Bestellung mit denselben Regeln nach
 * und verlaesst sich nie auf Preise aus dem Browser.
 */

export type ProductId = 'dose' | 'nachfueller';

export interface Product {
  id: ProductId;
  name: string;
  variant: string;
  /** Preis in CHF inkl. MwSt. */
  price: number;
  shippingNote: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 'dose',
    name: 'FRITZ Dose',
    variant: 'Paprika · 110 g · Alu-Dose',
    price: 11,
    shippingNote: 'Versand CHF 6.–, ab 2 Dosen gratis',
  },
  {
    id: 'nachfueller',
    name: 'FRITZ Nachfüllpackung',
    variant: 'Paprika · 110 g · Nachfüllbeutel',
    price: 8,
    shippingNote: 'Immer versandfrei',
  },
] as const;

/** Versandkosten, wenn genau eine Dose bestellt wird. */
export const SHIPPING_FEE_SINGLE_TIN = 6;

export const MAX_QTY_PER_PRODUCT = 50;

export type Quantities = Record<ProductId, number>;

export const EMPTY_QUANTITIES: Quantities = { dose: 0, nachfueller: 0 };

export function productById(id: ProductId): Product {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unbekanntes Produkt: ${id}`);
  return product;
}

/**
 * Versandregel (wie bisher auf pommes-fritz.ch):
 * genau 1 Dose -> CHF 6.–, ab 2 Dosen gratis, Nachfueller immer gratis.
 */
export function calcShipping(q: Quantities): number {
  return q.dose === 1 ? SHIPPING_FEE_SINGLE_TIN : 0;
}

export interface Totals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export function calcTotals(q: Quantities): Totals {
  const subtotal = PRODUCTS.reduce((sum, p) => sum + p.price * q[p.id], 0);
  const shipping = calcShipping(q);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: q.dose + q.nachfueller,
  };
}

/** Hinweis, der aus einer Dose zwei macht. `null`, wenn nichts zu sagen ist. */
export function freeShippingHint(q: Quantities): string | null {
  if (q.dose === 1) return 'Noch 1 Dose bis zum Gratisversand';
  if (q.dose >= 2 || (q.dose === 0 && q.nachfueller > 0)) return 'Gratisversand';
  return null;
}

const chf = new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' });

export function formatCHF(value: number): string {
  return chf.format(value);
}

/** Kurzform wie auf der Verpackung: "11.–" */
export function formatPriceShort(value: number): string {
  return Number.isInteger(value) ? `${value}.–` : value.toFixed(2);
}
