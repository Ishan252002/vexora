import { Link } from 'react-router-dom';
import { categoryBySlug } from '../data/categories';
import type { Product } from '../data/products';
import { inr, pctOff } from '../lib/format';
import { useStore } from '../store/StoreContext';
import Icon from './Icon';
import Img from './Img';

function badgeFor(p: Product): { label: string; kind: 'sale' | 'ink' | 'accent' } | null {
  if (p.tags.includes('deal')) return { label: 'Offer', kind: 'sale' };
  if (p.tags.includes('bestseller')) return { label: 'Bestseller', kind: 'ink' };
  if (p.tags.includes('new')) return { label: 'New', kind: 'accent' };
  return null;
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="rating" aria-label={`Sample rating ${value} out of 5`}>
      <Icon name="star" size={13} filled />
      <span>{value.toFixed(1)}</span>
      {count !== undefined && <span className="rating__count">({count.toLocaleString('en-IN')})</span>}
    </span>
  );
}

export function Price({ price, mrp, size = 'md' }: { price: number; mrp: number; size?: 'md' | 'lg' }) {
  const off = pctOff(price, mrp);
  return (
    <div className={`price price--${size}`}>
      <span className="price__now">{inr(price)}</span>
      {off > 0 && (
        <>
          <s className="price__mrp" aria-label={`MRP ${inr(mrp)}`}>
            {inr(mrp)}
          </s>
          <span className="price__off">{off}% off</span>
        </>
      )}
    </div>
  );
}

export default function ProductCard({ product, sizes }: { product: Product; sizes?: string }) {
  const { addToCart, toggleWish, isWished } = useStore();
  const wished = isWished(product.id);
  const badge = badgeFor(product);
  const href = `/product/${product.slug}`;

  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <Img name={product.image} ratio={4 / 5} label={product.name} sizes={sizes} />
        </Link>
        {badge && <span className={`badge badge--${badge.kind}`}>{badge.label}</span>}
        <button
          type="button"
          className={`pcard__wish ${wished ? 'is-on' : ''}`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => toggleWish(product.id)}
        >
          <Icon name="heart" size={18} filled={wished} />
        </button>
        <button
          type="button"
          className="pcard__add"
          onClick={() => addToCart(product.id)}
          aria-label={`Add ${product.name} to cart`}
        >
          <Icon name="plus" size={16} />
          Add to cart
        </button>
      </div>
      <div className="pcard__body">
        <div className="pcard__top">
          <span className="pcard__cat">{categoryBySlug.get(product.category)?.short}</span>
          <Rating value={product.rating} count={product.reviews} />
        </div>
        <h3 className="pcard__name">
          <Link to={href}>{product.name}</Link>
        </h3>
        <Price price={product.price} mrp={product.mrp} />
      </div>
    </article>
  );
}
