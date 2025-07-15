import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState';
import { CartIcon } from "../../styles/Icons";
import { activeBorder, inactiveBorder } from "../../styles/App.jsx";

function Header() {
  const { showShoppingCart } = useAppState();
  const dispatch = useAppDispatch(); 

  return (
    <>
    <header 
      className="bg-hmc-a select-none"
      style={{ position: 'sticky', overflow: 'visible', top: 0, width: "100%", }}
    >
      <div 
        className="text-hmc-b"
        style={{ display: "flex", justifyContent: "center", alignItems: "center",maxWidth: "1280px", margin: "auto", padding: "1rem 1.5rem 1rem .7rem" }}
      >
        <div style={{ width: "25%" }} >
          <NavLink 
           to="/" 
           end
           className=""
           style={{ color: "inherit" }}
          >
            HMC
          </NavLink> 
        </div>
        <div  style={{width: "50%" }}>
          <NavLink 
            to="/shop" end 
            style={{ color: "inherit"}}
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
          >
            SHOP
          </NavLink>
          <NavLink 
            to="/collections" end 
            style={{color: "inherit"}} 
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}>
            COLLECTIONS
          </NavLink>
          <NavLink 
            to="/about_us" 
            className={({ isActive }) => isActive ? activeBorder : inactiveBorder}
            style={{ color: "inherit"}}
          >
            ABOUT US
          </NavLink>
        </div>
        <div className="flex justify-end" style={{width: "25%", display: "flex" }}>
          <Link to="/login" style={{ color: "inherit", marginRight: "36px" }} >SIGN IN</Link>
          <Link to="/admin/overview_products" style={{ color: "inherit", marginRight: "36px" }} >ADMIN</Link>
          <div onClick={() => { 
            dispatch({ type: 'SET_SHOPPING_CART', payload: !showShoppingCart });
            }}>
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default Header
