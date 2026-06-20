import { useSelector } from 'react-redux'
import ShoppingTabDesktop from './ShoppingTabDesktop.jsx'
import { getShoppingCartTotals } from '../../helpers/dataHelper.js';

function ShoppingTab({ isOpen, onClose }) {
  const shoppingCartItems = useSelector(state => state.cart.shoppingCartItems)
  const shoppingCartItemDetails = getShoppingCartTotals(shoppingCartItems);

  return (
    <ShoppingTabDesktop
      isOpen={isOpen}
      onClose={onClose}
      shoppingCartItemDetails={shoppingCartItemDetails}
    />
  )
}

export default ShoppingTab
