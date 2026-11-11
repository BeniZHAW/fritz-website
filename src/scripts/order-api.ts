/**
 * Uebergabe einer Bestellung an das ERP.
 * Das ERP prueft alle Felder, rechnet Preise und Versand selbst nach,
 * legt Kunde + Bestellung (Quelle "Webseite") an und verschickt die
 * Bestaetigung mit TWINT-Link.
 *
 * Ohne PUBLIC_ORDER_API_URL laeuft der Prototyp-Modus: nichts wird gesendet.
 */
import type { ProductId } from '../config/shop';

export interface OrderRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    zip: string;
    city: string;
  };
  items: { productId: ProductId; quantity: number }[];
  note: string;
  acceptedTerms: boolean;
  /** Honeypot, muss leer bleiben */
  website: string;
}

export type OrderResult =
  | { ok: true; prototype: boolean; orderNumber?: string }
  | { ok: false; message: string };

const API_URL: string = import.meta.env.PUBLIC_ORDER_API_URL ?? '';

export const isPrototypeMode = API_URL === '';

export async function submitOrder(order: OrderRequest): Promise<OrderResult> {
  if (isPrototypeMode) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true, prototype: true };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    const data = (await response.json().catch(() => ({}))) as { orderNumber?: string; message?: string };
    if (!response.ok) {
      return { ok: false, message: data.message ?? 'Die Bestellung konnte nicht gesendet werden.' };
    }
    return { ok: true, prototype: false, orderNumber: data.orderNumber };
  } catch {
    return { ok: false, message: 'Keine Verbindung. Bitte versuche es nochmals.' };
  }
}
