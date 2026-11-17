import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import Img from '../components/Img';
import ProductCard, { Price, Rating } from '../components/ProductCard';
import QtyStepper from '../components/QtyStepper';
import { categoryBySlug } from '../data/categories';
import { productBySlug, relatedTo } from '../data/products';
import { inr } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { FREE_SHIPPING_MIN } from '../lib/pricing';
import { deliveryWindow } from '../lib/time';
import { useStore } from '../store/StoreContext';
import NotFound from './NotFound';

export default function ProductPage() {
  const { slug } = useParams();
  const product = slug ? productBySlug.get(slug) : undefined;
  const { addToCart, toggleWish, isWished } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState('');
  const [eta, setEta] = useState<string | null>(null);
  const [pinError, setPinError] = useState('');

  useTitle(product?.name ?? 'Product not found');

  useEffect(() => {
    setQty(1);
    setPin('');
    setEta(null);
    setPinError('');
  }, [slug]);

  if (!product) return <NotFound />;

  const category = categoryBySlug.get(product.category)!;
  const wished = isWished(product.id);
  const related = relatedTo(product, 4);

  const checkPin = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setEta(null);
      setPinError('Enter a 6-digit PIN code, for example 560001.');
      return;
    }
    setPinError('');
    setEta(deliveryWindow());
  };

  const buyNow = () => {
    addToCart(product.id, qty, { silent: true });
    navigate('/checkout');
  };

  return (
    <div className="container page pdp">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <Icon name="chevron-right" size={14} />
        <Link to={`/shop?category=${category.slug}`}>{category.name}</Link>
        <Icon name="chevron-right" size={14} />
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp__grid">
        <div className="pdp__media">
          <Img
            name={product.image}
            ratio={1}
            eager
            label={product.name}
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>

        <div className="pdp__info">
          <div className="pdp__tags">
            <Link to={`/shop?category=${category.slug}`} className="eyebrow">
              {category.name}
            </Link>
            {product.tags.includes('bestseller') && <span className="badge badge--ink badge--static">Bestseller</span>}
            {product.tags.includes('new') && <span className="badge badge--accent badge--static">New</span>}
            {product.tags.includes('deal') && <span className="badge badge--sale badge--static">Offer</span>}
          </div>

          <h1>{product.name}</h1>

          <div className="pdp__rating">
            <Rating value={product.rating} count={product.reviews} />
            <span className="pill">Sample rating</span>
          </div>

          <Price price={product.price} mrp={product.mrp} size="lg" />
          <p className="fine">Inclusive of all taxes. You save {inr(product.mrp - product.price)} on MRP.</p>

          <p className="pdp__short">{product.short}</p>

          {product.stock === 'low' && (
            <p className="pdp__stock">
              <span aria-hidden="true" /> Only a few left in stock
            </p>
          )}

          <div className="pdp__buy">
            <QtyStepper value={qty} onChange={setQty} label={product.name} />
            <button type="button" className="btn btn--primary btn--lg pdp__add" onClick={() => addToCart(product.id, qty)}>
              <Icon name="bag" size={18} />
              Add to cart
            </button>
            <button
              type="button"
              className={`iconbtn iconbtn--line iconbtn--lg ${wished ? 'is-on' : ''}`}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => toggleWish(product.id)}
            >
              <Icon name="heart" filled={wished} />
            </button>
          </div>
          <button type="button" className="btn btn--ghost btn--lg btn--block" onClick={buyNow}>
            Buy now
          </button>

          <form className="pincheck" onSubmit={checkPin} noValidate>
            <label htmlFor="pin">
              <Icon name="pin" size={16} /> Check delivery to your PIN code
            </label>
            <div className="pincheck__row">
              <input
                id="pin"
                inputMode="numeric"
                maxLength={6}
                placeholder="560001"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                aria-invalid={Boolean(pinError)}
                aria-describedby="pin-result"
              />
              <button type="submit" className="btn btn--ghost btn--sm">
                Check
              </button>
            </div>
            <p id="pin-result" className={`fine ${pinError ? 'is-error' : ''}`} role="status">
              {pinError ||
                (eta ? `Delivery to ${pin} between ${eta}. Illustrative estimate.` : 'Standard delivery takes 3 to 7 working days.')}
            </p>
          </form>

          <ul className="pdp__assure">
            <li>
              <Icon name="truck" size={18} />
              {product.price >= FREE_SHIPPING_MIN
                ? 'Free standard shipping on this item'
                : `Free shipping on orders over ${inr(FREE_SHIPPING_MIN)}`}
            </li>
            <li>
              <Icon name="refresh" size={18} />
              7-day returns
            </li>
            <li>
              <Icon name="card" size={18} />
              UPI, cards or cash on delivery
            </li>
          </ul>

          <div className="accordion">
            <details open>
              <summary>
                About this product <Icon name="chevron-down" size={16} />
              </summary>
              <p>{product.description}</p>
              <ul className="ticks">
                {product.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" size={15} />
                    {h}
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary>
                Specifications <Icon name="chevron-down" size={16} />
              </summary>
              <table className="specs">
                <tbody>
                  {product.specs.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            <details>
              <summary>
                Shipping and returns <Icon name="chevron-down" size={16} />
              </summary>
              <p>
                Standard shipping is free on orders over {inr(FREE_SHIPPING_MIN)} and ₹79 below that. Orders ship within
                2 working days and arrive in 3 to 7 working days.
              </p>
              <p>
                Return the item within 7 days of delivery if it is unused and in its original packaging.{' '}
                <Link to="/help#returns">Read the returns policy</Link>.
              </p>
            </details>
          </div>

          <p className="fine pdp__demo">Demo listing: price, rating, stock and specifications are illustrative.</p>
        </div>
      </div>

      <section className="section section--flush pdp__related">
        <div className="sechead">
          <div>
            <p className="eyebrow">More to explore</p>
            <h2>You may also like</h2>
          </div>
          <Link to={`/shop?category=${category.slug}`} className="link-arrow">
            More in {category.short}
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="pgrid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
