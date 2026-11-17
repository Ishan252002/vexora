import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { categories } from '../data/categories';
import { products } from '../data/products';
import imageData from '../data/images.json';
import { filterProducts, matchesQuery, sortProducts } from './catalog';
import { inr, pctOff } from './format';
import { cartTotals, EXPRESS_SHIPPING, FREE_SHIPPING_MIN, STANDARD_SHIPPING } from './pricing';
import { offerEndsAt, splitDuration } from './time';

const images = imageData as unknown as Record<string, { url: string }>;

describe('catalogue data', () => {
  it('has at least 15 products with unique ids and slugs', () => {
    expect(products.length).toBeGreaterThanOrEqual(15);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it('covers all six categories', () => {
    expect(categories).toHaveLength(6);
    for (const c of categories) {
      expect(products.some((p) => p.category === c.slug)).toBe(true);
    }
  });

  it('prices every product at or below MRP', () => {
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.mrp).toBeGreaterThanOrEqual(p.price);
    }
  });

  it('lists the headline product at ₹1,499', () => {
    const headphones = products.find((p) => p.name === 'Wireless Bluetooth Headphones');
    expect(headphones?.price).toBe(1499);
  });

  it('has a photo entry for every product and category', () => {
    for (const p of products) expect(images[p.image]?.url, p.image).toMatch(/^https:\/\//);
    for (const c of categories) expect(images[c.image]?.url, c.image).toMatch(/^https:\/\//);
  });

  it('bundles a demo photo file for every image slot', () => {
    for (const key of Object.keys(images)) expect(existsSync(`public/img/${key}.jpg`), key).toBe(true);
  });
});

describe('formatting', () => {
  it('formats rupees with Indian digit grouping', () => {
    expect(inr(1499)).toBe('₹1,499');
    expect(inr(125000)).toBe('₹1,25,000');
  });

  it('rounds the discount percentage', () => {
    expect(pctOff(1499, 2999)).toBe(50);
    expect(pctOff(500, 500)).toBe(0);
  });
});

describe('filters, search and sort', () => {
  it('filters by category', () => {
    const travel = filterProducts(products, { category: 'travel' });
    expect(travel.length).toBeGreaterThan(0);
    expect(travel.every((p) => p.category === 'travel')).toBe(true);
  });

  it('filters by price band', () => {
    const cheap = filterProducts(products, { bands: ['u500'] });
    expect(cheap.length).toBeGreaterThan(0);
    expect(cheap.every((p) => p.price < 500)).toBe(true);
  });

  it('combines category and tag', () => {
    const list = filterProducts(products, { category: 'electronics', tag: 'bestseller' });
    expect(list.every((p) => p.category === 'electronics' && p.tags.includes('bestseller'))).toBe(true);
  });

  it('finds products by search words in any order', () => {
    const headphones = products.find((p) => p.id === 'p01')!;
    expect(matchesQuery(headphones, 'headphones wireless')).toBe(true);
    expect(matchesQuery(headphones, 'yoga')).toBe(false);
    expect(filterProducts(products, { query: 'zzzz' })).toHaveLength(0);
  });

  it('sorts by price in both directions', () => {
    const asc = sortProducts(products, 'price-asc').map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = sortProducts(products, 'price-desc').map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });
});

describe('cart totals', () => {
  const line = (price: number, qty = 1, mrp = price * 2) => ({ price, mrp, qty });

  it('charges standard shipping below the free-shipping minimum', () => {
    const t = cartTotals([line(499)]);
    expect(t.shipping).toBe(STANDARD_SHIPPING);
    expect(t.total).toBe(499 + STANDARD_SHIPPING);
    expect(t.freeShippingGap).toBe(FREE_SHIPPING_MIN - 499);
  });

  it('ships free at or above the minimum', () => {
    const t = cartTotals([line(1499)]);
    expect(t.shipping).toBe(0);
    expect(t.total).toBe(1499);
    expect(t.freeShippingGap).toBe(0);
  });

  it('applies VEXORA10 as 10% off the subtotal', () => {
    const t = cartTotals([line(1499, 2)], 'VEXORA10');
    expect(t.subtotal).toBe(2998);
    expect(t.promoDiscount).toBe(300);
    expect(t.total).toBe(2698);
  });

  it('ignores unknown promo codes', () => {
    expect(cartTotals([line(1499)], 'FREE100').promoDiscount).toBe(0);
  });

  it('charges the express rate when chosen', () => {
    expect(cartTotals([line(1499)], null, 'express').shipping).toBe(EXPRESS_SHIPPING);
  });

  it('reports savings against MRP and an empty cart as zero', () => {
    expect(cartTotals([line(1499, 1, 2999)]).savings).toBe(1500);
    const empty = cartTotals([]);
    expect(empty.total).toBe(0);
    expect(empty.shipping).toBe(0);
  });
});

describe('offer countdown', () => {
  it('ends on Sunday 23:59:59 IST', () => {
    // Friday 13 Nov 2026, 10:30 IST
    const end = offerEndsAt(new Date('2026-11-13T05:00:00Z'));
    expect(end.toISOString()).toBe('2026-11-15T18:29:59.000Z');
  });

  it('ends the same day when it is already Sunday in India', () => {
    const end = offerEndsAt(new Date('2026-11-15T10:00:00Z'));
    expect(end.toISOString()).toBe('2026-11-15T18:29:59.000Z');
  });

  it('splits a duration into days, hours, minutes and seconds', () => {
    expect(splitDuration(90061000)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
    expect(splitDuration(-5)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
