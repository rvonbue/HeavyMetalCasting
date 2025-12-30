import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState';
import { CartIcon } from "../../styles/Icons";
import { activeBorder, inactiveBorder } from "../../styles/App.jsx";
import HeaderDesktop from './HeaderDesktop.jsx';
import HeaderMobile from './HeaderDesktop.jsx';

function Header() {
  const { showShoppingCart, shoppingCartItems, appSizeMode } = useAppState();
  const totalItemsInCart = shoppingCartItems.reduce((total, item) => total + item.quantity, 0); 

  return (
    <>
      {appSizeMode === 'desktop' ?    
        <HeaderDesktop 
          totalItemsInCart={totalItemsInCart} 
          showShoppingCart={showShoppingCart}
        /> : 
        <HeaderMobile 
          totalItemsInCart={totalItemsInCart} 
          showShoppingCart={showShoppingCart}
        />
      }
    </>
  )
}

export default Header
