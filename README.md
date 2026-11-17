# VEXORA demo storefront

**Discover. Shop. Experience.**

A multi-category dropshipping store for India, built as a client demo. React 19, TypeScript, Vite and React Router. No backend: cart, wishlist and demo orders live in the browser.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build on port 4173 |
| `npm test` | Unit tests for pricing, filters, search and the offer countdown |
| `npm run build:single` | One self-contained `VEXORA-demo.html` you can open with a double-click |
| `npm run images` | Replace the bundled demo photos with product-matched photos from the web |

Needs Node 20 or newer.

## What is in the store

- Homepage: announcement bar, sticky navigation, hero, featured categories, best sellers, promo banners, trending rail, weekly offers with a countdown, new arrivals, why VEXORA, testimonials, newsletter, footer
- Shop: category, price and collection filters, sorting, search, shareable filter URLs
- Product page: price and MRP, quantity, add to cart, buy now, wishlist, PIN-code delivery check, specifications
- Cart drawer and cart page: quantities, promo code `VEXORA10`, free-shipping progress
- Checkout: contact, address with Indian states and PIN validation, delivery speed, payment method, order confirmation
- Wishlist, demo account, about and help pages
- 18 products across 6 categories, priced in rupees

## Where to change things

| To change | Edit |
|---|---|
| Products, prices, copy | `src/data/products.ts` |
| Categories | `src/data/categories.ts` |
| Photos | Files in `public/img`, named by the keys in `src/data/images.json` |
| Announcements, testimonials, FAQ, promo code | `src/data/content.ts` |
| Shipping fees, free-shipping minimum, promo rules | `src/lib/pricing.ts` |
| Colours, fonts, spacing | `:root` in `src/styles/base.css` |
| Logo | `src/components/Logo.tsx` on the site, files in `public/brand` |

## Photos

The store ships with 30 demo photos in `public/img`, so it shows images with no internet connection. They are placeholders: they set the look of the store and do not show the listed products. Replace each file with the real product photo, keeping the file name.

`src/data/images.json` also lists a product-matched web photo (Unsplash or Pexels) for every slot. `npm run images` downloads those over the demo photos. They were picked from their descriptions, so look through them before use. To load them live from the web first, set `VITE_REMOTE_IMAGES=1`.

If a photo cannot load, the tile shows a VEXORA placeholder. Sources are listed in `CREDITS.md`.

## Logo

The VEXORA logo is an icon (a rounded tile holding the X) plus a custom wordmark. One stroke of the X carries the accent colour.

| File in `public/brand` | Use |
|---|---|
| `vexora-logo.svg` / `.png` | Full logo on light backgrounds |
| `vexora-logo-white.svg` / `.png` | Full logo on dark backgrounds |
| `vexora-icon.svg` / `.png` | App icon, social avatar, favicon |
| `vexora-icon-white.svg` | Icon on dark backgrounds |
| `vexora-wordmark.svg` | Wordmark without the icon |

Colours: ink `#0E0F13`, paper `#F6F6F2`, accent `#2B3EFF` (logo stroke `#3D50FF`).

## Demo data

Products, prices, ratings, review counts, testimonials, offers, delivery estimates and store policies are illustrative. The store labels them on screen. Checkout takes no payment and asks for no card or UPI details. Replace the sample data and connect a payment gateway and order backend before going live.

## Deploy

`npm run build` and host `dist/` on any static host. `vercel.json` and `public/_redirects` already send every path to `index.html` for Vercel and Netlify. For hosts without rewrites, build with `VITE_ROUTER=hash`.
