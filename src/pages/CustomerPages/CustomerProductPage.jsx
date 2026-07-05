import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Button_A, getProductById, PageContainer, ImgPlaceholder, ProductImage, PriceComponent, OptionButton } from '../../components/Resuables'
import { getProductImageLinks, getUpdateCartProduct, getCartItemId } from '../../helpers/dataHelper.js';
import { updateCart, selectProductQuantity } from '../../store/shoppingCartSlice.js';
import ThumbnailCarousel from "../../components/CustomerPageComponents/ThumbnailCarousel.jsx"

function CustomerProductPage() {
  const { product_id } = useParams()

  const products = useSelector(state => state.products.products)
  const product = useMemo(() => getProductById(products, product_id), [products, product_id])

  return (
    <PageContainer>
      <div className={"h-full"}>
        {!product ? (
          <div className="text-gray-500">Product not found.</div>
        ) : (
          <CustomerProductPageMainContainer product={product} />
        )}
      </div>
    </PageContainer>
  )
}

function CustomerProductPageMainContainer({ product }) {
  const shopBlocks = useSelector(state => state.products.shopBlocks);
  return <ShopProductLayout product={product} blocks={shopBlocks} />
}

// Column-layout classes per viewport. The default `responsive` variant keys off
// the real browser viewport (Tailwind `lg:`); `mobile`/`desktop` hard-force the
// breakpoint so the admin preview can simulate a size regardless of window width
// (Tailwind's `lg:` can't respond to a shrunken container, only the viewport).
const SHOP_VIEWPORT_CLASSES = {
  responsive: { grid: "grid-cols-1 lg:grid-cols-12", left: "lg:col-span-9", right: "lg:col-span-3" },
  desktop: { grid: "grid-cols-12", left: "col-span-9", right: "col-span-3" },
  mobile: { grid: "grid-cols-1", left: "", right: "" },
};

// The full shop product page layout (image gallery + product blocks). Reused by
// the customer product page and by the admin shop-layout preview, which passes
// in the blocks it is currently editing plus a forced `viewport`.
export function ShopProductLayout({ product, blocks, viewport = "responsive" }) {
  const cols = SHOP_VIEWPORT_CLASSES[viewport] ?? SHOP_VIEWPORT_CLASSES.responsive;
  return (
    <div className={`grid w-full gap-8 ${cols.grid}`}>
      <LeftColumn product={product} colSpanClass={cols.left} />
      <div className={`${cols.right} flex flex-col justify-between`}>
        <ProductBlocks product={product} blocks={blocks} />
      </div>
    </div>
  )
}
function LeftColumn({ product, colSpanClass = "lg:col-span-9" }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.product_images ?? [];
  const hasPrev = selectedImageIndex > 0;
  const hasNext = selectedImageIndex < images.length - 1;

  return (
  <div className={`${colSpanClass} flex h-[calc(100vh-90px)] min-h-0 flex-col`}>
    <div className="relative min-h-0 flex-1 overflow-hidden border border-hmc-c shadow">
        <ProductImage
        src={images[selectedImageIndex]?.image_url}
        alt={product.name || product.title || "Product Image"}
        bgVar="hero"
        className="h-full w-full object-contain"
      />

      {hasPrev && (
        <button
          onClick={() => setSelectedImageIndex(i => i - 1)}
          className="absolute left-0 top-0 h-full text-hmc-a/60 hover:text-hmc-a leading-none select-none flex items-center justify-center group transition-colors duration-500"
          style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', width: '20%' }}
          aria-label="Previous image"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(to left, transparent, var(--color-hmc-overlay))' }} />
          <span className="relative">‹</span>
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => setSelectedImageIndex(i => i + 1)}
          className="absolute right-0 top-0 h-full text-hmc-a/60 hover:text-hmc-a leading-none select-none flex items-center justify-center group transition-colors duration-500"
          style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', width: '20%' }}
          aria-label="Next image"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, var(--color-hmc-overlay))' }} />
          <span className="relative">›</span>
        </button>
      )}
    </div>

  <div className="shrink-0">
    <ThumbnailCarousel
      imgs={images}
      selectedImageIndex={selectedImageIndex}
      setSelectedImageIndex={setSelectedImageIndex}
      productName={product.name || product.title}
    />
  </div>
</div>
  )
}
function getProductVariant({productVariants, sizeChartId, sizeSelected, metalTypeSelected }){



  return ((productVariants ?? []).find(
    (v) =>
      v.size_chart_id === sizeChartId &&
      v.size_value === String(sizeSelected) &&
      v.metal_type_id === metalTypeSelected
  ));
}

// Maps shop-page blocks onto CSS-grid cells from their grid_row / grid_col.
// Rows collapse to sequential grid lines; within a row each block starts at its
// column and spans to the next block (or the row end), so a lone block fills the
// full width and side-by-side blocks tile across the columns.
function buildBlockGrid(blocks) {
  const visible = (blocks ?? []).filter(b => b.visible !== false);
  if (visible.length === 0) return { colCount: 1, cells: [] };

  const colCount = Math.max(1, ...visible.map(b => (b.grid_col ?? 0) + 1));

  const byRow = new Map();
  for (const b of visible) {
    const r = b.grid_row ?? 999;
    if (!byRow.has(r)) byRow.set(r, []);
    byRow.get(r).push(b);
  }

  const sortedRowKeys = [...byRow.keys()].sort((a, b) => a - b);
  const cells = [];
  sortedRowKeys.forEach((rowKey, rowIndex) => {
    const rowBlocks = byRow.get(rowKey).sort((x, y) => (x.grid_col ?? 0) - (y.grid_col ?? 0));
    rowBlocks.forEach((block, j) => {
      const col = block.grid_col ?? 0;
      const nextCol = j < rowBlocks.length - 1 ? (rowBlocks[j + 1].grid_col ?? 0) : colCount;
      cells.push({
        block,
        rowLine: rowIndex + 1,
        colStart: col + 1,
        colSpan: Math.max(1, nextCol - col),
      });
    });
  });

  return { colCount, cells };
}

// Reads the product-field meta off a block, supporting both the flattened
// shape from get_app_data and the nested admin_product_fields join shape.
function blockFieldMeta(block) {
  return {
    column_name: block.column_name ?? block.admin_product_fields?.column_name,
    input_type: block.input_type ?? block.admin_product_fields?.input_type,
    field_label: block.field_label ?? block.admin_product_fields?.label,
  };
}

// Maps a block's font_size token to a Tailwind text-size class.
export const FONT_SIZE_CLASSES = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

// Renders the shop-page blocks for a product as a CSS grid. Reused by the
// customer product page and by the admin layout preview.
export function ProductBlocks({ product, blocks }) {
  const [metalTypeSelected, setMetalTypeSelected] = useState(0);
  const [sizeSelected, setSizeSelected] = useState(null);
  const [sizeChartId, setSizeChartId] = useState(null);

  const shoppingCartProps = { product, metalTypeSelected, sizeSelected };
  const shoppingCartItems = useSelector(state => state.cart.shoppingCartItems);
  const shoppingCartItemQuantity = shoppingCartItems.find(item => item.id === getCartItemId({ productId: product.id, metalTypeSelected, sizeSelected }))?.quantity || 0;
  const selectedVariant = getProductVariant({ productVariants: product.product_variants, sizeChartId, sizeSelected, metalTypeSelected });
  const stockAvailable = selectedVariant?.stock ?? 0;
  const displayPrice = selectedVariant?.price ?? product.price;

  const { colCount, cells } = useMemo(() => buildBlockGrid(blocks), [blocks]);

  // widget blocks -> interactive components
  function renderWidget(block) {
    const sizeClass = FONT_SIZE_CLASSES[block.font_size];
    const showLabel = block.show_label !== false;
    switch (block.component) {
      case 'metal_selector':
        return (
          <MetalTypeSelectorWidget
            metal_types={product.metal_types}
            metalTypeSelected={metalTypeSelected}
            setMetalTypeSelected={setMetalTypeSelected}
            showLabel={showLabel}
            label={block.label}
            sizeClass={sizeClass}
          />
        );
      case 'size_selector':
        return (
          <SizeChartSelectorWidget
            productSizeChart={product.size_chart}
            sizeSelected={sizeSelected}
            setSizeSelected={setSizeSelected}
            sizeChartId={sizeChartId}
            setSizeChartId={setSizeChartId}
            metalTypeSelected={metalTypeSelected}
            productVariants={product.product_variants}
            showLabel={showLabel}
            label={block.label}
            sizeClass={sizeClass}
          />
        );
      case 'quantity':
        return (
          <QuantityWidget
            shoppingCartItemQuantity={shoppingCartItemQuantity}
            shoppingCartProps={shoppingCartProps}
            stockAvailable={stockAvailable}
            showLabel={showLabel}
            label={block.label}
            sizeClass={sizeClass}
          />
        );
      case 'add_to_cart':
        return (
          <AddToCartButtonWidget
            shoppingCartItemQuantity={shoppingCartItemQuantity}
            shoppingCartProps={shoppingCartProps}
            stockAvailable={stockAvailable}
          />
        );
      case 'buy_controls':
        return (
          <AddToCartWidget
            product={product}
            shoppingCartItemQuantity={shoppingCartItemQuantity}
            shoppingCartProps={shoppingCartProps}
            stockAvailable={stockAvailable}
          />
        );
      case 'stock_status':
        return (
          <span className={`${sizeClass || 'text-xs'} text-hmc-c opacity-60`}>
            {stockAvailable === 0
              ? <span className="text-hmc-error font-semibold opacity-100">Out of stock</span>
              : `${stockAvailable} in stock`}
          </span>
        );
      default:
        return null;
    }
  }

  // product blocks -> a value from the product record
  function renderProduct(block) {
    const sizeClass = FONT_SIZE_CLASSES[block.font_size];
    const { column_name, input_type, field_label } = blockFieldMeta(block);
    if (column_name === 'name') {
      return <h1 className={`${sizeClass || 'text-2xl'} font-bold text-hmc-c`}>{product.name || 'Product'}</h1>;
    }
    if (column_name === 'price') {
      return <p className={`${sizeClass || 'text-md'} font-bold text-hmc-c`}><PriceComponent price={displayPrice} /></p>;
    }
    if (input_type === 'textarea') {
      return <p className={`${sizeClass || 'text-sm'} text-hmc-c`}>{product[column_name] || 'No description available.'}</p>;
    }
    const value = product[column_name];
    if (value == null || value === '') return null;
    return (
      <div className={`${sizeClass || 'text-sm'} text-hmc-c`}>
        {field_label && <span className="mr-2 text-xs uppercase tracking-wide text-hmc-c/70">{field_label}</span>}
        <span>{value}</span>
      </div>
    );
  }

  function renderBlock(block) {
    switch (block.block_type) {
      case 'widget':
        return renderWidget(block);
      case 'user': {
        const sizeClass = FONT_SIZE_CLASSES[block.font_size];
        return <p className={`${sizeClass || 'text-sm'} text-hmc-c`}>{block.content}</p>;
      }
      case 'product':
      default:
        return renderProduct(block);
    }
  }

  // Group cells by row for applying row-level styling
  const cellsByRow = new Map();
  cells.forEach((cell) => {
    const row = cell.rowLine;
    if (!cellsByRow.has(row)) cellsByRow.set(row, []);
    cellsByRow.get(row).push(cell);
  });

  const rowLines = Array.from(cellsByRow.keys()).sort((a, b) => a - b);

  // Map grid_row (1-based) to row styling. Blocks in the same grid_row share styling.
  const rowStylingByGridRow = new Map();
  blocks?.forEach((block) => {
    const gridRow = block.grid_row ?? 1;
    if (!rowStylingByGridRow.has(gridRow)) {
      rowStylingByGridRow.set(gridRow, {
        margin_top: block.margin_top ?? 'mb-0',
        margin_bottom: block.margin_bottom ?? 'mb-0',
        vertical_align: block.vertical_align ?? 'items-start',
        justify_content: block.justify_content ?? 'flex-start',
      });
    }
  });

  return (
    <div className="text-left flex flex-col gap-y-4">
      {rowLines.map((rowLine) => {
        const rowCells = cellsByRow.get(rowLine) ?? [];
        const firstBlock = blocks?.find((b) => rowCells.some((c) => c.block.id === b.id));
        const gridRow = firstBlock?.grid_row ?? 1;
        const styling = rowStylingByGridRow.get(gridRow) ?? {};

        // Map margin class names to Tailwind classes
        const marginTopClass = styling.margin_top === 'mb-0' ? '' : styling.margin_top;
        const marginBottomClass = styling.margin_bottom === 'mb-0' ? '' : styling.margin_bottom;

        // Map vertical alignment class names
        const alignClass = styling.vertical_align === 'items-start' ? '' : styling.vertical_align;

        // Map justify content class names
        const justifyClass = styling.justify_content === 'flex-start' ? '' : styling.justify_content;

        return (
          <div
            key={rowLine}
            className={`grid gap-x-3 text-left ${alignClass} ${justifyClass} ${marginTopClass} ${marginBottomClass}`}
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`, gridRow: rowLine }}
          >
            {rowCells.map(({ block, colStart, colSpan }) => (
              <div
                key={block.id}
                className={`min-w-0 ${FONT_SIZE_CLASSES[block.font_size] ?? ""}`}
                style={{ gridColumn: `${colStart} / span ${colSpan}` }}
              >
                {renderBlock(block)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  )
}

function MetalTypeSelectorWidget({
  metal_types = [],
  metalTypeSelected,
  setMetalTypeSelected,
  showLabel = true,
  label,
  sizeClass,
}) {
  const metal_types_detals = useSelector(state => state.products.productAttributes).metal_types;

  useEffect(() => {
    if (metal_types?.length > 0) {
      setMetalTypeSelected(metal_types[0]);
    }
  }, [metal_types]);

  if (!metal_types?.length)  return null;

  return (
    <div>
      {showLabel && (
        <p className={`mb-2 ${sizeClass || 'text-xs'} text-hmc-c`}>
          {label || 'Metal Type'}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {metal_types.map((metal) => {
          const isSelected = metalTypeSelected === metal;
          const metalDetails = metal_types_detals.find((m) => m.id === metal);
          if(metalDetails === undefined) return null;
          return (
            <div key={metal} onClick={() => setMetalTypeSelected(metal)}>
            <OptionButton
              button_name={metalDetails.label}
              extraClassNames={` ${sizeClass || 'text-xs'}`}
              isActive={isSelected}
            />
            </div>
          );
        })}
      </div>
    </div>
  );
}
function SizeChartSelectorWidget({
  productSizeChart,
  productVariants,
  sizeSelected,
  setSizeSelected,
  sizeChartId,
  setSizeChartId,
  metalTypeSelected,
  showLabel = true,
  label,
  sizeClass,
}) {
  const productSizeChartId = productSizeChart[0];
  const size_charts = useSelector(state => state.products.productAttributes).size_charts;
  const sizeOptions = size_charts.find((s) => s.id === productSizeChartId)?.options || [];

  useEffect(() => {
    if (!sizeOptions?.length) return;
    const current = sizeOptions.find(size => size.value === sizeSelected);
    const currentInStock = current && (getProductVariant({ productVariants, sizeChartId: productSizeChartId, sizeSelected: current.value, metalTypeSelected })?.stock ?? 0) > 0;
    if (!current || !currentInStock) {
      const first = sizeOptions.find(size =>
        (getProductVariant({ productVariants, sizeChartId: productSizeChartId, sizeSelected: size.value, metalTypeSelected })?.stock ?? 0) > 0
      );
      if (first) {
        setSizeSelected(first.value);
        setSizeChartId(productSizeChartId);
      }
    }
  }, [sizeOptions, metalTypeSelected]);
  
  if (!sizeOptions?.length)  return null;

  return (
    <div>
      {showLabel && (
        <p className={`mb-2 ${sizeClass || 'text-xs'} text-hmc-c`}>
          {label || 'Size Chart'}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => {
          const isSelected = sizeSelected === size.value;
          const isDisabled = (getProductVariant({ productVariants, sizeChartId, sizeSelected: size.value, metalTypeSelected })?.stock > 0) ? false : true;
          
          return (
            <div 
              key={size.value} 
              onClick={() => { 
                if(isDisabled) return null; 
                else setSizeSelected(size.value); setSizeChartId(productSizeChartId); 
              }}
            >
              <OptionButton
                button_name={size.label}
                extraClassNames={`${sizeClass || 'text-xs'}`}
                isActive={isSelected}
                isDisabled={isDisabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Standalone quantity input. type="text" + inputMode numeric so no spinner
// arrows ever render. Sets the cart quantity directly.
function QuantityWidget({ shoppingCartItemQuantity, shoppingCartProps, stockAvailable, showLabel = true, label, sizeClass }) {
  const dispatch = useDispatch();
  if (stockAvailable === 0) return null;

  const onQuantityChange = (e) => {
    const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
    const newQuantity = Number.isNaN(v) ? 1 : Math.min(Math.max(1, v), stockAvailable);
    dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity })));
  };

  return (
    <div>
      {showLabel && <p className={`mb-1 ${sizeClass || 'text-xs'} text-hmc-c`}>{label || 'Quantity'}</p>}
      <input
        type="text"
        inputMode="numeric"
        value={shoppingCartItemQuantity}
        onChange={onQuantityChange}
        className={`w-20 rounded border px-2 py-1 text-center outline-none bg-hmc-button-a text-hmc-a font-bold ${sizeClass || 'text-sm'}`}
      />
    </div>
  );
}

// Standalone Add to Cart button.
function AddToCartButtonWidget({ shoppingCartItemQuantity, shoppingCartProps, stockAvailable }) {
  const dispatch = useDispatch();
  if (stockAvailable === 0) {
    return <p className="text-sm font-semibold text-hmc-error">Out of stock</p>;
  }

  const addToCart = () => {
    const newQuantity = Math.min(Math.max(1, shoppingCartItemQuantity), stockAvailable);
    dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity })));
  };

  return (
    <div onClick={addToCart}>
      <Button_A button_name="Add to Cart" />
    </div>
  );
}

function AddToCartWidget({ product, shoppingCartItemQuantity, shoppingCartProps, stockAvailable }) {
  const dispatch = useDispatch();
  const outOfStock = stockAvailable === 0;

  const onQuantityChange = (e) => {
    const v = parseInt(e.target.value, 10);
    const newQuantity = Number.isNaN(v) ? 1 : Math.min(Math.max(1, v), stockAvailable);
    dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity })));
  };

  const increment = () => {
    if (shoppingCartItemQuantity < stockAvailable) {
      dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity: shoppingCartItemQuantity + 1 })));
    }
  };
  const decrement = () => dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity: Math.max(0, shoppingCartItemQuantity - 1) })));

  return (
    <div className="mt-8">
      {!outOfStock && (
        <div className="flex flex-row items-end gap-3">
          <div className="flex items-center border rounded overflow-hidden">
            <button
              type="button"
              onClick={decrement}
              aria-label="Decrease quantity"
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              ←
            </button>

            <input
              type="number"
              min="1"
              max={stockAvailable}
              value={shoppingCartItemQuantity}
              onChange={onQuantityChange}
              className="w-16 text-center px-2 py-1 outline-none bg-hmc-c no-spin max-w-[50px]"
            />

            <button
              type="button"
              onClick={increment}
              aria-label="Increase quantity"
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-3 justify-end" onClick={increment}>
            <Button_A button_name="Add to Cart" button_styles_outer={{ marginTop: '1.5rem' }} />
          </div>
        </div>
      )}
    </div>
  );
}


export default CustomerProductPage
