import { useState, useMemo, useEffect, Fragment } from 'react'
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
  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
      <LeftColumn {...{product}}/>
      <RightColumn {...{ product }}/>
    </div>
  )
}
function LeftColumn({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.product_images;
  const hasPrev = selectedImageIndex > 0;
  const hasNext = selectedImageIndex < images.length - 1;

  return (
  <div className="lg:col-span-9 flex h-[calc(100vh-90px)] min-h-0 flex-col">
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

// Groups shop-page blocks into a 2D layout: rows sorted by grid_row, and within
// each row blocks sorted by grid_col.
function buildBlockRows(blocks) {
  const visible = (blocks ?? []).filter(b => b.visible !== false);
  const byRow = new Map();
  for (const b of visible) {
    const r = b.grid_row ?? 999;
    if (!byRow.has(r)) byRow.set(r, []);
    byRow.get(r).push(b);
  }
  return [...byRow.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([row, items]) => [
      row,
      items.sort((x, y) => (x.grid_col ?? 0) - (y.grid_col ?? 0)),
    ]);
}

function RightColumn({ product }) {
  const [metalTypeSelected, setMetalTypeSelected] = useState(0);
  const [sizeSelected, setSizeSelected] = useState(null);
  const [sizeChartId, setSizeChartId] = useState(null);

  const shopBlocks = useSelector(state => state.products.shopBlocks);

  const shoppingCartProps = { product, metalTypeSelected, sizeSelected };
  const shoppingCartItems = useSelector(state => state.cart.shoppingCartItems);
  const shoppingCartItemQuantity = shoppingCartItems.find(item => item.id === getCartItemId({ productId: product.id, metalTypeSelected, sizeSelected }))?.quantity || 0;
  const selectedVariant = getProductVariant({ productVariants: product.product_variants, sizeChartId, sizeSelected, metalTypeSelected });
  const stockAvailable = selectedVariant?.stock ?? 0;
  const displayPrice = selectedVariant?.price ?? product.price;

  const rows = useMemo(() => buildBlockRows(shopBlocks), [shopBlocks]);

  // widget blocks -> interactive components
  function renderWidget(component) {
    switch (component) {
      case 'metal_selector':
        return (
          <MetalTypeSelectorWidget
            metal_types={product.metal_types}
            metalTypeSelected={metalTypeSelected}
            setMetalTypeSelected={setMetalTypeSelected}
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
          <span className="text-xs text-hmc-c opacity-60">
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
    const { column_name, input_type, field_label } = block;
    if (column_name === 'name') {
      return <h1 className="text-2xl font-bold text-hmc-c">{product.name || 'Product'}</h1>;
    }
    if (column_name === 'price') {
      return <p className="text-md font-bold text-hmc-c"><PriceComponent price={displayPrice} /></p>;
    }
    if (input_type === 'textarea') {
      return <p className="text-sm text-hmc-c">{product[column_name] || 'No description available.'}</p>;
    }
    const value = product[column_name];
    if (value == null || value === '') return null;
    return (
      <div className="text-sm text-hmc-c">
        {field_label && <span className="mr-2 text-xs uppercase tracking-wide text-hmc-c/70">{field_label}</span>}
        <span>{value}</span>
      </div>
    );
  }

  function renderBlock(block) {
    switch (block.block_type) {
      case 'widget':
        return renderWidget(block.component);
      case 'user':
        return <p className="text-sm text-hmc-c">{block.content}</p>;
      case 'product':
      default:
        return renderProduct(block);
    }
  }

  return (
    <div className="text-left lg:col-span-3 flex flex-col gap-4">
      {rows.map(([row, items]) => (
        <div key={row} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          {items.map(block => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

function MetalTypeSelectorWidget({
  metal_types = [],
  metalTypeSelected,
  setMetalTypeSelected
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
      <p className="mb-2 text-xs text-hmc-c">
        Metal Type
      </p>

      <div className="flex flex-wrap gap-2">
        {metal_types.map((metal) => {
          const isSelected = metalTypeSelected === metal;
          const metalDetails = metal_types_detals.find((m) => m.id === metal);
          if(metalDetails === undefined) return null;
          return (
            <div key={metal} onClick={() => setMetalTypeSelected(metal)}>
            <OptionButton  
              button_name={metalDetails.label} 
              extraClassNames={` text-xs`}
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
  metalTypeSelected
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
      <p className="mt-4 mb-1 text-xs text-hmc-c">
        Size Chart
      </p>

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
                extraClassNames={`text-xs`}
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
