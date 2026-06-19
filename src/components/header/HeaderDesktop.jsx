import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { CartIcon, SkullIcon } from '../../styles/Icons.jsx'
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

  const toolbarHeight = useSelector(state => state.app.toolbarHeight);

  return (
    <header
      className="bg-hmc-headercolor select-none"
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: `${toolbarHeight}px`,
        maxHeight: `${toolbarHeight}px`,
        fontWeight: 700,
        overflow: 'visible',
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
        <div>
          <NavLink to="/" end style={{ color: 'inherit' }}>
            HMC
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
            className={({ isActive }) =>
              isActive ? activeBorder : inactiveBorder
            }
            style={{ color: 'inherit' }}
          >
            SHOP
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? activeBorder : inactiveBorder
            }
            style={{ color: 'inherit' }}
          >
            EVENTS
          </NavLink>

          <NavLink
            to="/about_us"
            className={({ isActive }) =>
              isActive ? activeBorder : inactiveBorder
            }
            style={{ color: 'inherit' }}
          >
            ABOUT US
          </NavLink>
          {hasAdminAccess === true &&<AdminDropDownMenu/> }
        </div>

        {/* Right */}
        <div
          className="flex items-center"
          style={{ marginLeft: 'auto', gap: '0.25rem' }}
        >
          {loggedIn ? (
            <SkullIcon />
          ) : (
            <Link to="/login" style={{ color: 'inherit' }}>
              SIGN IN
            </Link>
          )}


          {/* Cart */}
          <div
            onClick={() => dispatch(toggleShoppingCart())}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center justify-center text-xs font-bold">
              {/* <CartIcon stroke='#FFFF'/> */}
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
