import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState';
import { CartIcon } from "../../styles/Icons";
import { activeBorder, inactiveBorder } from "../../styles/App.jsx";
import HeaderDesktop from './HeaderDesktop.jsx';
import HeaderMobile from './HeaderDesktop.jsx';

function Header() {
  const { showShoppingCart, shoppingCartItems, appSizeMode, user } = useAppState();
  const totalItemsInCart = shoppingCartItems.reduce((total, item) => total + item.quantity, 0); 
  const loggedIn = user.id != undefined

  return (
    <>
      {appSizeMode === 'desktop' ?    
        <HeaderDesktop 
          totalItemsInCart={totalItemsInCart} 
          showShoppingCart={showShoppingCart}
          user={user}
          loggedIn={loggedIn} 
        /> 
        : 
        <HeaderMobile 
          totalItemsInCart={totalItemsInCart} 
          showShoppingCart={showShoppingCart} 
          user={user}
          loggedIn={loggedIn} 
         />  
      }
    </>
  )
}

export default Header
