import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/categories';
import { countInCategory } from '../data/products';
import { useStore } from '../store/StoreContext';
import Icon from './Icon';
import Logo from './Logo';

export default function Header() {
  const { cartCount, wishlist, openCart, openSearch, openMenu } = useStore();
  const location = useLocation();
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(location.search);
  const tag = params.get('tag');
  const onShop = location.pathname === '/shop';
  const active = {
    home: location.pathname === '/',
    shop: onShop && !tag && !params.get('category'),
    categories: onShop && Boolean(params.get('category')),
    new: onShop && tag === 'new',
    best: onShop && tag === 'bestseller',
  };

  useEffect(() => setCatOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCatOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [catOpen]);

  const cls = (on: boolean) => `nav__link ${on ? 'is-active' : ''}`;

  return (
    <header className="header">
      <div className="container header__row">
        <button type="button" className="iconbtn header__menu" onClick={openMenu} aria-label="Open menu">
          <Icon name="menu" />
        </button>

        <Link to="/" className="header__logo" aria-label="VEXORA home">
          <Logo height={30} />
        </Link>

        <nav className="nav" aria-label="Main">
          <Link to="/" className={cls(active.home)}>
            Home
          </Link>
          <Link to="/shop" className={cls(active.shop)}>
            Shop
          </Link>
          <div
            className="nav__group"
            ref={catRef}
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              type="button"
              className={cls(active.categories)}
              aria-expanded={catOpen}
              aria-controls="nav-categories"
              onClick={() => setCatOpen((v) => !v)}
            >
              Categories
              <Icon name="chevron-down" size={14} />
            </button>
            <div id="nav-categories" className={`nav__panel ${catOpen ? 'is-open' : ''}`}>
              <ul>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop?category=${c.slug}`}>
                      <span>{c.name}</span>
                      <small>{countInCategory(c.slug)} products</small>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/shop" className="nav__all">
                Shop everything
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
          <Link to="/shop?tag=new" className={cls(active.new)}>
            New Arrivals
          </Link>
          <Link to="/shop?tag=bestseller" className={cls(active.best)}>
            Best Sellers
          </Link>
        </nav>

        <div className="header__tools">
          <button type="button" className="iconbtn" onClick={openSearch} aria-label="Search products">
            <Icon name="search" />
          </button>
          <Link to="/account" className="iconbtn header__account" aria-label="Account">
            <Icon name="user" />
          </Link>
          <Link to="/wishlist" className="iconbtn" aria-label={`Wishlist, ${wishlist.length} saved`}>
            <Icon name="heart" />
            {wishlist.length > 0 && <span className="iconbtn__count">{wishlist.length}</span>}
          </Link>
          <button
            type="button"
            className="iconbtn"
            onClick={openCart}
            aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <Icon name="bag" />
            <span className="iconbtn__count iconbtn__count--cart" data-testid="cart-count">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
