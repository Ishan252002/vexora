import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Img from '../components/Img';
import { ShippingMeter } from '../components/Overlays';
import QtyStepper from '../components/QtyStepper';
import { PROMO_CODE } from '../data/content';
import { categoryBySlug } from '../data/categories';
import { inr, plural } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { PROMOS, type Totals } from '../lib/pricing';
import { useStore } from '../store/StoreContext';

export function SummaryRows({ totals, promo }: { totals: Totals; promo: string | null }) {
  return (
    <dl className="sumrows">
      <div>
        <dt>MRP total ({plural(totals.itemCount, 'item')})</dt>
        <dd>{inr(totals.mrpTotal)}</dd>
      </div>
      <div>
        <dt>Discount on MRP</dt>
        <dd className="is-save">-{inr(totals.savings)}</dd>
      </div>
      {totals.promoDiscount > 0 && promo && (
        <div>
          <dt>Promo {promo}</dt>
          <dd className="is-save">-{inr(totals.promoDiscount)}</dd>
        </div>
      )}
      <div>
        <dt>Shipping</dt>
        <dd>{totals.shipping === 0 ? 'Free' : inr(totals.shipping)}</dd>
      </div>
      <div className="sumrows__total">
        <dt>Total</dt>
        <dd data-testid="order-total">{inr(totals.total)}</dd>
      </div>
    </dl>
  );
}

export function PromoForm() {
  const { promo, applyPromo, removePromo } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter a promo code.');
      return;
    }
    if (applyPromo(code)) {
      setCode('');
      setError('');
    } else {
      setError(`That code is not valid. Try ${PROMO_CODE}.`);
    }
  };

  if (promo) {
    return (
      <div className="promo promo--on">
        <span>
          <Icon name="tag" size={16} /> <strong>{promo}</strong> applied: {PROMOS[promo].label}
        </span>
        <button type="button" className="textbtn" onClick={removePromo}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <form className="promo" onSubmit={onSubmit} noValidate>
      <label htmlFor="promo-code">Promo code</label>
      <div className="promo__row">
        <input
          id="promo-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          placeholder={PROMO_CODE}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby="promo-note"
        />
        <button type="submit" className="btn btn--ghost btn--sm">
          Apply
        </button>
      </div>
      <p id="promo-note" className={`fine ${error ? 'is-error' : ''}`}>
        {error || `First order? ${PROMO_CODE} takes 10% off.`}
      </p>
    </form>
  );
}

export default function Cart() {
  useTitle('Your cart');
  const { lines, totals, promo, setQty, removeLine, toggleWish, isWished } = useStore();

  if (lines.length === 0) {
    return (
      <div className="container page">
        <div className="empty empty--page">
          <Icon name="bag" size={36} />
          <h1>Your cart is empty.</h1>
          <p>Add a product and it shows up here.</p>
          <Link to="/shop" className="btn btn--primary">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="pagehead">
        <h1>Your cart</h1>
        <p>{plural(totals.itemCount, 'item')}</p>
      </header>

      <div className="cartlayout">
        <div>
          <ShippingMeter />
          <ul className="cartlines">
            {lines.map((l) => (
              <li key={l.id} className="cartline">
                <Link to={`/product/${l.product.slug}`} className="cartline__thumb">
                  <Img name={l.product.image} ratio={1} sizes="120px" label={l.product.name} />
                </Link>
                <div className="cartline__info">
                  <span className="pcard__cat">{categoryBySlug.get(l.product.category)?.short}</span>
                  <Link to={`/product/${l.product.slug}`} className="cartline__name">
                    {l.product.name}
                  </Link>
                  <span className="cartline__each">
                    {inr(l.product.price)} each <s>{inr(l.product.mrp)}</s>
                  </span>
                  <div className="cartline__actions">
                    <QtyStepper size="sm" value={l.qty} label={l.product.name} onChange={(q) => setQty(l.id, q)} />
                    {!isWished(l.id) && (
                      <button
                        type="button"
                        className="textbtn"
                        onClick={() => {
                          toggleWish(l.id);
                          removeLine(l.id);
                        }}
                      >
                        Move to wishlist
                      </button>
                    )}
                    <button type="button" className="textbtn" onClick={() => removeLine(l.id)}>
                      <Icon name="trash" size={14} /> Remove
                    </button>
                  </div>
                </div>
                <strong className="cartline__total">{inr(l.lineTotal)}</strong>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="link-arrow">
            Continue shopping
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <PromoForm />
          <SummaryRows totals={totals} promo={promo} />
          <Link to="/checkout" className="btn btn--primary btn--block btn--lg">
            Proceed to checkout
          </Link>
          <p className="fine">
            <Icon name="lock" size={13} /> Demo checkout. No payment is taken.
          </p>
        </aside>
      </div>
    </div>
  );
}
