import { useState, useMemo } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { PageContainer } from '../../components/Resuables'
import ProductCard from '../../components/CustomerPageComponents/ProductCard.jsx'
import { ShopPathName } from '../../staticData/PathData.js'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Relevant' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'price_low', label: 'Price: Low to High' },
];

const filterHeaderClass =
  "text-1xl font-bold text-hmc-c uppercase flex justify-between items-center cursor-pointer select-none border-b-2 border-hmc-border-a mb-4";

function ShopPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const selectedCategoriesByRoute = category ? category.split("_") : [];

  const shopProducts = useSelector(state => state.products.shopProducts);
  const product_categories = useSelector(state => state.products.productAttributes.product_categories);
  const metal_types = useSelector(state => state.products.productAttributes.metal_types);

  const selectedCategoryId = useMemo(() => {
    if (!category) return undefined;
    return product_categories.find(
      c => c.label.toLowerCase() === category.toLowerCase()
    )?.id;
  }, [category, product_categories]);

  // Price bounds across live products.
  const priceBounds = useMemo(() => {
    const prices = shopProducts.filter(p => p.live).map(p => Number(p.price) || 0);
    if (!prices.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [shopProducts]);

  const [search, setSearch] = useState('');
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [sortBy, setSortBy] = useState('relevant');
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [columns, setColumns] = useState(2);

  const effMin = priceMin ?? priceBounds.min;
  const effMax = priceMax ?? priceBounds.max;

  const products = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = shopProducts.filter((prd) => {
      if (prd.live !== true) return false;
      if (selectedCategoryId && !(prd.product_categories ?? []).some(id => id === selectedCategoryId)) return false;
      if (q) {
        const hay = `${prd.name ?? ''} ${prd.description ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const price = Number(prd.price) || 0;
      if (price < effMin || price > effMax) return false;
      if (selectedMetals.length && !(prd.metal_types ?? []).some(id => selectedMetals.includes(id))) return false;
      return true;
    });

    const byPrice = (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0);
    const byDate = (a, b) =>
      (new Date(a.created_at || 0) - new Date(b.created_at || 0)) || (a.id - b.id);

    switch (sortBy) {
      case 'price_low': return [...list].sort(byPrice);
      case 'price_high': return [...list].sort((a, b) => byPrice(b, a));
      case 'newest': return [...list].sort((a, b) => byDate(b, a));
      case 'oldest': return [...list].sort(byDate);
      default: return list; // relevant = natural order
    }
  }, [shopProducts, selectedCategoryId, search, effMin, effMax, selectedMetals, sortBy]);

  function toggleMetal(id) {
    setSelectedMetals((prev) =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  function clearAllFilters() {
    setSearch('');
    setSelectedMetals([]);
    setPriceMin(null);
    setPriceMax(null);
    setSortBy('relevant');
    if (category) navigate(`/${ShopPathName}`);
  }

  return (
    <PageContainer>
      {/* Top toolbar: sort + layout dots */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <div className="hidden sm:flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-hmc-border-b bg-hmc-panelbackground px-2 py-2 text-sm text-hmc-c focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <LayoutDots columns={columns} setColumns={setColumns} />
        </div>
      </div>

      <div className="flex items-start gap-8">
        <div className="hidden sm:flex w-56 shrink-0 flex-col self-start sticky top-2 max-h-[calc(100vh-140px)] overflow-y-auto">
          <SidePanel
            search={search}
            setSearch={setSearch}
            selectedCategoriesByRoute={selectedCategoriesByRoute}
            product_categories={product_categories}
            metal_types={metal_types}
            selectedMetals={selectedMetals}
            toggleMetal={toggleMetal}
            priceBounds={priceBounds}
            priceMin={effMin}
            priceMax={effMax}
            setPriceMin={setPriceMin}
            setPriceMax={setPriceMax}
            onClearAll={clearAllFilters}
          />
        </div>

        <ProductsGrid products={products} columns={columns} />
      </div>
    </PageContainer>
  )
}

function LayoutDots({ columns, setColumns }) {
  return (
    <div className="flex gap-3 items-center">
      {[2, 4].map(n => (
        <button key={n} onClick={() => setColumns(n)} className="flex gap-1.5 items-center p-1">
          {Array.from({ length: n }).map((_, i) => (
            <span
              key={i}
              className={`block w-3 h-3 rounded-full border border-[#b08d57] transition-colors ${columns === n ? 'bg-[#b08d57]' : 'bg-transparent'}`}
            />
          ))}
        </button>
      ))}
    </div>
  );
}

function SidePanel({
  search,
  setSearch,
  selectedCategoriesByRoute,
  product_categories,
  metal_types,
  selectedMetals,
  toggleMetal,
  priceBounds,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  onClearAll,
}) {
  const [openState, setOpenState] = useState({ categoriesOpen: true, metalsOpen: true, priceOpen: true });

  return (
    <div className="flex flex-col text-left">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products…"
        className="mb-4 w-full rounded border border-hmc-border-b bg-hmc-panelbackground px-3 py-2 text-sm text-hmc-c focus:border-hmc-c focus:outline-none"
      />

      <SidepanelList
        headerName={"Categories"}
        sidePanelState={openState}
        setSidePanelState={setOpenState}
        displayData={product_categories}
        selectedCategoriesByRoute={selectedCategoriesByRoute}
      />

      <MetalTypesFilter
        metal_types={metal_types}
        selectedMetals={selectedMetals}
        toggleMetal={toggleMetal}
        open={openState.metalsOpen}
        setOpen={() => setOpenState(o => ({ ...o, metalsOpen: !o.metalsOpen }))}
      />

      <PriceRangeFilter
        bounds={priceBounds}
        minVal={priceMin}
        maxVal={priceMax}
        setMin={setPriceMin}
        setMax={setPriceMax}
        open={openState.priceOpen}
        setOpen={() => setOpenState(o => ({ ...o, priceOpen: !o.priceOpen }))}
      />

      <button
        type="button"
        onClick={onClearAll}
        className="mt-4 w-full rounded border border-hmc-border-a px-3 py-2 text-xs font-bold uppercase tracking-wide text-hmc-c hover:bg-hmc-button-a/20"
      >
        Clear all filters
      </button>
    </div>
  );
}

function MetalTypesFilter({ metal_types, selectedMetals, toggleMetal, open, setOpen }) {
  if (!metal_types?.length) return null;
  return (
    <div className="text-left mb-4">
      <h1 className={filterHeaderClass} onClick={setOpen}>
        <div>Metal Types</div>
        <div className="text-3xl">{open ? "-" : "+"}</div>
      </h1>
      {open && (
        <div className="flex flex-col">
          {metal_types.map((mt) => (
            <div
              key={mt.id}
              onClick={() => toggleMetal(mt.id)}
              className={
                (selectedMetals.includes(mt.id) ? "text-hmc-link-active" : "text-hmc-link") +
                " text-1xl ml-2 cursor-pointer font-semibold select-none"
              }
            >
              {mt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PriceRangeFilter({ bounds, minVal, maxVal, setMin, setMax, open, setOpen }) {
  if (bounds.max <= bounds.min) return null;
  return (
    <div className="text-left mb-2">
      <h1 className={filterHeaderClass} onClick={setOpen}>
        <div>Price</div>
        <div className="text-3xl">{open ? "-" : "+"}</div>
      </h1>
      {open && (
        <div>
          <div className="flex justify-between text-xs text-hmc-c mb-2">
            <span>${minVal}</span>
            <span>${maxVal}</span>
          </div>
          <div className="relative h-5">
            {/* track */}
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-hmc-border-b" />
            {/* selected range */}
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-hmc-b"
              style={{
                left: `${((minVal - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                right: `${100 - ((maxVal - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={minVal}
              onChange={(e) => setMin(Math.min(Number(e.target.value), maxVal))}
              className="dual-range absolute left-0 top-0 w-full"
              style={{ zIndex: minVal >= bounds.max ? 5 : 3 }}
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={maxVal}
              onChange={(e) => setMax(Math.max(Number(e.target.value), minVal))}
              className="dual-range absolute left-0 top-0 w-full"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function SidepanelList({ headerName, sidePanelState, setSidePanelState, displayData, selectedCategoriesByRoute }) {
  return (
    <div className="text-left">
      <h1
        className={filterHeaderClass}
        onClick={() => setSidePanelState((old) => ({ ...old, categoriesOpen: !old.categoriesOpen }))}
      >
        <div>{headerName}</div>
        <div className="text-3xl">{sidePanelState.categoriesOpen ? "-" : "+"}</div>
      </h1>
      {sidePanelState.categoriesOpen && (
        <div className="flex flex-col">
          <NavLink
            to={`/${ShopPathName}`}
            end
            className={({ isActive }) =>
              (isActive ? "text-hmc-link-active" : "text-hmc-link") +
              " text-1xl ml-2 cursor-pointer font-semibold select-none"
            }
          >
            All
          </NavLink>
          {displayData.map((displayObject) => {
            const toValue = `/${ShopPathName}/${displayObject.label}`;
            return (
              <NavLink
                key={displayObject.id + displayObject.label}
                to={toValue}
                end
                className={({ isActive }) =>
                  (isActive ? "text-hmc-link-active" : "text-hmc-link") +
                  " text-1xl ml-2 cursor-pointer font-semibold select-none"
                }
              >
                {displayObject.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductsGrid({ products, columns }) {
  return (
    <div className="text-left flex-1 min-w-0">
      <div className={columns === 4 ? 'grid grid-cols-1 sm:grid-cols-4 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ShopPage
