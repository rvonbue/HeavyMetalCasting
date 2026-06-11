import { useSelector } from 'react-redux'

import HeaderDesktop from './HeaderDesktop.jsx'
import HeaderMobile from './HeaderMobile.jsx'

function Header() {
  const showShoppingCart = useSelector(
    state => state.cart.showShoppingCart
  )

  const shoppingCartItems = useSelector(
    state => state.cart.shoppingCartItems
  )

  const appSizeMode = useSelector(
    state => state.app.appSizeMode
  )

  const {user, hasAdminAccess}  = useSelector(state => state.user);

  const totalItemsInCart = shoppingCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const loggedIn = Boolean(user?.id)

  return (
    <>
      {appSizeMode === 'desktop' ? (
        <HeaderDesktop
          totalItemsInCart={totalItemsInCart}
          showShoppingCart={showShoppingCart}
          user={user}
          hasAdminAccess={hasAdminAccess}
          loggedIn={loggedIn}
        />
      ) : (
        <HeaderMobile
          totalItemsInCart={totalItemsInCart}
          showShoppingCart={showShoppingCart}
          user={user}
          loggedIn={loggedIn}
          hasAdminAccess={hasAdminAccess}
        />
      )}
    </>
  )
}

export default Header
