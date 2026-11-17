import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { productById, type Product } from '../data/products';
import {
  cartTotals,
  MAX_QTY,
  normalisePromo,
  PROMOS,
  type Delivery,
  type Totals,
} from '../lib/pricing';

export interface CartLine {
  id: string;
  qty: number;
}

export interface DetailedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface Order {
  id: string;
  placedAt: string;
  lines: { id: string; name: string; qty: number; price: number }[];
  totals: Totals;
  customer: Customer;
  delivery: Delivery;
  payment: PaymentMethod;
}

interface State {
  cart: CartLine[];
  wishlist: string[];
  promo: string | null;
}

type Action =
  | { type: 'add'; id: string; qty: number }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'toggleWish'; id: string }
  | { type: 'promo'; code: string | null };

const STORAGE_KEY = 'vexora:v1';
const ORDERS_KEY = 'vexora:orders';
const EMPTY: State = { cart: [], wishlist: [], promo: null };

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n)));

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<State>;
    const cart = Array.isArray(parsed.cart)
      ? parsed.cart
          .filter((l) => l && productById.has(l.id) && Number.isFinite(l.qty) && l.qty > 0)
          .map((l) => ({ id: l.id, qty: clampQty(l.qty) }))
      : [];
    const wishlist = Array.isArray(parsed.wishlist)
      ? parsed.wishlist.filter((id) => typeof id === 'string' && productById.has(id))
      : [];
    const promo = typeof parsed.promo === 'string' && PROMOS[parsed.promo] ? parsed.promo : null;
    return { cart, wishlist, promo };
  } catch {
    return EMPTY;
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      if (!productById.has(action.id)) return state;
      const existing = state.cart.find((l) => l.id === action.id);
      const cart = existing
        ? state.cart.map((l) =>
            l.id === action.id ? { ...l, qty: clampQty(l.qty + action.qty) } : l,
          )
        : [...state.cart, { id: action.id, qty: clampQty(action.qty) }];
      return { ...state, cart };
    }
    case 'setQty':
      return {
        ...state,
        cart: state.cart.map((l) => (l.id === action.id ? { ...l, qty: clampQty(action.qty) } : l)),
      };
    case 'remove':
      return { ...state, cart: state.cart.filter((l) => l.id !== action.id) };
    case 'clear':
      return { ...state, cart: [], promo: null };
    case 'toggleWish':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case 'promo':
      return { ...state, promo: action.code };
    default:
      return state;
  }
}

export function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface Store {
  lines: DetailedLine[];
  cartCount: number;
  wishlist: string[];
  promo: string | null;
  totals: Totals;
  totalsFor: (delivery: Delivery) => Totals;
  addToCart: (id: string, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  placeOrder: (customer: Customer, delivery: Delivery, payment: PaymentMethod) => Order;
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  openCart: () => void;
  openSearch: () => void;
  openMenu: () => void;
  closeOverlays: () => void;
  toast: { id: number; text: string } | null;
  notify: (text: string) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [overlay, setOverlay] = useState<'cart' | 'search' | 'menu' | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Storage can be unavailable (private mode). The store still works for this visit. */
    }
  }, [state]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', overlay !== null);
    return () => document.body.classList.remove('is-locked');
  }, [overlay]);

  const notify = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const lines = useMemo<DetailedLine[]>(
    () =>
      state.cart.flatMap((l) => {
        const product = productById.get(l.id);
        return product ? [{ ...l, product, lineTotal: product.price * l.qty }] : [];
      }),
    [state.cart],
  );

  const priced = useMemo(
    () => lines.map((l) => ({ price: l.product.price, mrp: l.product.mrp, qty: l.qty })),
    [lines],
  );

  const totals = useMemo(() => cartTotals(priced, state.promo, 'standard'), [priced, state.promo]);

  const value = useMemo<Store>(() => {
    const closeOverlays = () => setOverlay(null);
    return {
      lines,
      cartCount: totals.itemCount,
      wishlist: state.wishlist,
      promo: state.promo,
      totals,
      totalsFor: (delivery) => cartTotals(priced, state.promo, delivery),
      addToCart: (id, qty = 1, opts) => {
        dispatch({ type: 'add', id, qty });
        if (!opts?.silent) setOverlay('cart');
      },
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      removeLine: (id) => dispatch({ type: 'remove', id }),
      toggleWish: (id) => {
        const wished = state.wishlist.includes(id);
        dispatch({ type: 'toggleWish', id });
        notify(wished ? 'Removed from wishlist' : 'Saved to wishlist');
      },
      isWished: (id) => state.wishlist.includes(id),
      applyPromo: (code) => {
        const clean = normalisePromo(code);
        if (!PROMOS[clean]) return false;
        dispatch({ type: 'promo', code: clean });
        return true;
      },
      removePromo: () => dispatch({ type: 'promo', code: null }),
      placeOrder: (customer, delivery, payment) => {
        const order: Order = {
          id: `VX-${String(Date.now()).slice(-6)}`,
          placedAt: new Date().toISOString(),
          lines: lines.map((l) => ({
            id: l.id,
            name: l.product.name,
            qty: l.qty,
            price: l.product.price,
          })),
          totals: cartTotals(priced, state.promo, delivery),
          customer,
          delivery,
          payment,
        };
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...readOrders()].slice(0, 5)));
        } catch {
          /* ignore */
        }
        dispatch({ type: 'clear' });
        return order;
      },
      cartOpen: overlay === 'cart',
      searchOpen: overlay === 'search',
      menuOpen: overlay === 'menu',
      openCart: () => setOverlay('cart'),
      openSearch: () => setOverlay('search'),
      openMenu: () => setOverlay('menu'),
      closeOverlays,
      toast,
      notify,
    };
  }, [lines, totals, priced, state.wishlist, state.promo, overlay, toast, notify]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
