import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Img from '../components/Img';
import { categories } from '../data/categories';
import { faqs, reasons } from '../data/content';
import { products } from '../data/products';
import { inr } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { EXPRESS_SHIPPING, FREE_SHIPPING_MIN, STANDARD_SHIPPING } from '../lib/pricing';

export function About() {
  useTitle('About');
  return (
    <div className="container page about">
      <header className="about__head">
        <p className="eyebrow">About VEXORA</p>
        <h1>One store for the things you use every day.</h1>
        <p className="about__lede">
          VEXORA sells {products.length} products across {categories.length} categories: gadgets, home, fashion, beauty,
          fitness and travel. We keep the list short so choosing is quick, price everything in rupees with taxes
          included, and ship across India.
        </p>
      </header>

      <Img name="banner_home" ratio={21 / 9} sizes="100vw" label="VEXORA" />

      <ul className="why__grid about__reasons">
        {reasons.map((r) => (
          <li key={r.title}>
            <Icon name={r.icon} size={24} />
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>

      <div className="about__cta">
        <h2>Discover. Shop. Experience.</h2>
        <Link to="/shop" className="btn btn--primary btn--lg">
          Shop all products
        </Link>
      </div>
    </div>
  );
}

export function Help() {
  useTitle('Help');
  return (
    <div className="container page help">
      <header className="pagehead">
        <h1>Help</h1>
        <p>Shipping, returns, payments and answers to common questions.</p>
      </header>

      <div className="help__layout">
        <nav className="help__nav" aria-label="Help topics">
          <a href="#shipping">Shipping</a>
          <a href="#returns">Returns</a>
          <a href="#payments">Payments</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="help__body">
          <section id="shipping">
            <h2>Shipping</h2>
            <table className="specs">
              <tbody>
                <tr>
                  <th scope="row">Standard</th>
                  <td>
                    3 to 7 working days. Free over {inr(FREE_SHIPPING_MIN)}, {inr(STANDARD_SHIPPING)} below.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Express</th>
                  <td>1 to 3 working days. Flat {inr(EXPRESS_SHIPPING)}.</td>
                </tr>
                <tr>
                  <th scope="row">Dispatch</th>
                  <td>Within 2 working days of your order.</td>
                </tr>
                <tr>
                  <th scope="row">Tracking</th>
                  <td>A tracking link by SMS and email once the order ships.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="returns">
            <h2>Returns</h2>
            <p>
              Raise a return within 7 days of delivery. The item must be unused and in its original packaging. We
              arrange the pickup and refund the original payment method within 5 to 7 working days of receiving it.
            </p>
            <p>Personal care products can be returned only if the seal is unbroken.</p>
          </section>

          <section id="payments">
            <h2>Payments</h2>
            <p>
              Pay by UPI, credit or debit card (Visa, Mastercard, RuPay), net banking or cash on delivery. All prices
              are in Indian rupees and include taxes.
            </p>
          </section>

          <section id="faq">
            <h2>Frequently asked questions</h2>
            <div className="accordion">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q} <Icon name="chevron-down" size={16} />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="contact">
            <h2>Contact</h2>
            <p>
              Email support@vexora.example or call 1800-000-0000, Monday to Saturday, 10 am to 7 pm IST. These are
              sample contact details for the demo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
