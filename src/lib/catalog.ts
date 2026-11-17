import { categoryBySlug, type CategorySlug } from '../data/categories';
import type { Product, Tag } from '../data/products';
import { pctOff } from './format';

export const priceBands = [
  { id: 'u500', label: 'Under ₹500', min: 0, max: 499 },
  { id: '500-999', label: '₹500 to ₹999', min: 500, max: 999 },
  { id: '1000-1999', label: '₹1,000 to ₹1,999', min: 1000, max: 1999 },
  { id: '2000p', label: '₹2,000 and above', min: 2000, max: Infinity },
] as const;

export type PriceBandId = (typeof priceBands)[number]['id'];

export const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'newest', label: 'Newest first' },
  { id: 'rating', label: 'Top rated' },
  { id: 'discount', label: 'Biggest discount' },
] as const;

export type SortId = (typeof sortOptions)[number]['id'];

export const isSort = (v: string | null): v is SortId => sortOptions.some((s) => s.id === v);

export const tagLabels: Record<Tag, string> = {
  bestseller: 'Best sellers',
  new: 'New arrivals',
  trending: 'Trending now',
  deal: "This week's offers",
};

export const isTag = (v: string | null): v is Tag => v !== null && v in tagLabels;

/** Case-insensitive search. Every word in the query must appear somewhere in the product text. */
export function matchesQuery(product: Product, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [
    product.name,
    categoryBySlug.get(product.category)?.name ?? '',
    product.short,
    product.description,
    product.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase();
  return words.every((w) => haystack.includes(w));
}

export interface Filters {
  category?: CategorySlug | null;
  tag?: Tag | null;
  query?: string;
  bands?: string[];
}

export function filterProducts(list: Product[], f: Filters): Product[] {
  const bands = priceBands.filter((b) => f.bands?.includes(b.id));
  return list.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.tag && !p.tags.includes(f.tag)) return false;
    if (f.query && !matchesQuery(p, f.query)) return false;
    if (bands.length > 0 && !bands.some((b) => p.price >= b.min && p.price <= b.max)) return false;
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortId): Product[] {
  const out = [...list];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'newest':
      return out.sort((a, b) => b.added.localeCompare(a.added));
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case 'discount':
      return out.sort((a, b) => pctOff(b.price, b.mrp) - pctOff(a.price, a.mrp) || a.price - b.price);
    default:
      // Featured: best sellers first, then by review volume.
      return out.sort(
        (a, b) =>
          Number(b.tags.includes('bestseller')) - Number(a.tags.includes('bestseller')) ||
          b.reviews - a.reviews,
      );
  }
}
