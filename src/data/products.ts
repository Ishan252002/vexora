import type { CategorySlug } from './categories';

export type Tag = 'bestseller' | 'new' | 'trending' | 'deal';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Selling price in rupees, inclusive of taxes. */
  price: number;
  /** Maximum retail price in rupees. */
  mrp: number;
  /** Sample rating out of 5. Illustrative. */
  rating: number;
  /** Sample review count. Illustrative. */
  reviews: number;
  tags: Tag[];
  /** Position in the Trending rail on the homepage. */
  trendRank?: number;
  /** ISO date the product was added. Drives "Newest" sorting. */
  added: string;
  stock: 'in' | 'low';
  short: string;
  description: string;
  highlights: string[];
  specs: [string, string][];
  /** Key into src/data/images.json */
  image: string;
}

/**
 * Demo catalogue. Every price, rating, review count and specification here is
 * illustrative sample data. Replace with the supplier feed before launch.
 */
export const products: Product[] = [
  {
    id: 'p01',
    slug: 'wireless-bluetooth-headphones',
    name: 'Wireless Bluetooth Headphones',
    category: 'electronics',
    price: 1499,
    mrp: 2999,
    rating: 4.6,
    reviews: 1284,
    tags: ['bestseller'],
    added: '2026-08-18',
    stock: 'in',
    short: '30 hours of music on one charge.',
    description:
      'Over-ear headphones with memory-foam cushions and 40 mm drivers. Pair once over Bluetooth 5.3 and they reconnect each time you switch them on. A 10-minute top-up gives about 3 hours of playback.',
    highlights: [
      '30-hour battery with USB-C fast charge',
      'Bluetooth 5.3, pairs with two devices at once',
      'Built-in microphone for calls',
      'Folds flat to fit a backpack pocket',
    ],
    specs: [
      ['Driver size', '40 mm'],
      ['Battery life', '30 hours'],
      ['Charging', 'USB-C, 10 minutes for 3 hours'],
      ['Weight', '220 g'],
      ['Warranty', '1 year'],
    ],
    image: 'p01',
  },
  {
    id: 'p02',
    slug: 'smart-fitness-watch',
    name: 'Smart Fitness Watch',
    category: 'electronics',
    price: 2499,
    mrp: 4499,
    rating: 4.4,
    reviews: 862,
    tags: ['new'],
    added: '2026-11-02',
    stock: 'in',
    short: 'Heart rate, sleep and calls on your wrist.',
    description:
      'A 1.8-inch AMOLED display you can read in sunlight, with heart-rate, SpO2 and sleep tracking built in. Take calls from your wrist over Bluetooth. One charge lasts about 7 days of normal use.',
    highlights: [
      '1.8-inch AMOLED always-on display',
      'Bluetooth calling with built-in speaker',
      '7-day battery, full charge in 90 minutes',
      'IP68 water and dust resistance',
    ],
    specs: [
      ['Display', '1.8-inch AMOLED'],
      ['Battery life', 'About 7 days'],
      ['Water resistance', 'IP68'],
      ['Strap', '22 mm silicone, quick release'],
      ['Works with', 'Android and iOS'],
      ['Warranty', '1 year'],
    ],
    image: 'p02',
  },
  {
    id: 'p03',
    slug: 'portable-bluetooth-speaker',
    name: 'Portable Bluetooth Speaker',
    category: 'electronics',
    price: 1299,
    mrp: 1999,
    rating: 4.5,
    reviews: 640,
    tags: ['bestseller', 'trending'],
    trendRank: 6,
    added: '2026-07-30',
    stock: 'in',
    short: 'Room-filling sound that fits in a tote.',
    description:
      'A 16 W speaker with a passive bass radiator, sealed against splashes and dust. It plays for 12 hours per charge. Pair two of them for stereo.',
    highlights: [
      '16 W output with passive bass radiator',
      '12-hour battery',
      'IPX7: safe by the pool or in the rain',
      'Pair two speakers for stereo sound',
    ],
    specs: [
      ['Output', '16 W'],
      ['Battery life', '12 hours'],
      ['Water resistance', 'IPX7'],
      ['Connectivity', 'Bluetooth 5.3, AUX'],
      ['Weight', '540 g'],
      ['Warranty', '1 year'],
    ],
    image: 'p03',
  },
  {
    id: 'p04',
    slug: 'minimalist-led-desk-lamp',
    name: 'Minimalist LED Desk Lamp',
    category: 'home',
    price: 899,
    mrp: 1499,
    rating: 4.3,
    reviews: 311,
    tags: ['new'],
    added: '2026-10-21',
    stock: 'in',
    short: 'Flicker-free light in 3 colour temperatures.',
    description:
      'A slim aluminium lamp with a touch dimmer and a flexible neck. Switch between warm, neutral and cool light to suit reading or screen work. The base has a USB port to charge your phone.',
    highlights: [
      '3 colour temperatures, 5 brightness levels',
      'Touch control that remembers your last setting',
      'USB charging port in the base',
      '10 W LED, no bulb to replace',
    ],
    specs: [
      ['Power', '10 W'],
      ['Colour temperature', '3000 K to 6000 K'],
      ['Material', 'Aluminium and ABS'],
      ['Height', '42 cm'],
      ['Warranty', '6 months'],
    ],
    image: 'p04',
  },
  {
    id: 'p05',
    slug: 'ceramic-aroma-diffuser',
    name: 'Ceramic Aroma Diffuser',
    category: 'home',
    price: 1099,
    mrp: 1699,
    rating: 4.5,
    reviews: 428,
    tags: ['trending'],
    trendRank: 3,
    added: '2026-09-12',
    stock: 'in',
    short: 'Fine mist for 8 hours on one fill.',
    description:
      'An ultrasonic diffuser in a matte ceramic shell. Add water and a few drops of essential oil. It runs for 8 hours on a 200 ml fill and switches itself off when empty.',
    highlights: [
      '200 ml tank, 8-hour run time',
      'Switches off automatically when empty',
      'Soft warm night light',
      'Runs below 30 dB, quiet enough for a bedroom',
    ],
    specs: [
      ['Capacity', '200 ml'],
      ['Run time', '8 hours'],
      ['Noise level', 'Below 30 dB'],
      ['Material', 'Ceramic and PP'],
      ['Power', 'USB-C, 5 V'],
    ],
    image: 'p05',
  },
  {
    id: 'p06',
    slug: 'scented-soy-candle-set',
    name: 'Scented Soy Candle Set',
    category: 'home',
    price: 649,
    mrp: 999,
    rating: 4.7,
    reviews: 512,
    tags: ['deal'],
    added: '2026-09-28',
    stock: 'in',
    short: 'Three hand-poured candles, 25 hours each.',
    description:
      'Sandalwood, jasmine and vetiver in reusable glass jars. Soy wax and cotton wicks burn evenly for about 25 hours per candle.',
    highlights: [
      'Set of 3: sandalwood, jasmine and vetiver',
      '25-hour burn time per candle',
      'Soy wax with cotton wicks',
      'Reusable glass jars',
    ],
    specs: [
      ['Net weight', '3 x 100 g'],
      ['Burn time', '25 hours each'],
      ['Wax', 'Soy'],
      ['Wick', 'Cotton'],
      ['Origin', 'Made in India'],
    ],
    image: 'p06',
  },
  {
    id: 'p07',
    slug: 'classic-polarised-sunglasses',
    name: 'Classic Polarised Sunglasses',
    category: 'fashion',
    price: 799,
    mrp: 1499,
    rating: 4.4,
    reviews: 935,
    tags: ['bestseller'],
    added: '2026-08-05',
    stock: 'in',
    short: 'Polarised UV400 lenses. Less glare on the road.',
    description:
      'Polarised lenses cut reflected glare from roads and water and filter UVA and UVB. The frame weighs 24 g, so it sits easy through a full day out.',
    highlights: [
      'Polarised lenses with UV400 protection',
      'Lightweight 24 g frame',
      'Spring hinges for a comfortable fit',
      'Hard case and cleaning cloth included',
    ],
    specs: [
      ['Lens', 'Polarised TAC, UV400'],
      ['Frame', 'TR90'],
      ['Weight', '24 g'],
      ['Fit', 'Medium, unisex'],
      ['In the box', 'Sunglasses, hard case, cloth'],
    ],
    image: 'p07',
  },
  {
    id: 'p08',
    slug: 'minimalist-analog-watch',
    name: 'Minimalist Analog Watch',
    category: 'fashion',
    price: 1799,
    mrp: 2999,
    rating: 4.5,
    reviews: 276,
    tags: ['new'],
    added: '2026-11-06',
    stock: 'low',
    short: 'A slim 40 mm dial that goes with everything.',
    description:
      'A clean dial, a 7 mm case and a leather strap. Japanese quartz movement keeps accurate time. Water resistant to 30 metres, so rain and handwashing are fine.',
    highlights: [
      '40 mm stainless steel case, 7 mm slim',
      'Japanese quartz movement',
      '20 mm leather strap with quick release',
      '3 ATM water resistance',
    ],
    specs: [
      ['Case', '40 mm stainless steel'],
      ['Movement', 'Japanese quartz'],
      ['Strap', 'Leather, 20 mm'],
      ['Water resistance', '3 ATM'],
      ['Warranty', '1 year'],
    ],
    image: 'p08',
  },
  {
    id: 'p09',
    slug: 'slim-leather-wallet',
    name: 'Slim Leather Wallet',
    category: 'fashion',
    price: 699,
    mrp: 1199,
    rating: 4.3,
    reviews: 389,
    tags: ['trending'],
    trendRank: 5,
    added: '2026-09-03',
    stock: 'in',
    short: 'Holds 8 cards and cash without the bulk.',
    description:
      'Full-grain leather that stays 9 mm thin when loaded. Six card slots, two hidden pockets and a full-length note compartment, with an RFID-blocking lining.',
    highlights: [
      '6 card slots and 2 hidden pockets',
      '9 mm thin when full',
      'RFID-blocking lining',
      'Full-grain leather that ages well',
    ],
    specs: [
      ['Material', 'Full-grain leather'],
      ['Card slots', '6, plus 2 pockets'],
      ['Size', '11 x 9 cm'],
      ['RFID blocking', 'Yes'],
    ],
    image: 'p09',
  },
  {
    id: 'p10',
    slug: 'vitamin-c-face-serum',
    name: 'Vitamin C Face Serum',
    category: 'beauty',
    price: 549,
    mrp: 799,
    rating: 4.6,
    reviews: 1543,
    tags: ['bestseller'],
    added: '2026-07-14',
    stock: 'in',
    short: '10% vitamin C for brighter-looking skin.',
    description:
      'A lightweight serum with 10% ethyl ascorbic acid and hyaluronic acid. It absorbs in seconds and sits well under sunscreen. Fragrance-free.',
    highlights: [
      '10% vitamin C (ethyl ascorbic acid)',
      'Hyaluronic acid for hydration',
      'Fragrance-free formula',
      '30 ml lasts about 2 months of daily use',
    ],
    specs: [
      ['Volume', '30 ml'],
      ['Key ingredients', 'Ethyl ascorbic acid, hyaluronic acid'],
      ['Skin type', 'All. Patch test first.'],
      ['How to use', 'Morning, before sunscreen'],
      ['Shelf life', '24 months'],
    ],
    image: 'p10',
  },
  {
    id: 'p11',
    slug: 'jade-roller-gua-sha-set',
    name: 'Jade Roller & Gua Sha Set',
    category: 'beauty',
    price: 499,
    mrp: 999,
    rating: 4.2,
    reviews: 458,
    tags: ['deal'],
    added: '2026-08-22',
    stock: 'in',
    short: 'A 5-minute face massage, morning or night.',
    description:
      'A dual-ended roller and a contoured gua sha stone. Use them with a serum or face oil for a cooling massage. Keep the set in the fridge for a colder roll.',
    highlights: [
      'Dual-ended roller for face and under-eye',
      'Contoured gua sha stone',
      'Comes in a gift box with a pouch',
      'Natural stone, so colour varies',
    ],
    specs: [
      ['Stone', 'Natural jade'],
      ['Frame', 'Zinc alloy'],
      ['In the box', 'Roller, gua sha, pouch'],
      ['Care', 'Wipe clean after use'],
    ],
    image: 'p11',
  },
  {
    id: 'p12',
    slug: 'makeup-brush-set-12-pieces',
    name: 'Makeup Brush Set (12 Pieces)',
    category: 'beauty',
    price: 599,
    mrp: 1099,
    rating: 4.4,
    reviews: 367,
    tags: ['new'],
    added: '2026-10-29',
    stock: 'in',
    short: '12 soft synthetic brushes for face and eyes.',
    description:
      'Five face brushes and seven eye brushes with dense synthetic bristles that pick up powder and cream evenly. The set comes in a travel pouch.',
    highlights: [
      '5 face brushes and 7 eye brushes',
      'Soft synthetic bristles, cruelty-free',
      'Wooden handles with a matte finish',
      'Travel pouch included',
    ],
    specs: [
      ['Pieces', '12'],
      ['Bristles', 'Synthetic'],
      ['Handle', 'Wood'],
      ['In the box', '12 brushes, travel pouch'],
    ],
    image: 'p12',
  },
  {
    id: 'p13',
    slug: 'anti-slip-yoga-mat-6mm',
    name: 'Anti-Slip Yoga Mat (6 mm)',
    category: 'fitness',
    price: 799,
    mrp: 1299,
    rating: 4.5,
    reviews: 1120,
    tags: ['bestseller'],
    added: '2026-07-25',
    stock: 'in',
    short: '6 mm cushioning with grip on both sides.',
    description:
      'A TPE mat that cushions knees and wrists and stays put on tile or wood. At 900 g it is lighter than rubber, and a carry strap is included.',
    highlights: [
      '6 mm cushioning for knees and wrists',
      'Textured grip on both sides',
      '900 g, with carry strap',
      'Wipes clean with a damp cloth',
    ],
    specs: [
      ['Size', '183 x 61 cm'],
      ['Thickness', '6 mm'],
      ['Material', 'TPE'],
      ['Weight', '900 g'],
      ['In the box', 'Mat, carry strap'],
    ],
    image: 'p13',
  },
  {
    id: 'p14',
    slug: 'insulated-steel-water-bottle-1l',
    name: 'Insulated Steel Water Bottle (1 L)',
    category: 'fitness',
    price: 599,
    mrp: 899,
    rating: 4.6,
    reviews: 890,
    tags: ['trending'],
    trendRank: 1,
    added: '2026-09-18',
    stock: 'in',
    short: 'Cold for 24 hours, hot for 12.',
    description:
      'Double-wall stainless steel keeps water cold for 24 hours and tea hot for 12. The lid is leak-proof and the wide mouth takes ice cubes.',
    highlights: [
      'Cold for 24 hours, hot for 12',
      'Leak-proof lid with carry loop',
      'Wide mouth for ice and easy cleaning',
      '18/8 stainless steel, BPA-free',
    ],
    specs: [
      ['Capacity', '1 litre'],
      ['Material', '18/8 stainless steel'],
      ['Insulation', 'Double-wall vacuum'],
      ['Weight', '380 g'],
      ['Care', 'Hand wash'],
    ],
    image: 'p14',
  },
  {
    id: 'p15',
    slug: 'resistance-bands-set',
    name: 'Resistance Bands Set (5 Levels)',
    category: 'fitness',
    price: 449,
    mrp: 899,
    rating: 4.3,
    reviews: 604,
    tags: ['new', 'deal'],
    added: '2026-10-15',
    stock: 'in',
    short: 'Five resistance levels in one small pouch.',
    description:
      'Five loop bands from 5 kg to 25 kg of resistance for warm-ups, strength work and stretching. Each band has its level printed on it, so you pick the right one quickly.',
    highlights: [
      '5 bands, 5 kg to 25 kg resistance',
      'Level printed on every band',
      'Natural latex with a non-slip finish',
      'Carry pouch included',
    ],
    specs: [
      ['Bands', '5'],
      ['Resistance', '5, 10, 15, 20 and 25 kg'],
      ['Material', 'Natural latex'],
      ['In the box', '5 bands, pouch'],
    ],
    image: 'p15',
  },
  {
    id: 'p16',
    slug: 'anti-theft-laptop-backpack',
    name: 'Anti-Theft Laptop Backpack',
    category: 'travel',
    price: 1399,
    mrp: 2299,
    rating: 4.5,
    reviews: 748,
    tags: ['bestseller', 'trending'],
    trendRank: 4,
    added: '2026-08-11',
    stock: 'in',
    short: 'Fits a 15.6-inch laptop. Hidden zips, USB port.',
    description:
      'A 25-litre backpack with a padded laptop sleeve, a hidden back-panel zip and a pass-through USB charging port. The water-repellent fabric handles a monsoon commute.',
    highlights: [
      'Padded sleeve for laptops up to 15.6 inches',
      'Hidden back-panel zip',
      'USB charging port (power bank not included)',
      'Water-repellent fabric',
    ],
    specs: [
      ['Capacity', '25 litres'],
      ['Laptop size', 'Up to 15.6 inches'],
      ['Material', 'Water-repellent polyester'],
      ['Weight', '780 g'],
      ['Warranty', '1 year'],
    ],
    image: 'p16',
  },
  {
    id: 'p17',
    slug: 'hard-shell-cabin-trolley-55cm',
    name: 'Hard-Shell Cabin Trolley (55 cm)',
    category: 'travel',
    price: 2999,
    mrp: 5499,
    rating: 4.4,
    reviews: 332,
    tags: ['new', 'trending'],
    trendRank: 2,
    added: '2026-10-08',
    stock: 'low',
    short: 'Cabin size, 8 wheels, 2.6 kg.',
    description:
      'A 55 cm polycarbonate case built to cabin dimensions. Eight spinner wheels, a 3-digit combination lock and a 38-litre interior with a divider. Check your airline for its cabin limits.',
    highlights: [
      '55 x 36 x 22 cm cabin size',
      '8 spinner wheels that roll in any direction',
      '3-digit combination lock',
      '38-litre interior with divider and straps',
    ],
    specs: [
      ['Size', '55 x 36 x 22 cm'],
      ['Capacity', '38 litres'],
      ['Weight', '2.6 kg'],
      ['Shell', 'Polycarbonate'],
      ['Lock', '3-digit combination'],
      ['Warranty', '3 years'],
    ],
    image: 'p17',
  },
  {
    id: 'p18',
    slug: 'memory-foam-travel-neck-pillow',
    name: 'Memory Foam Travel Neck Pillow',
    category: 'travel',
    price: 499,
    mrp: 849,
    rating: 4.2,
    reviews: 517,
    tags: ['deal'],
    added: '2026-09-07',
    stock: 'in',
    short: 'Neck support for flights, trains and road trips.',
    description:
      'Slow-rebound memory foam that holds your head upright while you sleep in a seat. The cover zips off for washing and the pillow packs into its own pouch.',
    highlights: [
      'Slow-rebound memory foam',
      'Adjustable front clasp',
      'Removable, washable cover',
      'Packs down into a carry pouch',
    ],
    specs: [
      ['Fill', 'Memory foam'],
      ['Cover', 'Velour, machine washable'],
      ['Size', '28 x 26 x 12 cm'],
      ['In the box', 'Pillow, carry pouch'],
    ],
    image: 'p18',
  },
];

export const productById = new Map(products.map((p) => [p.id, p]));
export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export const withTag = (tag: Tag) => products.filter((p) => p.tags.includes(tag));

export const countInCategory = (slug: CategorySlug) =>
  products.filter((p) => p.category === slug).length;

/** Other products to show on a product page: same category first, then top rated. */
export function relatedTo(product: Product, limit = 4): Product[] {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = products
    .filter((p) => p.category !== product.category)
    .sort((a, b) => b.reviews - a.reviews);
  return [...same, ...rest].slice(0, limit);
}
