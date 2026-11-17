import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { productById } from '../data/products';
import { plural } from '../lib/format';
import { useTitle } from '../lib/hooks';
import { useStore } from '../store/StoreContext';

export default function Wishlist() {
  useTitle('Wishlist');
  const { wishlist } = useStore();
  const saved = wishlist.flatMap((id) => productById.get(id) ?? []);

  if (saved.length === 0) {
    return (
      <div className="container page">
        <div className="empty empty--page">
          <Icon name="heart" size={36} />
          <h1>Your wishlist is empty.</h1>
          <p>Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="btn btn--primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="pagehead">
        <h1>Wishlist</h1>
        <p>{plural(saved.length, 'saved product')}</p>
      </header>
      <div className="pgrid">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
