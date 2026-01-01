import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState.jsx';
import { CartIcon, SkullIcon } from "../../styles/Icons.jsx";
import { activeBorder, inactiveBorder, toolbarHeight } from "../../styles/App.jsx";

export default function HeaderDesktop({ totalItemsInCart, showShoppingCart, user, loggedIn }) {
  const dispatch = useAppDispatch(); 
  
  return (
   <header  
      className="bg-hmc-a select-none"      
      style={{ position: 'sticky', overflow: 'visible', top: 0, width: "100%", maxHeight: `${toolbarHeight}px`, height: `${toolbarHeight}px`, fontWeight: 700,  }}
    >
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
        className="text-hmc-b"
        style={{ display: "flex", alignItems: "center", maxWidth: "1280px", margin: "auto", lineHeight: 1, position: "relative", height: "100%", padding: "0 1rem", }}
      >
        {/* Left: brand */}
        <div>
          <NavLink 
           to="/" 
           end  
           className=""
           style={{ color: "inherit",  }}
          >
            HMC
          </NavLink> 
        </div>

        {/* Center: nav (absolutely centered) */}
        <div style={{ display: "flex", flexGrow: 2, justifyContent: "center", alignItems: "center", gap: "2rem" }}>
          <NavLink 
            to="/shop"
            style={{ color: "inherit"}}
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
          >
            SHOP
          </NavLink>
          <NavLink 
            to="/about_us" 
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
            style={{ color: "inherit"}}
          >
            ABOUT US
          </NavLink>
        </div>
        {/* Right: sign in and cart */}
        <div className="flex items-center" style={{ marginLeft: "auto", display: "flex", gap: "1.5rem" }}>
          {loggedIn ?
            <SkullIcon/> 
            : 
            <Link to="/login" style={{ color: "inherit" }}>
              SIGN IN
            </Link>
          }
          
           <Link to="/admin/overview_products" style={{ color: "inherit", marginRight: "36px" }} >ADMIN</Link> 
          <div onClick={() => { 
            dispatch({ type: 'SET_SHOW_SHOPPING_CART', payload: !showShoppingCart });
            }} style={{ cursor: "pointer" }}>
              <div className="flex items-center justify-center text-xs font-bold">  
                <CartIcon />
                <div
                  key={totalItemsInCart}
                  className="w-6 h-6 rounded-full border border-color-text-hmc-c flex items-center justify-center hmc-bounce"
                  style={{ willChange: 'transform' }}
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

