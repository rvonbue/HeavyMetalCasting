import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import HeaderNavbar from "./components/header/Header";
import { useAppState, useAppDispatch } from './AppState';
import './styles/App.css'
import ShoppingTab from "./components/ShoppingTab"
;
function Root() {
  const { showShoppingCart } = useAppState();
  const dispatch = useAppDispatch(); 
  
  return (
    <>
      <HeaderNavbar/>
      <div style={{height: "calc(100vh - 56px)" }}>
        <Outlet />
        <ShoppingTab 
          isOpen={showShoppingCart} 
          onClose={() => dispatch({ type: 'SET_SHOPPING_CART', payload: false })}/>
      </div>
    </>
  )
}

export default Root
