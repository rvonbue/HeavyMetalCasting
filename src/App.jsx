import { Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from "sonner";
import HeaderNavbar from './components/header/Header'
import ShoppingTab from './components/shoppingTab/ShoppingTab'
import SaleBanner from './components/SaleBanner'

import { toggleShoppingCart } from './store/shoppingCartSlice'
import { setUser, logout } from './store/authSlice'
import './styles/App.css'
import { useEffect, useState } from 'react'
import { loadAppData } from "./api/apis";
import { buildThemeOverrideStyle } from "./staticData/themeColors";
import { supabase } from './lib/supabase';
import { getUserById } from './api/authAPI';

function Root() {
  const dispatch = useDispatch()

  const showShoppingCart = useSelector(state => state.cart.showShoppingCart);
  const { toolbarHeight, themeName } = useSelector(state => state.app);
  const settings = useSelector(state => state.settings.settings);
  const theme = themeName === "dark" ? "theme-hmc-dark" : "theme-hmc-light"
  const themeOverrideStyle = buildThemeOverrideStyle(settings);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', session?.user?.id);

        if (session?.user) {
          // User is logged in
          try {
            const userProfile = await getUserById(session.user.id);
            dispatch(setUser({ ...session.user, role: userProfile?.role }));
          } catch (error) {
            console.error('Failed to load user profile:', error);
            dispatch(setUser(session.user));
          }
        } else {
          // User is logged out
          dispatch(logout());
        }
      }
    );

    loadAppData(dispatch);

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  // Off home, the banner sits in flow and pushes content down, so the outlet
  // shrinks by its measured height (header is sticky, taking toolbarHeight).
  // On home the header is fixed and the hero fills the viewport; the banner is
  // fixed just under the header, so the outlet stays a full 100vh.
  const outletStyle = isHome
    ? { height: '100vh', overflow: 'hidden' }
    : { height: `calc(100vh - ${toolbarHeight}px - ${bannerHeight}px)` };

  return (
    <div id="hmc-theme-root" className={theme} style={themeOverrideStyle}>
      <Toaster position="bottom-right" richColors closeButton />
      <HeaderNavbar />
      {!isAdmin && (
        <SaleBanner
          onHeightChange={setBannerHeight}
          fixed={isHome}
          topOffset={toolbarHeight}
        />
      )}
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
