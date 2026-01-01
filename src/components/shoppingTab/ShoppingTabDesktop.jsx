import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { getProductImageLinks, Button_A } from '../Resuables.jsx';
import { updateCart } from '../../store/shoppingCartSlice.js';
import { DeleteIcon, CartIcon } from '../../styles/Icons';

export default function ShoppingTab({ isOpen, onClose, shoppingCartItemDetails }) {
  const dispatch = useDispatch()

  const shoppingCartItems = useSelector(
    state => state.cart.shoppingCartItems
  )

  const { shoppingCartItemsList, totalCost, totalQuantities } = shoppingCartItemDetails
  const shoppingCartEmpty = shoppingCartItems.length === 0

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 cursor-pointer"
          style={{ opacity: 0.25 }}
          onClick={onClose}
        />
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div
              className="flex justify-between items-center border-b select-none cursor-pointer pl-4"
              onClick={onClose}
            >
              <CartIcon stroke="#000" size={24} />
              <div className="text-lg">SHOPPING CART</div>
              
              <button
                className="text-gray-600 hover:text-black"
                style={{ fontSize: '32px', marginRight: '12px' }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100%-156px)] overflow-y-auto">
              {shoppingCartEmpty ? (
                <div className="text-lg select-none">
                  Your shopping cart is empty.
                </div>
              ) : (
                shoppingCartItemsList.map(product => (
                  <ShoppingCartItemRowDisplay
                    key={product.id}
                    product={product}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t flex flex-col align-center ">
              <div className="p-3 flex flex-row gap-4 justify-between ">  
                <div className="font-semibold select-none text-sm">   
                  {totalQuantities} {totalQuantities === 1 ? "item" : "items"} in cart
                </div>
                <div className="font-semibold select-none text-sm text-right">
                  Total Cost: {totalCost}
                </div>
              </div>
                <Button_A
                  button_name="CHECK OUT"
                  link_val="/"
                  button_type="form"
                />
            </div>
          </>
        )}
      </div>
    </>
  )
}

function ShoppingCartItemRowDisplay({ product }) {
  const dispatch = useDispatch()
  const { heroImgLink } = getProductImageLinks(product)

  const shoppingCartProductQuantity = useSelector(state =>
    state.cart.shoppingCartItems.find(item => item.id === product.id)?.quantity ?? 1
  )

  return (
    <div className="p-4 select-none">
      <div className="flex gap-4 items-start">
        <Link to={`/product/${product.id}`} className="flex-shrink-0 w-28 h-28">
          <img
            src={heroImgLink.pathFile}
            alt={product.name}
            className="w-full h-full object-contain border border-[var(--color-hmc-border-b)]"
          />
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-semibold text-hmc-text-b text-left"
            style={{ lineHeight: 1 }}
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-2 text-base font-bold mt-2">
            <span>{product.price}</span>
            <span className="text-sm font-normal">x</span>

            <input
              type="number"
              min="0"
              step="1"
              value={shoppingCartProductQuantity}
              className="w-16 text-sm border rounded px-1 py-0.5 text-center"
              onChange={e => {
                dispatch(updateCart({ id: product.id, quantity: Number(e.target.value) }))
              }}
            />
          </div>
          {/* <DeleteIcon stroke="oklch(0.1 0.11 178)" /> */}
        </div>
      </div>
    </div>
  )
}
