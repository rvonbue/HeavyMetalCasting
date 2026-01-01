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

  const user = useSelector(
    state => state.app.user
  )

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
          loggedIn={loggedIn}
        />
      ) : (
        <HeaderMobile
          totalItemsInCart={totalItemsInCart}
          showShoppingCart={showShoppingCart}
          user={user}
          loggedIn={loggedIn}
        />
      )}
    </>
  )
}

export default Header
