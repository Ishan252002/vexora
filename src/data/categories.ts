export type CategorySlug = 'electronics' | 'home' | 'fashion' | 'beauty' | 'fitness' | 'travel';

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: 'electronics',
    name: 'Electronics & Gadgets',
    short: 'Electronics',
    blurb: 'Audio, wearables and desk tech.',
    image: 'cat_electronics',
  },
  {
    slug: 'home',
    name: 'Home & Living',
    short: 'Home',
    blurb: 'Light, scent and calm corners.',
    image: 'cat_home',
  },
  {
    slug: 'fashion',
    name: 'Fashion & Accessories',
    short: 'Fashion',
    blurb: 'Watches, eyewear and carry.',
    image: 'cat_fashion',
  },
  {
    slug: 'beauty',
    name: 'Beauty & Personal Care',
    short: 'Beauty',
    blurb: 'Skincare and daily rituals.',
    image: 'cat_beauty',
  },
  {
    slug: 'fitness',
    name: 'Fitness & Lifestyle',
    short: 'Fitness',
    blurb: 'Move, stretch and hydrate.',
    image: 'cat_fitness',
  },
  {
    slug: 'travel',
    name: 'Travel Essentials',
    short: 'Travel',
    blurb: 'Bags and comfort for the road.',
    image: 'cat_travel',
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export const isCategory = (value: string | null): value is CategorySlug =>
  value !== null && categoryBySlug.has(value as CategorySlug);
