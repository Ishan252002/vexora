import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { inr, plural } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { readOrders, useStore } from '../store/StoreContext';

const PROFILE_KEY = 'vexora:profile';

interface Profile {
  name: string;
  email: string;
}

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const p = raw ? (JSON.parse(raw) as Profile) : null;
    return p && typeof p.name === 'string' && typeof p.email === 'string' ? p : null;
  } catch {
    return null;
  }
}

export default function Account() {
  useTitle('Account');
  const { wishlist, notify } = useStore();
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const orders = useMemo(() => readOrders(), []);

  const signIn = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Enter your name and a valid email address.');
      return;
    }
    const next = { name: name.trim(), email: email.trim() };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setProfile(next);
    setError('');
    notify('Signed in to the demo account');
  };

  const signOut = () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
    setProfile(null);
  };

  if (!profile) {
    return (
      <div className="container page account">
        <div className="account__card">
          <p className="eyebrow">Account</p>
          <h1>Sign in to VEXORA</h1>
          <p className="notice">
            <Icon name="lock" size={15} /> Demo account. No password is needed and your details stay in this browser.
          </p>
          <form onSubmit={signIn} noValidate className="fields fields--stack">
            <div className="field">
              <label htmlFor="acc-name">Name</label>
              <input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="acc-email">Email</label>
              <input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            {error && <p className="field__err">{error}</p>}
            <button type="submit" className="btn btn--primary btn--block btn--lg">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="pagehead">
        <h1>Hello, {profile.name.split(' ')[0]}.</h1>
        <p>{profile.email}</p>
      </header>

      <div className="account__grid">
        <section className="summary">
          <h2>Recent orders</h2>
          {orders.length === 0 ? (
            <p className="fine">No orders yet. Demo orders you place in this browser appear here.</p>
          ) : (
            <ul className="orders">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={`/order/${o.id}`}>
                    <strong>{o.id}</strong>
                    <span>
                      {new Date(o.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {plural(o.totals.itemCount, 'item')}
                    </span>
                    <em>{inr(o.totals.total)}</em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="summary">
          <h2>Shortcuts</h2>
          <ul className="shortcuts">
            <li>
              <Link to="/wishlist">
                <Icon name="heart" size={18} /> Wishlist ({wishlist.length})
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <Icon name="bag" size={18} /> Cart
              </Link>
            </li>
            <li>
              <Link to="/help">
                <Icon name="truck" size={18} /> Shipping and returns
              </Link>
            </li>
          </ul>
          <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
}
