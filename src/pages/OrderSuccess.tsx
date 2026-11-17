import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { inr } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { readOrders } from '../store/StoreContext';
import { SummaryRows } from './Cart';

const paymentLabel = { upi: 'UPI', card: 'Credit or debit card', cod: 'Cash on delivery' } as const;

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useMemo(() => readOrders().find((o) => o.id === id), [id]);
  useTitle(order ? `Order ${order.id}` : 'Order');

  if (!order) {
    return (
      <div className="container page">
        <div className="empty empty--page">
          <h1>We could not find that order.</h1>
          <p>Demo orders are kept in this browser only. Place a new one to see the confirmation page.</p>
          <Link to="/shop" className="btn btn--primary">
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  const c = order.customer;

  return (
    <div className="container page success">
      <div className="success__badge">
        <Icon name="check" size={28} />
      </div>
      <p className="eyebrow">Order {order.id}</p>
      <h1>Thank you, {c.name.split(' ')[0]}. Your demo order is placed.</h1>
      <p className="success__lede">
        This is a demo store, so nothing was charged and nothing will ship. On a live store, a confirmation would go
        to {c.email}.
      </p>

      <div className="success__grid">
        <section className="summary">
          <h2>Items</h2>
          <ul className="summary__lines summary__lines--plain">
            {order.lines.map((l) => (
              <li key={l.id}>
                <span>
                  {l.name} &times; {l.qty}
                </span>
                <strong>{inr(l.price * l.qty)}</strong>
              </li>
            ))}
          </ul>
          <SummaryRows totals={order.totals} promo={order.totals.promoDiscount > 0 ? 'applied' : null} />
        </section>

        <section className="summary">
          <h2>Delivery</h2>
          <address>
            {c.name}
            <br />
            {c.address}
            <br />
            {c.city}, {c.state} {c.pin}
            <br />
            +91 {c.phone}
          </address>
          <dl className="sumrows">
            <div>
              <dt>Speed</dt>
              <dd>{order.delivery === 'express' ? 'Express, 1 to 3 working days' : 'Standard, 3 to 7 working days'}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{paymentLabel[order.payment]}</dd>
            </div>
          </dl>
        </section>
      </div>

      <Link to="/shop" className="btn btn--primary btn--lg">
        Continue shopping
      </Link>
    </div>
  );
}
