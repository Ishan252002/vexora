import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Img from '../components/Img';
import { inr } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { EXPRESS_SHIPPING, type Delivery } from '../lib/pricing';
import { useStore, type Customer, type PaymentMethod } from '../store/StoreContext';
import { PromoForm, SummaryRows } from './Cart';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
  'Puducherry',
];

const payments: { id: PaymentMethod; title: string; text: string }[] = [
  { id: 'upi', title: 'UPI', text: 'Pay with any UPI app.' },
  { id: 'card', title: 'Credit or debit card', text: 'Visa, Mastercard and RuPay.' },
  { id: 'cod', title: 'Cash on delivery', text: 'Pay in cash when the order arrives.' },
];

const emptyCustomer: Customer = { name: '', email: '', phone: '', address: '', city: '', state: '', pin: '' };

type Errors = Partial<Record<keyof Customer, string>>;

export function validate(c: Customer): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = 'Enter a valid email, for example name@example.com.';
  if (!/^[6-9]\d{9}$/.test(c.phone.trim())) e.phone = 'Enter a 10-digit mobile number.';
  if (c.address.trim().length < 6) e.address = 'Enter your house number and street.';
  if (c.city.trim().length < 2) e.city = 'Enter your city.';
  if (!c.state) e.state = 'Choose your state.';
  if (!/^[1-9]\d{5}$/.test(c.pin.trim())) e.pin = 'Enter a 6-digit PIN code.';
  return e;
}

export default function Checkout() {
  useTitle('Checkout');
  const { lines, promo, totalsFor, placeOrder } = useStore();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<Delivery>('standard');
  const [payment, setPayment] = useState<PaymentMethod>('upi');

  const totals = totalsFor(delivery);
  const standardCost = totalsFor('standard').shipping;

  if (lines.length === 0) {
    return (
      <div className="container page">
        <div className="empty empty--page">
          <Icon name="bag" size={36} />
          <h1>Nothing to check out yet.</h1>
          <p>Your cart is empty. Add a product first.</p>
          <Link to="/shop" className="btn btn--primary">
            Go to the shop
          </Link>
        </div>
      </div>
    );
  }

  const set = (key: keyof Customer) => (value: string) => {
    setCustomer((c) => ({ ...c, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(customer);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    const order = placeOrder(customer, delivery, payment);
    navigate(`/order/${order.id}`);
  };

  const field = (
    key: keyof Customer,
    label: string,
    props: { type?: string; autoComplete?: string; inputMode?: 'numeric' | 'tel' | 'email'; maxLength?: number; placeholder?: string } = {},
  ) => (
    <div className={`field ${errors[key] ? 'has-error' : ''}`}>
      <label htmlFor={`co-${key}`}>{label}</label>
      <input
        id={`co-${key}`}
        name={key}
        value={customer[key]}
        onChange={(e) => set(key)(e.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `co-${key}-err` : undefined}
        {...props}
      />
      {errors[key] && (
        <p className="field__err" id={`co-${key}-err`}>
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/cart">Cart</Link>
        <Icon name="chevron-right" size={14} />
        <span aria-current="page">Checkout</span>
      </nav>
      <header className="pagehead">
        <h1>Checkout</h1>
        <p className="notice">
          <Icon name="lock" size={15} /> Demo checkout. No payment is taken, and no card or UPI details are requested.
        </p>
      </header>

      <form className="cartlayout" onSubmit={onSubmit} noValidate>
        <div className="checkout">
          <fieldset className="checkout__step">
            <legend>
              <span>1</span> Contact
            </legend>
            <div className="fields">
              {field('name', 'Full name', { autoComplete: 'name' })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
              {field('phone', 'Mobile number', { type: 'tel', autoComplete: 'tel-national', inputMode: 'tel', maxLength: 10, placeholder: '10 digits' })}
            </div>
          </fieldset>

          <fieldset className="checkout__step">
            <legend>
              <span>2</span> Delivery address
            </legend>
            <div className="fields">
              <div className="fields__wide">{field('address', 'House number, building and street', { autoComplete: 'street-address' })}</div>
              {field('city', 'City', { autoComplete: 'address-level2' })}
              <div className={`field ${errors.state ? 'has-error' : ''}`}>
                <label htmlFor="co-state">State</label>
                <select
                  id="co-state"
                  name="state"
                  value={customer.state}
                  onChange={(e) => set('state')(e.target.value)}
                  aria-invalid={Boolean(errors.state)}
                  autoComplete="address-level1"
                >
                  <option value="">Choose a state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="field__err">{errors.state}</p>}
              </div>
              {field('pin', 'PIN code', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6 })}
            </div>
          </fieldset>

          <fieldset className="checkout__step">
            <legend>
              <span>3</span> Delivery speed
            </legend>
            <div className="options">
              <label className={`option ${delivery === 'standard' ? 'is-on' : ''}`}>
                <input type="radio" name="delivery" id="del-standard" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
                <span>
                  <strong>Standard</strong>
                  <small>3 to 7 working days</small>
                </span>
                <em>{standardCost === 0 ? 'Free' : inr(standardCost)}</em>
              </label>
              <label className={`option ${delivery === 'express' ? 'is-on' : ''}`}>
                <input type="radio" name="delivery" id="del-express" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
                <span>
                  <strong>Express</strong>
                  <small>1 to 3 working days</small>
                </span>
                <em>{inr(EXPRESS_SHIPPING)}</em>
              </label>
            </div>
          </fieldset>

          <fieldset className="checkout__step">
            <legend>
              <span>4</span> Payment method
            </legend>
            <div className="options">
              {payments.map((p) => (
                <label key={p.id} className={`option ${payment === p.id ? 'is-on' : ''}`}>
                  <input type="radio" name="payment" id={`pay-${p.id}`} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span>
                    <strong>{p.title}</strong>
                    <small>{p.text}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <ul className="summary__lines">
            {lines.map((l) => (
              <li key={l.id}>
                <span className="summary__thumb">
                  <Img name={l.product.image} ratio={1} sizes="56px" />
                  <b>{l.qty}</b>
                </span>
                <span>{l.product.name}</span>
                <strong>{inr(l.lineTotal)}</strong>
              </li>
            ))}
          </ul>
          <PromoForm />
          <SummaryRows totals={totals} promo={promo} />
          <button type="submit" className="btn btn--primary btn--block btn--lg">
            Place demo order
          </button>
          <p className="fine">By placing the order you agree to the store's shipping and returns terms.</p>
        </aside>
      </form>
    </div>
  );
}
