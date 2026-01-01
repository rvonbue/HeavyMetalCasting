import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import HeaderNavbar from "./components/header/Header";
import { useAppState, useAppDispatch } from './AppState';
import './styles/App.css'
import ShoppingTab from "./components/shoppingTab/ShoppingTab.jsx";
import { toolbarHeight } from "./styles/App.jsx";

function Root() {
  const { showShoppingCart } = useAppState();
  const dispatch = useAppDispatch(); 
  
  return (
    <>
      <HeaderNavbar/>
      <div style={{height: `calc(100vh - ${toolbarHeight}px)`}}>
        <Outlet />
        <ShoppingTab 
          isOpen={showShoppingCart} 
          onClose={() => dispatch({ type: 'SET_SHOW_SHOPPING_CART', payload: false })}/>
      </div>
    </>
  )
}

export default Root
