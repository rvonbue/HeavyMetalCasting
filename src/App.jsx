import { Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from "sonner";
import HeaderNavbar from './components/header/Header'
import ShoppingTab from './components/shoppingTab/ShoppingTab'
import SaleBanner from './components/SaleBanner'

import { toggleShoppingCart } from './store/shoppingCartSlice'
import './styles/App.css'
import { useEffect } from 'react'
import { loadAppData } from "./api/apis";

function Root() {
  const dispatch = useDispatch()

  const showShoppingCart = useSelector(state => state.cart.showShoppingCart);
  const { toolbarHeight, themeName } = useSelector(state => state.app);
  const theme = themeName === "dark" ? "" : "theme-hmc-inverted"
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    loadAppData(dispatch);
  }, []);

  // On home, header is position:fixed (out of flow) so outlet fills full 100vh.
  // overflow:hidden forces scrolling to happen inside #home-scroll-container.
  const outletStyle = isHome
    ? { height: '100vh', overflow: 'hidden' }
    : { height: `calc(100vh - ${toolbarHeight}px)` };

  return (
    <div id="hmc-theme-root" className={theme}>
      <Toaster position="bottom-right" richColors closeButton />
      <HeaderNavbar />
      <SaleBanner />
      <div style={outletStyle} className="bg-hmc-bodybackground">
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
