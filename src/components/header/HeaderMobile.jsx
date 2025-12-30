import { useState } from 'react'
import { NavLink } from "react-router";
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState.jsx';
import { CartIcon } from "../../styles/Icons.jsx";
import { activeBorder, inactiveBorder } from "../../styles/App.jsx";

export default function HeaderDesktop({ totalItemsInCart, showShoppingCart }) {
  const dispatch = useAppDispatch(); 

  return (
   <header 
      className="bg-hmc-a select-none"
      style={{ position: 'sticky', overflow: 'visible', top: 0, width: "100%", }}
    >
     
    </header>
  )
}

