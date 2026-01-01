import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Button_A, getProductById, PageContainer } from "../../components/Resuables";
import { useAppState, useAppDispatch  } from '../../AppState'; // useAppDispatch
import { getProductImageLinks } from "../../components/Resuables.jsx";
import { updateCartAction, getShoppingCartProductQuantity } from "../../actions/shoppingCartActions.jsx";

function CustomerProductPage({ }) {
  const { product_id } = useParams();
  const { products } = useAppState();
  const product = getProductById(products, product_id);
  
  return (
     <PageContainer>
          <div>
            {!product ? (
              <div className="text-gray-500">Product not found.</div>
            ) : <ProductPage product={product} />}
            </div>
      </PageContainer>
  )
}

function increment({ dispatch, product, quantity }) {
  let newQuantity = Math.max(1, quantity + 1)
  updateCartAction({ dispatch, product, newQuantity });
}

function decrement({ dispatch, product, quantity }) {
  let newQuantity = Math.max(0, quantity - 1)
  updateCartAction({ dispatch, product, newQuantity });
}

function ProductPage({ product }) {
  const { heroImgLink, imgs } = getProductImageLinks(product);
  const dispatch = useAppDispatch(); 
  const { shoppingCartItems }  = useAppState()
  const shoppingCartProductQuantity = getShoppingCartProductQuantity({ shoppingCartItems, productId: product.id });

  const onQuantityChange = (e) => {
    const v = parseInt(e.target.value, 10);
    let newQuantity = Number.isNaN(v) ? 1 : Math.max(1, v);
    updateCartAction({ dispatch, product, newQuantity });
  };

  const [selectedImage, setSelectedImage] = useState(
    heroImgLink && heroImgLink.pathFile
      ? heroImgLink.pathFile
      : (imgs && imgs.length ? imgs[0].pathFile : '')
  );

  return (  
      <>
        <style>{`
          /* Hide number input spinners (WebKit) */
          input[type=number].no-spin::-webkit-outer-spin-button,
          input[type=number].no-spin::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          /* Hide number input spinners (Firefox) */
          input[type=number].no-spin {
            -moz-appearance: textfield;
          }
        `}</style>

        <h1 className="text-2xl font-bold text-hmc-c">{product && product.name ? product.name : 'Product Page'}</h1>
        <div className="flex justify-between items-center mb-6"></div>
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <img
              src={selectedImage || (heroImgLink && heroImgLink.pathFile)}
              alt={product.name || product.title || 'Product Image'}
              className="rounded shadow max-h-100 max-w-100 object-contain w-full" /* max-h-100 max-w-100 object-contain w-full */
            />
            <ThumbnailCarousel
              imgs={imgs}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              productName={product.name || product.title}
            />    
          </div>  

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-hmc-c">{product.name || product.title || 'Untitled product'}</h2>

            {product.price != null && (
              <p className="text-hmc-c font-bold text-lg mb-4 text-hmc-c">${product.price}</p>
            )}
            <p className="text-sm text-hmc-c mb-4">
              {product.description || product.desc || 'No description available.'}
            </p>
            <AddToCartWidget
              dispatch={dispatch}
              product={product}
              shoppingCartProductQuantity={shoppingCartProductQuantity}
              onQuantityChange={onQuantityChange}
            />
            <ul className="text-sm text-gray-600 space-y-1">
              {product.sku && (
                <li>
                  <strong>SKU:</strong> {product.sku}
                </li>
              )}
              {product.material && (
                <li>
                  <strong>Material:</strong> {product.material}
                </li>
              )}
            </ul>
          </div>
        </div>
      </>
  )
}

function AddToCartWidget({ dispatch, product, shoppingCartProductQuantity, onQuantityChange }) {


  return ( 
    <div className="flex flex-col items-end gap-3 mb-4">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            type="button"
            onClick={() => decrement({ dispatch, product, quantity: shoppingCartProductQuantity })}
            aria-label="Decrease quantity"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            ←
          </button>
          <input
            type="number"
            min="1"
            value={shoppingCartProductQuantity}
            onChange={onQuantityChange}
            className="w-16 text-center px-2 py-1 outline-none bg-hmc-c no-spin"
          />
          <button
            type="button"
            onClick={() => increment({ dispatch, product, quantity: shoppingCartProductQuantity })}
            aria-label="Increase quantity"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-3 justify-end" 
          onClick={() => increment({ dispatch, product, quantity: shoppingCartProductQuantity })}
        >
          <Button_A
            button_name="Add to Cart"
            button_styles_outer={{ marginTop: "1.5rem" }}
          />
        </div>
      </div>  )
}
function ThumbnailCarousel({ imgs, selectedImage, setSelectedImage, productName }) {

  return (
      <div className="mt-3">
        <div className="flex gap-2 overflow-x-auto py-1 justify-center">
          {(imgs || []).map((thumb, idx) => {
            const src = thumb && thumb.pathFile ? thumb.pathFile : '';
            const isActive = src === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(src)}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedImage(src); }}
                className={`flex-none rounded overflow-hidden border ${isActive ? 'ring-2 ring-hmc-b' : 'border-gray-200'} focus:outline-none ml-2 cursor-pointer`}
                aria-pressed={isActive}
              >
                <img
                  src={src}
                  alt={`${productName || 'product'} thumbnail ${idx + 1}`}
                  className="h-16 w-16 object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
  )
}

export default CustomerProductPage;
