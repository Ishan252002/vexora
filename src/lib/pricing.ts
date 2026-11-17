export const FREE_SHIPPING_MIN = 999;
export const STANDARD_SHIPPING = 79;
export const EXPRESS_SHIPPING = 149;
export const MAX_QTY = 10;

export type Delivery = 'standard' | 'express';

export const PROMOS: Record<string, { pct: number; label: string }> = {
  VEXORA10: { pct: 10, label: '10% off your first order' },
};

export const normalisePromo = (code: string) => code.trim().toUpperCase();

export interface PricedLine {
  price: number;
  mrp: number;
  qty: number;
}

export interface Totals {
  itemCount: number;
  /** Sum of MRP x qty. */
  mrpTotal: number;
  /** Sum of selling price x qty. */
  subtotal: number;
  /** MRP total minus subtotal. */
  savings: number;
  promoDiscount: number;
  shipping: number;
  total: number;
  /** Rupees still needed to reach free standard shipping. 0 once reached. */
  freeShippingGap: number;
}

export function cartTotals(
  lines: PricedLine[],
  promo: string | null = null,
  delivery: Delivery = 'standard',
): Totals {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const mrpTotal = lines.reduce((n, l) => n + l.mrp * l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const pct = promo && PROMOS[promo] ? PROMOS[promo].pct : 0;
  const promoDiscount = Math.round((subtotal * pct) / 100);
  const afterPromo = subtotal - promoDiscount;

  let shipping = 0;
  if (itemCount > 0) {
    if (delivery === 'express') shipping = EXPRESS_SHIPPING;
    else shipping = afterPromo >= FREE_SHIPPING_MIN ? 0 : STANDARD_SHIPPING;
  }

  return {
    itemCount,
    mrpTotal,
    subtotal,
    savings: mrpTotal - subtotal,
    promoDiscount,
    shipping,
    total: afterPromo + shipping,
    freeShippingGap: itemCount > 0 ? Math.max(0, FREE_SHIPPING_MIN - afterPromo) : FREE_SHIPPING_MIN,
  };
}
