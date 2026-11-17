import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { popularSearches } from '../data/content';
import { products } from '../data/products';
import { matchesQuery } from '../lib/catalog';
import { inr } from '../lib/format';
import { FREE_SHIPPING_MIN } from '../lib/pricing';
import { useStore } from '../store/StoreContext';
import Icon from './Icon';
import Img from './Img';
import Logo from './Logo';
import QtyStepper from './QtyStepper';

/** Progress toward free standard shipping. Shared by the drawer and the cart page. */
export function ShippingMeter() {
  const { totals } = useStore();
  const reached = totals.freeShippingGap === 0;
  const pct = Math.min(100, Math.round(((FREE_SHIPPING_MIN - totals.freeShippingGap) / FREE_SHIPPING_MIN) * 100));
  return (
    <div className="meter">
      <p>
        {reached ? (
          <>
            <Icon name="check" size={15} /> You have free standard shipping.
          </>
        ) : (
          <>
            Add <strong>{inr(totals.freeShippingGap)}</strong> more for free shipping.
          </>
        )}
      </p>
      <div className="meter__track" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, closeOverlays, lines, totals, setQty, removeLine } = useStore();

  return (
    <div className={`overlay ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
      <div className="overlay__scrim" onClick={closeOverlays} />
      <aside className="drawer drawer--right" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="drawer__head">
          <h2>
            Your cart <span>({totals.itemCount})</span>
          </h2>
          <button type="button" className="iconbtn" onClick={closeOverlays} aria-label="Close cart">
            <Icon name="x" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <Icon name="bag" size={32} />
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn--primary" onClick={closeOverlays}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <ShippingMeter />
              <ul className="minicart">
                {lines.map((l) => (
                  <li key={l.id} className="minicart__line">
                    <Link to={`/product/${l.product.slug}`} onClick={closeOverlays} className="minicart__thumb">
                      <Img name={l.product.image} ratio={1} sizes="88px" />
                    </Link>
                    <div className="minicart__info">
                      <Link to={`/product/${l.product.slug}`} onClick={closeOverlays}>
                        {l.product.name}
                      </Link>
                      <span className="minicart__price">{inr(l.product.price)}</span>
                      <div className="minicart__row">
                        <QtyStepper
                          size="sm"
                          value={l.qty}
                          label={l.product.name}
                          onChange={(q) => setQty(l.id, q)}
                        />
                        <button type="button" className="textbtn" onClick={() => removeLine(l.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <strong className="minicart__total">{inr(l.lineTotal)}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="drawer__foot">
              <div className="drawer__sum">
                <span>Subtotal</span>
                <strong>{inr(totals.subtotal)}</strong>
              </div>
              <p className="fine">Taxes included. Shipping and promo codes are applied at checkout.</p>
              <Link to="/checkout" className="btn btn--primary btn--block" onClick={closeOverlays}>
                Checkout
              </Link>
              <Link to="/cart" className="btn btn--ghost btn--block" onClick={closeOverlays}>
                View cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export function SearchOverlay() {
  const { searchOpen, closeOverlays } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    setQuery('');
  }, [searchOpen]);

  const results = useMemo(
    () => (query.trim() ? products.filter((p) => matchesQuery(p, query)) : []),
    [query],
  );

  const go = (q: string) => {
    closeOverlays();
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) go(query);
  };

  return (
    <div className={`overlay overlay--top ${searchOpen ? 'is-open' : ''}`} aria-hidden={!searchOpen}>
      <div className="overlay__scrim" onClick={closeOverlays} />
      <div className="searchsheet" role="dialog" aria-modal="true" aria-label="Search products">
        <div className="container">
          <form className="searchsheet__form" onSubmit={onSubmit} role="search">
            <Icon name="search" size={22} />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headphones, yoga mat, backpack..."
              autoComplete="off"
            />
            <button type="button" className="iconbtn" onClick={closeOverlays} aria-label="Close search">
              <Icon name="x" />
            </button>
          </form>

          {query.trim() === '' ? (
            <div className="searchsheet__hints">
              <span className="eyebrow">Popular searches</span>
              <div className="chips">
                {popularSearches.map((term) => (
                  <button type="button" key={term} className="chip" onClick={() => go(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="searchsheet__none">
              No products match &ldquo;{query.trim()}&rdquo;. Try a shorter word, or browse a category.
            </p>
          ) : (
            <>
              <ul className="searchsheet__results">
                {results.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} onClick={closeOverlays}>
                      <Img name={p.image} ratio={1} sizes="64px" className="searchsheet__thumb" />
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.short}</small>
                      </span>
                      <em>{inr(p.price)}</em>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="link-arrow" onClick={() => go(query)}>
                See all {results.length} {results.length === 1 ? 'result' : 'results'}
                <Icon name="arrow-right" size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MobileMenu() {
  const { menuOpen, closeOverlays, wishlist } = useStore();
  const links: [string, string][] = [
    ['Home', '/'],
    ['Shop all', '/shop'],
    ['New Arrivals', '/shop?tag=new'],
    ['Best Sellers', '/shop?tag=bestseller'],
    ["This week's offers", '/shop?tag=deal'],
  ];

  return (
    <div className={`overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
      <div className="overlay__scrim" onClick={closeOverlays} />
      <aside className="drawer drawer--left" role="dialog" aria-modal="true" aria-label="Menu">
        <header className="drawer__head">
          <Logo height={28} />
          <button type="button" className="iconbtn" onClick={closeOverlays} aria-label="Close menu">
            <Icon name="x" />
          </button>
        </header>
        <nav className="drawer__body mobilenav" aria-label="Mobile">
          <ul className="mobilenav__main">
            {links.map(([label, to]) => (
              <li key={to}>
                <Link to={to} onClick={closeOverlays}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="eyebrow">Categories</span>
          <ul className="mobilenav__cats">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} onClick={closeOverlays}>
                  {c.name}
                  <Icon name="chevron-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mobilenav__meta">
            <li>
              <Link to="/account" onClick={closeOverlays}>
                <Icon name="user" size={18} /> Account
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={closeOverlays}>
                <Icon name="heart" size={18} /> Wishlist ({wishlist.length})
              </Link>
            </li>
            <li>
              <Link to="/help" onClick={closeOverlays}>
                <Icon name="truck" size={18} /> Shipping and returns
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className="toast-wrap" aria-live="polite" role="status">
      {toast && (
        <div className="toast" key={toast.id}>
          <Icon name="check" size={16} />
          {toast.text}
        </div>
      )}
    </div>
  );
}
