import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Button_A, getProductById, PageContainer } from '../../components/Resuables'
import { getProductImageLinks } from '../../components/Resuables.jsx'
import { updateCart, selectProductQuantity } from '../../store/shoppingCartSlice.js';

function CustomerProductPage() {
  const { product_id } = useParams()

  const products = useSelector(state => state.products.products)
  const product = useMemo(() => getProductById(products, product_id), [products, product_id])

  return (
    <PageContainer>
      <div>
        {!product ? (
          <div className="text-gray-500">Product not found.</div>
        ) : (
          <ProductPage product={product} />
        )}
      </div>
    </PageContainer>
  )
}

function ProductPage({ product }) {
  const dispatch = useDispatch()
  const { heroImgLink, imgs } = getProductImageLinks(product)

  const shoppingCartProductQuantity = useSelector(state =>
    selectProductQuantity(state, product.id)
  )

  const [selectedImage, setSelectedImage] = useState(
    heroImgLink?.pathFile || (imgs && imgs.length ? imgs[0].pathFile : '')
  )

  const onQuantityChange = (e) => {
    const v = parseInt(e.target.value, 10)
    const newQuantity = Number.isNaN(v) ? 1 : Math.max(1, v)
    dispatch(updateCart({ id: product.id, quantity: newQuantity }))
  }

  const increment = () => dispatch(updateCart({ id: product.id, quantity: shoppingCartProductQuantity + 1 }))
  const decrement = () => dispatch(updateCart({ id: product.id, quantity: Math.max(0, shoppingCartProductQuantity - 1) }))

  return (
    <>
      

      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <img
            src={selectedImage}
            alt={product.name || product.title || 'Product Image'}
            className="rounded shadow max-h-100 max-w-100 object-contain w-full"
          />
          <ThumbnailCarousel
            imgs={imgs}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            productName={product.name || product.title}
          />
        </div>

        <div className="md:col-span-2 text-left">
          <h1 className="text-2xl font-bold text-hmc-c">
            {product.name || 'Product Page'}
            {product.price != null && ( <p className="text-hmc-c font-bold text-lg mb-4">${product.price}</p> )}
          </h1>
          <p className="text-sm text-hmc-c mb-4">{product.description || product.desc || 'No description available.'}</p>

          <AddToCartWidget
            product={product}
            quantity={shoppingCartProductQuantity}
            onQuantityChange={onQuantityChange}
            increment={increment}
            decrement={decrement}
          />

          <ul className="text-sm text-gray-600 space-y-1">
            {product.sku && <li><strong>SKU:</strong> {product.sku}</li>}
            {product.material && <li><strong>Material:</strong> {product.material}</li>}
          </ul>
        </div>
      </div>
    </>
  )
}

function AddToCartWidget({ product, quantity, onQuantityChange, increment, decrement }) {
  return (
    <div className="flex flex-col items-end gap-3 mb-4">
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
          value={quantity}
          onChange={onQuantityChange}
          className="w-16 text-center px-2 py-1 outline-none bg-hmc-c no-spin"
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

function ThumbnailCarousel({ imgs, selectedImage, setSelectedImage, productName }) {
  return (
    <div className="mt-3">
      <div className="flex gap-2 overflow-x-auto py-1 justify-center">
        {(imgs || []).map((thumb, idx) => {
          const src = thumb?.pathFile || ''
          const isActive = src === selectedImage
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(src)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedImage(src) }}
              className={`flex-none rounded overflow-hidden border ${isActive ? 'ring-2 ring-hmc-b' : 'border-gray-200'} focus:outline-none ml-2 cursor-pointer`}
              aria-pressed={isActive}
            >
              <img src={src} alt={`${productName || 'product'} thumbnail ${idx + 1}`} className="h-16 w-16 object-cover" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerProductPage
