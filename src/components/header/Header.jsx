import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState';
import { CartIcon } from "../../styles/Icons";


function Header() {
  const { showShoppingCart } = useAppState();
  const dispatch = useAppDispatch(); 
  
//  console.log('showShoppingCart', showShoppingCart);
// console.log('dispatch', dispatch);

  return (
    <>
    <header 
      className="bg-hmc-a"
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
          <NavLink to="/" end style={{padding: "0px 8px", color: "inherit"}}>SHOP</NavLink>
          <NavLink to="/trending" end style={{padding: "0px 8px", color: "inherit"


          }} className={({ isActive }) => {
            console.log("isActive", isActive);
            return isActive ? 'border-b-4 border-blue-600 text-blue-600 pb-2'
            : 'border-b-4 border-transparent text-gray-600 pb-2';
          }
            
          }>
            COLLECTIONS
          </NavLink>
          <NavLink to="/concerts" className="text-red-500" style={{ padding: "0px 8px",color: "inherit"}}>MY STORY</NavLink>
        </div>
        <div className="flex justify-end" style={{width: "25%", display: "flex" }}>
          <Link to="/login" style={{ color: "inherit", marginRight: "36px" }} >SIGN IN</Link>
          <Link to="/admin" style={{ color: "inherit", marginRight: "36px" }} >ADMIN</Link>
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
