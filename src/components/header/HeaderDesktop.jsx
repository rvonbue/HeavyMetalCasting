import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import { CartIcon, SkullIcon } from '../../styles/Icons.jsx'
import { UserCircle } from 'lucide-react'
import { activeBorder, inactiveBorder } from '../../styles/App.jsx'
import { toggleShoppingCart } from '../../store/shoppingCartSlice'

import AdminDropDownMenu from "../../components/AdminPageComponents/AdminDropDownMenu.jsx"

export default function HeaderDesktop({
  totalItemsInCart,
  showShoppingCart,
  user,
  loggedIn,
  hasAdminAccess
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toolbarHeight = useSelector(state => state.app.toolbarHeight);
  const headerTransparent = useSelector(state => state.app.headerTransparent);
  const settings = useSelector(state => state.settings.settings);
  const authUser = useSelector(state => state.auth.user);
  const siteInitials = settings.site_initials || 'HMC';
  const showLogo = settings.logo_show_in_navbar === 'true' && settings.logo_url;
  const userIconUrl = settings.user_icon_url;
  const shoppingCartIconUrl = settings.shopping_cart_icon_url;
  const isHome = window.location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!headerTransparent && !isHome) { setScrolled(false); return; }
    // Defer one tick so Home's scroll container is in the DOM
    const t = setTimeout(() => {
      const el = document.getElementById('home-scroll-container');
      if (!el) return;
      const onScroll = () => setScrolled(el.scrollTop > 20);
      el.addEventListener('scroll', onScroll, { passive: true });
      // store cleanup on the timeout ref so we can call it on unmount
      t._cleanup = () => el.removeEventListener('scroll', onScroll);
    }, 0);
    return () => {
      clearTimeout(t);
      t._cleanup?.();
    };
  }, [headerTransparent, isHome]);

  return (
    <header
      className="select-none transition-colors duration-300"
      style={{
        position: (headerTransparent || isHome) ? 'fixed' : 'sticky',
        top: 0,
        width: '100%',
        height: `${toolbarHeight}px`,
        maxHeight: `${toolbarHeight}px`,
        fontWeight: 700,
        overflow: 'visible',
        backgroundColor: (headerTransparent || isHome) && !scrolled
          ? 'transparent'
          : 'var(--color-hmc-header-opaque)',
        zIndex: 50,
      }}
    >
      {/* Bounce animation */}
      <style>{`
        @keyframes hmc-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.35); }
          50%  { transform: scale(0.95); }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .hmc-bounce {
          animation: hmc-bounce 600ms cubic-bezier(.2,.8,.2,1);
          will-change: transform;
        }
      `}</style>

      <div
        className="text-hmc-textprimary"
        style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: 'auto',
          height: '100%',
          padding: '0 1rem',
          position: 'relative',
          lineHeight: 1,
        }}
      >
        {/* Left: brand */}
        <div className="flex items-center">
          <NavLink to="/" end className={({ isActive }) => isActive ? activeBorder : inactiveBorder} style={{ color: 'inherit' }}>
            <span className="inline-flex items-center">
              {siteInitials}
              {showLogo && (
                <img src={settings.logo_url} alt="" className="ml-2 h-6 w-auto object-contain" />
              )}
            </span>
          </NavLink>
        </div>

        {/* Center nav */}
        <div
          style={{
            display: 'flex',
            flexGrow: 2,
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <NavLink
            to="/shop"
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
            style={{ color: 'inherit' }}
          >
            SHOP
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
            style={{ color: 'inherit' }}
          >
            EVENTS
          </NavLink>

          <NavLink
            to="/about_us"
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
            style={{ color: 'inherit' }}
          >
            ABOUT US
          </NavLink>
          {hasAdminAccess === true &&<AdminDropDownMenu/> }
        </div>

        {/* Right */}
        <div
          className="flex items-center"
          style={{ marginLeft: 'auto', gap: '1rem' }}
        >
          {authUser ? (
            <button
              onClick={() => navigate('/user/profile')}
              className="flex items-center justify-center cursor-pointer hover:opacity-70 transition"
              title="View profile"
            >
              {userIconUrl ? (
                <img src={userIconUrl} alt="User" className="h-6 w-6 object-contain" />
              ) : (
                <UserCircle size={24} strokeWidth={0.75} />
              )}
            </button>
          ) : (
            <Link to="/create_account" className={inactiveBorder} style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
              <span className="hidden sm:inline">SIGN IN</span>
              <UserCircle className="sm:hidden" size={24} strokeWidth={0.75} />
            </Link>
          )}


          {/* Cart */}
          <div
            onClick={() => dispatch(toggleShoppingCart())}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center justify-center text-xs font-bold gap-2">
              {shoppingCartIconUrl && (
                <img src={shoppingCartIconUrl} alt="Cart" className="h-6 w-6 object-contain" />
              )}
              <div
                key={totalItemsInCart}
                className="w-6 h-6 rounded-full border border-color-text-hmc-c flex items-center justify-center hmc-bounce"
              >
                {totalItemsInCart}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
