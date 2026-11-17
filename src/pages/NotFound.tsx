import { Link } from 'react-router-dom';
import { useTitle } from '../lib/hooks';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="container page">
      <div className="empty empty--page">
        <p className="eyebrow">Error 404</p>
        <h1>This page does not exist.</h1>
        <p>The link may be old, or the product may have been removed.</p>
        <Link to="/shop" className="btn btn--primary">
          Go to the shop
        </Link>
      </div>
    </div>
  );
}
