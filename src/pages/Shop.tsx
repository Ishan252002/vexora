import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { categories, categoryBySlug, isCategory } from '../data/categories';
import { countInCategory, products } from '../data/products';
import {
  filterProducts,
  isSort,
  isTag,
  priceBands,
  sortOptions,
  sortProducts,
  tagLabels,
} from '../lib/catalog';
import { plural } from '../lib/format';
import { useTitle } from '../lib/hooks';
import type { Tag } from '../data/products';

const tagOrder: Tag[] = ['new', 'bestseller', 'trending', 'deal'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const rawCategory = params.get('category');
  const category = isCategory(rawCategory) ? rawCategory : null;
  const rawTag = params.get('tag');
  const tag = isTag(rawTag) ? rawTag : null;
  const query = (params.get('q') ?? '').trim();
  const rawSort = params.get('sort');
  const sort = isSort(rawSort) ? rawSort : 'featured';
  const bands = (params.get('price') ?? '').split(',').filter(Boolean);

  const results = sortProducts(filterProducts(products, { category, tag, query, bands }), sort);

  const title = query
    ? `Results for "${query}"`
    : category
      ? categoryBySlug.get(category)!.name
      : tag
        ? tagLabels[tag]
        : 'All products';
  useTitle(title);

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const toggleBand = (id: string) => {
    const next = bands.includes(id) ? bands.filter((b) => b !== id) : [...bands, id];
    update({ price: next.join(',') || null });
  };

  const activeChips: { label: string; clear: () => void }[] = [
    ...(category ? [{ label: categoryBySlug.get(category)!.short, clear: () => update({ category: null }) }] : []),
    ...(tag ? [{ label: tagLabels[tag], clear: () => update({ tag: null }) }] : []),
    ...(query ? [{ label: `"${query}"`, clear: () => update({ q: null }) }] : []),
    ...priceBands
      .filter((b) => bands.includes(b.id))
      .map((b) => ({ label: b.label, clear: () => toggleBand(b.id) })),
  ];

  const clearAll = () => setParams(sort === 'featured' ? {} : { sort }, { replace: true });

  return (
    <div className="container page shop">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <Icon name="chevron-right" size={14} />
        {category || tag || query ? <Link to="/shop">Shop</Link> : <span aria-current="page">Shop</span>}
        {(category || tag || query) && (
          <>
            <Icon name="chevron-right" size={14} />
            <span aria-current="page">{title}</span>
          </>
        )}
      </nav>

      <header className="shop__head">
        <div>
          <h1>{title}</h1>
          <p>
            {category
              ? categoryBySlug.get(category)!.blurb
              : 'Gadgets, home, fashion, beauty, fitness and travel. Prices include taxes.'}
          </p>
        </div>
      </header>

      <div className="shop__layout">
        <aside className={`filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Filters">
          <div className="filters__head">
            <h2>Filters</h2>
            <button type="button" className="iconbtn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <Icon name="x" />
            </button>
          </div>

          <fieldset className="filters__group">
            <legend>Category</legend>
            <ul>
              <li>
                <button
                  type="button"
                  className={`filters__opt ${!category ? 'is-active' : ''}`}
                  aria-pressed={!category}
                  onClick={() => update({ category: null })}
                >
                  <span>All categories</span>
                  <small>{products.length}</small>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    className={`filters__opt ${category === c.slug ? 'is-active' : ''}`}
                    aria-pressed={category === c.slug}
                    onClick={() => update({ category: c.slug })}
                    data-category={c.slug}
                  >
                    <span>{c.name}</span>
                    <small>{countInCategory(c.slug)}</small>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="filters__group">
            <legend>Price</legend>
            <ul>
              {priceBands.map((b) => (
                <li key={b.id}>
                  <label className="check">
                    <input
                      type="checkbox"
                      id={`price-${b.id}`}
                      checked={bands.includes(b.id)}
                      onChange={() => toggleBand(b.id)}
                    />
                    <span>{b.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="filters__group">
            <legend>Collection</legend>
            <div className="chips">
              {tagOrder.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`chip ${tag === t ? 'is-active' : ''}`}
                  aria-pressed={tag === t}
                  onClick={() => update({ tag: tag === t ? null : t })}
                >
                  {tagLabels[t]}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" className="btn btn--primary btn--block filters__apply" onClick={() => setFiltersOpen(false)}>
            Show {plural(results.length, 'product')}
          </button>
        </aside>
        {filtersOpen && <div className="filters__scrim" onClick={() => setFiltersOpen(false)} />}

        <div className="shop__main">
          <div className="toolbar">
            <button type="button" className="btn btn--ghost btn--sm toolbar__filter" onClick={() => setFiltersOpen(true)}>
              <Icon name="sliders" size={16} />
              Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ''}
            </button>
            <p className="toolbar__count" role="status" data-testid="result-count">
              {plural(results.length, 'product')}
            </p>
            <label className="toolbar__sort" htmlFor="sort">
              <span>Sort by</span>
              <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}>
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="active">
              {activeChips.map((c) => (
                <button type="button" key={c.label} className="chip chip--removable" onClick={c.clear}>
                  {c.label}
                  <Icon name="x" size={13} />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button type="button" className="textbtn" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="empty">
              <h2>No products match these filters.</h2>
              <p>Remove a filter or search with a shorter word.</p>
              <button type="button" className="btn btn--primary" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="pgrid pgrid--3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 28vw" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
