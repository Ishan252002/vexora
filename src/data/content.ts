import type { IconName } from '../components/Icon';

export const PROMO_CODE = 'VEXORA10';

export const announcements = [
  `Welcome to VEXORA. Extra 10% off your first order with code ${PROMO_CODE}`,
  'Free shipping on orders over ₹999',
  'Pay by UPI, card or cash on delivery',
];

export const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Free shipping over ₹999', text: 'Tracked delivery in 3 to 7 working days.' },
  { icon: 'card', title: 'Pay your way', text: 'UPI, cards, net banking or cash on delivery.' },
  { icon: 'refresh', title: '7-day returns', text: 'Changed your mind? Send it back within a week.' },
  { icon: 'lock', title: 'Secure checkout', text: 'Encrypted payments on every order.' },
];

export const reasons: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'layers',
    title: 'Curated, not cluttered',
    text: 'Six categories and a short list in each. You compare three good options, not three hundred.',
  },
  {
    icon: 'tag',
    title: 'The price you see is the price you pay',
    text: 'Every price is in rupees and includes taxes. Shipping is free over ₹999 and ₹79 below it.',
  },
  {
    icon: 'card',
    title: 'Pay the way you already do',
    text: 'UPI, debit and credit cards, net banking or cash on delivery.',
  },
  {
    icon: 'refresh',
    title: 'Returns without the back and forth',
    text: 'Raise a return within 7 days of delivery and we arrange the pickup.',
  },
];

/** Illustrative reviews for the demo. Replace with verified customer reviews before launch. */
export const testimonials = [
  {
    quote:
      'Ordered the headphones on Monday and had them by Thursday. Battery has lasted the whole work week on one charge.',
    name: 'Ananya',
    city: 'Bengaluru',
    product: 'Wireless Bluetooth Headphones',
    rating: 5,
  },
  {
    quote:
      'The cabin trolley fit the overhead bin on both flights. Wheels are smooth and the lock was easy to set.',
    name: 'Rohan',
    city: 'Pune',
    product: 'Hard-Shell Cabin Trolley (55 cm)',
    rating: 5,
  },
  {
    quote:
      'Paid by UPI, got tracking updates on every step. The serum arrived sealed and well packed.',
    name: 'Meera',
    city: 'Jaipur',
    product: 'Vitamin C Face Serum',
    rating: 4,
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3 to 7 working days depending on your PIN code. Express delivery, where available, takes 1 to 3 working days.',
  },
  {
    q: 'What does shipping cost?',
    a: 'Standard shipping is free on orders over ₹999 and ₹79 below that. Express shipping is a flat ₹149.',
  },
  {
    q: 'Which payment methods can I use?',
    a: 'UPI, debit and credit cards, net banking and cash on delivery.',
  },
  {
    q: 'Can I return a product?',
    a: 'Yes. Raise a return within 7 days of delivery if the item is unused and in its original packaging. Personal care items can be returned only if unopened.',
  },
  {
    q: 'How do I use a promo code?',
    a: `Enter the code in your cart before checkout. ${PROMO_CODE} takes 10% off your first order.`,
  },
  {
    q: 'How do I track my order?',
    a: 'You get a tracking link by SMS and email once your order ships.',
  },
];

export const popularSearches = ['headphones', 'watch', 'yoga mat', 'backpack', 'serum', 'candle'];

export const DEMO_NOTICE =
  'Demo storefront. Products, prices, ratings, reviews, offers and policies shown here are illustrative. Photos are demo placeholders and do not show the listed products. No real orders or payments are processed.';
