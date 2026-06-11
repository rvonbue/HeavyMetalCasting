import { useSelector } from 'react-redux'

import ShoppingTabMobile from './ShoppingTabMobile.jsx'
import ShoppingTabDesktop from './ShoppingTabDesktop.jsx'
import { getShoppingCartTotals } from '../../helpers/dataHelper.js';

function ShoppingTab({ isOpen, onClose }) {
  const products = useSelector(state => state.products.products)
  const appSizeMode = useSelector(state => state.app.appSizeMode)
  const shoppingCartItems = useSelector(state => state.cart.shoppingCartItems)
    
  const shoppingCartItemDetails = getShoppingCartTotals(shoppingCartItems);

  return (
    <>
      {appSizeMode === 'desktop' ? (
        <ShoppingTabDesktop
          isOpen={isOpen}
          onClose={onClose}
          shoppingCartItemDetails={shoppingCartItemDetails}
        />
      ) : (
        <ShoppingTabMobile
          isOpen={isOpen}
          onClose={onClose}
          shoppingCartItemDetails={shoppingCartItemDetails}
        />
      )}
    </>
  )
}

export default ShoppingTab
