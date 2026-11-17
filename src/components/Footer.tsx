import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { DEMO_NOTICE } from '../data/content';
import Logo from './Logo';

const payments = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net banking', 'Cash on delivery'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo height={36} tone="paper" />
          <p className="footer__tag">Discover. Shop. Experience.</p>
          <p className="footer__about">
            One store for gadgets, home, fashion, beauty, fitness and travel. Priced in rupees and delivered across
            India.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2>Shop</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2>Help</h2>
          <ul>
            <li>
              <Link to="/help#shipping">Shipping</Link>
            </li>
            <li>
              <Link to="/help#returns">Returns</Link>
            </li>
            <li>
              <Link to="/help#payments">Payments</Link>
            </li>
            <li>
              <Link to="/help#faq">FAQ</Link>
            </li>
            <li>
              <Link to="/account">Your account</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/about">About VEXORA</Link>
            </li>
            <li>
              <Link to="/shop?tag=new">New arrivals</Link>
            </li>
            <li>
              <Link to="/shop?tag=bestseller">Best sellers</Link>
            </li>
            <li>
              <Link to="/shop?tag=deal">This week's offers</Link>
            </li>
            <li>
              <Link to="/help#contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container footer__pay">
        <span>We accept</span>
        <ul>
          {payments.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="container footer__base">
        <p>&copy; {new Date().getFullYear()} VEXORA. All prices in Indian rupees, inclusive of taxes.</p>
        <p className="footer__demo">{DEMO_NOTICE}</p>
      </div>
    </footer>
  );
}
