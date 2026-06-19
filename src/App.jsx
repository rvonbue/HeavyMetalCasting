import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from "sonner";
import HeaderNavbar from './components/header/Header'
import ShoppingTab from './components/shoppingTab/ShoppingTab'

import { toggleShoppingCart } from './store/shoppingCartSlice'
import './styles/App.css'
import { useEffect } from 'react'
import { loadAppData } from "./api/apis";

function Root() {
  const dispatch = useDispatch()

  const showShoppingCart = useSelector(state => state.cart.showShoppingCart);
  const { toolbarHeight, themeName, headerTransparent } = useSelector(state => state.app);
  const theme = themeName === "dark" ? "" : "theme-hmc-inverted"

  useEffect(() => {
    loadAppData(dispatch);
  }, []);

  // When headerTransparent, the header is position:fixed (out of flow),
  // so the outlet must fill the full 100vh rather than subtracting toolbar height.
  const outletHeight = headerTransparent
    ? '100vh'
    : `calc(100vh - ${toolbarHeight}px)`;

  return (
    <div id="hmc-theme-root" className={theme}>
      <Toaster position="bottom-right" richColors closeButton />
      <HeaderNavbar />
      <div style={{ height: outletHeight }} className="bg-hmc-bodybackground">
        <Outlet />
        <ShoppingTab
          isOpen={showShoppingCart}
          onClose={() => dispatch(toggleShoppingCart())}
        />
      </div>
    </div>
  )
}

export default Root
