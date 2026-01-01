import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import HeaderNavbar from './components/header/Header'
import ShoppingTab from './components/shoppingTab/ShoppingTab'

import { toggleShoppingCart } from './store/shoppingCartSlice'
import './styles/App.css'

function Root() {
  const dispatch = useDispatch()

  const showShoppingCart = useSelector(state => state.cart.showShoppingCart);
  const toolbarHeight = useSelector(state => state.app.toolbarHeight);

  return (
    <>
      <HeaderNavbar />
      <div style={{ height: `calc(100vh - ${toolbarHeight}px)` }}>
        <Outlet />

        <ShoppingTab
          isOpen={showShoppingCart}
          onClose={() => dispatch(toggleShoppingCart())}
        />
      </div>
    </>
  )
}

export default Root
