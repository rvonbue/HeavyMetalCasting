import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Button_A, getProductById, PageContainer } from '../../components/Resuables'
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

  return (
<div className="lg:col-span-9 flex h-[calc(100vh-90px)] min-h-0 flex-col">
  <div className="min-h-0 flex-1 overflow-hidden rounded border border-hmc-c shadow">
    <img
      src={product.product_images[selectedImageIndex].image_url}
      alt={product.name || product.title || "Product Image"}
      className="h-full w-full object-contain"
    />
  </div>

  <div className="shrink-0">
    <ThumbnailCarousel
      imgs={product.product_images}
      selectedImageIndex={selectedImageIndex}
      setSelectedImageIndex={setSelectedImageIndex}
      productName={product.name || product.title}
    />
  </div>
</div>
  )
}
function RightColumn({ product }) {
  const [metalTypeSelected, setMetalTypeSelected] = useState(0);
  const [sizeSelected, setSizeSelected] = useState(1);

  const shoppingCartProps = { product, metalTypeSelected, sizeSelected }; 
  const shoppingCartItems = useSelector(state => state.cart.shoppingCartItems);  
  const shoppingCartItemQuantity = shoppingCartItems.find(item => item.id === getCartItemId({ productId: product.id, metalTypeSelected, sizeSelected }))?.quantity || 0;
  
  return (
    <div className="text-left lg:col-span-3">
      <h1 className="text-2xl font-bold text-hmc-c">
        {product.name || "Product Page"}
      </h1>

      <p className="mb-4 text-md font-bold text-hmc-c">
        {product.price != null ? product.price : "available upon request"}
      </p>
     <MetalTypeSelectorWidget 
        metal_types={product.metal_types}  
        metalTypeSelected={metalTypeSelected }
        setMetalTypeSelected={setMetalTypeSelected}
      />
     <SizeChartSelectorWidget
        productSizeChart={product.size_chart}
        sizeSelected={sizeSelected}
        setSizeSelected={setSizeSelected}
      />
     <AddToCartWidget
        product={product}
        shoppingCartItemQuantity={shoppingCartItemQuantity}
        shoppingCartProps={shoppingCartProps}
      />
      <p className="mt-4 text-sm text-hmc-c">
        {product.description || product.desc || "No description available."}
      </p>
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
          return (
            <div key={metal} onClick={() => setMetalTypeSelected(metal)}>
            <Button_A  
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
  sizeSelected,
  setSizeSelected
}) {
  const productSizeChartId = productSizeChart[0];
  const size_charts = useSelector(state => state.products.productAttributes).size_charts;
  const sizeOptions = size_charts.find((s) => s.id === productSizeChartId)?.options || [];

  useEffect(() => {
    if (sizeOptions?.length > 0) {
      setSizeSelected(sizeOptions[0].value);
    }
  }, [sizeOptions]);
  
  if (!sizeOptions?.length)  return null;

  return (
    <div>
      <p className="mt-4 mb-1 text-xs text-hmc-c">
        Size Chart
      </p>

      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => {
          const isSelected = sizeSelected === size.value;
          return (
            <div key={size.value} onClick={() => setSizeSelected(size.value)}>
              <Button_A
                button_name={size.label}
                extraClassNames={`text-xs`}
                isActive={isSelected}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
function AddToCartWidget({ product, shoppingCartItemQuantity, shoppingCartProps }) {
    const dispatch = useDispatch()
  const onQuantityChange = (e) => {
    const v = parseInt(e.target.value, 10)
    const newQuantity = Number.isNaN(v) ? 1 : Math.max(1, v)
      dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity })))
  }

  const increment = () => dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity: shoppingCartItemQuantity + 1 })))
  const decrement = () => dispatch(updateCart(getUpdateCartProduct({ ...shoppingCartProps, newQuantity: Math.max(0, shoppingCartItemQuantity - 1) })))

  return (
    <div className="flex flex-row items-end gap-3 mt-8">
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
          value={shoppingCartItemQuantity}
          onChange={onQuantityChange}
          className="w-16 text-center px-2 py-1 outline-none bg-hmc-c no-spin  max-w-[50px]"
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
  )
}


export default CustomerProductPage
