import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import Icon from '../components/Icon';
import Img from '../components/Img';
import ProductCard from '../components/ProductCard';
import { categories, type CategorySlug } from '../data/categories';
import { perks, PROMO_CODE, reasons, testimonials } from '../data/content';
import { countInCategory, productBySlug, products, withTag } from '../data/products';
import { inr, plural } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { useStore } from '../store/StoreContext';

const GRID_SIZES = '(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw';

const bestSellers = [...withTag('bestseller')].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
const trending = [...withTag('trending')].sort((a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99));
const arrivals = [...withTag('new')].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);
const offers = withTag('deal').slice(0, 4);
const lowestPrice = Math.min(...products.map((p) => p.price));
const fromPrice = (slug: CategorySlug) =>
  inr(Math.min(...products.filter((p) => p.category === slug).map((p) => p.price)));
const heroPick = productBySlug.get('wireless-bluetooth-headphones')!;

function SectionHead({
  eyebrow,
  title,
  to,
  cta,
  children,
}: {
  eyebrow?: string;
  title: string;
  to?: string;
  cta?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sechead">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
      {to && cta && (
        <Link to={to} className="link-arrow">
          {cta}
          <Icon name="arrow-right" size={16} />
        </Link>
      )}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'done' : 'error');
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="container newsletter__grid">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2 id="newsletter-title">New arrivals and weekly offers, one email a week.</h2>
        </div>
        <div>
          {state === 'done' ? (
            <p className="newsletter__done" role="status">
              <Icon name="check" size={18} /> You are on the list. Use code {PROMO_CODE} for 10% off your first order.
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={onSubmit} noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState('idle');
                }}
                aria-invalid={state === 'error'}
                aria-describedby="newsletter-note"
                autoComplete="email"
              />
              <button type="submit" className="btn btn--primary">
                Subscribe
              </button>
            </form>
          )}
          <p id="newsletter-note" className={`fine ${state === 'error' ? 'is-error' : ''}`}>
            {state === 'error'
              ? 'Enter a valid email address, for example name@example.com.'
              : 'Unsubscribe any time. Demo form: no email is sent or stored.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useTitle('');
  const { notify } = useStore();
  const rail = useRef<HTMLDivElement>(null);

  const slide = (dir: 1 | -1) => {
    const el = rail.current;
    if (el && typeof el.scrollBy === 'function') {
      el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      notify(`Code ${PROMO_CODE} copied`);
    } catch {
      notify(`Your code is ${PROMO_CODE}`);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--mark">Discover. Shop. Experience.</p>
            <h1>
              Upgrade Your Everyday<span className="accent-dot">.</span>
            </h1>
            <p className="hero__lede">
              Discover innovative products, everyday essentials and trending finds, all in one place.
            </p>
            <div className="hero__cta">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop now
                <Icon name="arrow-right" size={18} />
              </Link>
              <a href="#categories" className="btn btn--ghost btn--lg">
                Explore collection
              </a>
            </div>
            <dl className="hero__facts">
              <div>
                <dt>{products.length}</dt>
                <dd>curated products</dd>
              </div>
              <div>
                <dt>{categories.length}</dt>
                <dd>categories</dd>
              </div>
              <div>
                <dt>{inr(lowestPrice)}</dt>
                <dd>starting price</dd>
              </div>
            </dl>
          </div>

          <div className="hero__art">
            <Img
              name="hero_main"
              ratio={4 / 5}
              eager
              sizes="(max-width: 900px) 92vw, 44vw"
              label="VEXORA"
              className="hero__main"
            />
            <Img name="hero_side" ratio={1} eager sizes="(max-width: 900px) 40vw, 20vw" className="hero__side" />
            <Link to={`/product/${heroPick.slug}`} className="hero__chip">
              <Img name={heroPick.image} ratio={1} sizes="64px" eager />
              <span>
                <small>Bestseller</small>
                <strong>{heroPick.name}</strong>
                <em>{inr(heroPick.price)}</em>
              </span>
              <Icon name="arrow-up-right" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Service promises */}
      <section className="perks" aria-label="Shopping with VEXORA">
        <ul className="container perks__grid">
          {perks.map((p) => (
            <li key={p.title}>
              <Icon name={p.icon} size={22} />
              <div>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 1. Featured categories */}
      <section className="section" id="categories">
        <div className="container">
          <SectionHead eyebrow="Featured categories" title="Shop by category" to="/shop" cta="View all products" />
          <ul className="cats">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className="cat">
                  <Img
                    name={c.image}
                    ratio={3 / 4}
                    label={c.short}
                    sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 16vw"
                  />
                  <span className="cat__name">
                    {c.name}
                    <Icon name="arrow-up-right" size={16} />
                  </span>
                  <span className="cat__meta">
                    {plural(countInCategory(c.slug), 'product')} &middot; from {fromPrice(c.slug)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Best sellers */}
      <section className="section section--flush">
        <div className="container">
          <SectionHead eyebrow="Most ordered" title="Best sellers" to="/shop?tag=bestseller" cta="Shop best sellers" />
          <div className="pgrid">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} sizes={GRID_SIZES} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional banners */}
      <section className="section">
        <div className="container banners">
          <Link to="/shop?category=electronics" className="banner banner--wide">
            <Img name="banner_audio" tone="dark" sizes="(max-width: 900px) 100vw, 58vw" className="banner__img" />
            <div className="banner__copy">
              <p className="eyebrow">Electronics &amp; Gadgets</p>
              <h3>Tech that keeps up with you.</h3>
              <p>Headphones, speakers and wearables from {fromPrice('electronics')}.</p>
              <span className="banner__cta">
                Shop electronics <Icon name="arrow-right" size={16} />
              </span>
            </div>
          </Link>
          <Link to="/shop?category=travel" className="banner">
            <Img name="banner_travel" tone="dark" sizes="(max-width: 900px) 100vw, 40vw" className="banner__img" />
            <div className="banner__copy">
              <p className="eyebrow">Travel Essentials</p>
              <h3>Pack light. Go far.</h3>
              <p>Cabin trolleys, backpacks and neck pillows from {fromPrice('travel')}.</p>
              <span className="banner__cta">
                Shop travel <Icon name="arrow-right" size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Trending now */}
      <section className="section section--flush">
        <div className="container">
          <SectionHead eyebrow="This week" title="Trending now">
            <div className="rail__nav">
              <button type="button" className="iconbtn iconbtn--line" onClick={() => slide(-1)} aria-label="Scroll back">
                <Icon name="chevron-left" />
              </button>
              <button type="button" className="iconbtn iconbtn--line" onClick={() => slide(1)} aria-label="Scroll forward">
                <Icon name="chevron-right" />
              </button>
            </div>
          </SectionHead>
          <div className="rail" ref={rail} tabIndex={0} aria-label="Trending products">
            {trending.map((p, i) => (
              <div className="rail__item" key={p.id}>
                <span className="rail__rank" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ProductCard product={p} sizes="(max-width: 640px) 70vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Limited-time offers */}
      <section className="offers">
        <div className="container">
          <div className="offers__head">
            <div>
              <p className="eyebrow">Limited-time offers</p>
              <h2>This week's offers</h2>
              <p className="offers__note">
                Prices below hold until Sunday, 11:59 pm IST. <span className="pill">Illustrative offer</span>
              </p>
            </div>
            <Countdown />
          </div>
          <div className="pgrid">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} sizes={GRID_SIZES} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. New arrivals */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Just added" title="New arrivals" to="/shop?tag=new" cta="See all new arrivals" />
          <div className="pgrid">
            {arrivals.map((p) => (
              <ProductCard key={p.id} product={p} sizes={GRID_SIZES} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promotional banners: home feature and first-order code */}
      <section className="section section--flush">
        <div className="container feature">
          <Img name="banner_home" ratio={16 / 10} sizes="(max-width: 900px) 100vw, 55vw" label="Home & Living" />
          <div className="feature__copy">
            <p className="eyebrow">Home &amp; Living</p>
            <h2>Make one corner of your home yours.</h2>
            <p>
              A lamp that is easy on your eyes, a diffuser that runs through the night and candles that burn for 25
              hours each. All three from {fromPrice('home')}.
            </p>
            <Link to="/shop?category=home" className="btn btn--primary">
              Shop home &amp; living
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="firstorder">
            <Img name="banner_offer" tone="dark" sizes="100vw" className="firstorder__img" />
            <div className="firstorder__copy">
              <p className="eyebrow">First order</p>
              <h2>Extra 10% off your first order.</h2>
              <p>Enter the code in your cart. It works on everything, including this week's offers.</p>
            </div>
            <div className="firstorder__action">
              <button type="button" className="codebox" onClick={copyCode} aria-label={`Copy code ${PROMO_CODE}`}>
                <span>{PROMO_CODE}</span>
                <small>Copy code</small>
              </button>
              <Link to="/shop" className="btn btn--paper">
                Start shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why choose VEXORA */}
      <section className="section section--flush">
        <div className="container why">
          <div className="why__intro">
            <p className="eyebrow">Why choose VEXORA?</p>
            <h2>Fewer, better choices. Clear prices. Easy returns.</h2>
            <Link to="/about" className="link-arrow">
              About VEXORA
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <ul className="why__grid">
            {reasons.map((r) => (
              <li key={r.title}>
                <Icon name={r.icon} size={24} />
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Customer testimonials" title="What shoppers say">
            <span className="pill">Illustrative reviews</span>
          </SectionHead>
          <ul className="quotes">
            {testimonials.map((t) => (
              <li key={t.name} className="quote">
                <div className="quote__stars" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon key={i} name="star" size={15} filled={i < t.rating} />
                  ))}
                </div>
                <blockquote>{t.quote}</blockquote>
                <footer>
                  <strong>
                    {t.name}, {t.city}
                  </strong>
                  <span>Bought: {t.product}</span>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. Newsletter */}
      <Newsletter />
    </>
  );
}
