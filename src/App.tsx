import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Header from './components/Header';
import { CartDrawer, MobileMenu, SearchOverlay, Toast } from './components/Overlays';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import { About, Help } from './pages/Info';
import NotFound from './pages/NotFound';
import OrderSuccess from './pages/OrderSuccess';
import ProductPage from './pages/Product';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import { useStore } from './store/StoreContext';

/** Scrolls to the top on navigation, or to the #anchor when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    try {
      window.scrollTo(0, 0);
    } catch {
      /* not available in some test environments */
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { openSearch, closeOverlays } = useStore();
  const location = useLocation();

  // Close any drawer when the route changes.
  useEffect(() => closeOverlays(), [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlays();
      const target = e.target as HTMLElement | null;
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch, closeOverlays]);

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <ScrollManager />
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
      <Toast />
    </>
  );
}
