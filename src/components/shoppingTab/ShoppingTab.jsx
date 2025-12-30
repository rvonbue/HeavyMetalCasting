import { useState } from 'react'
import { useAppState, useAppDispatch } from '../../AppState';
import ShoppingTabMobile from './ShoppingTabMobile.jsx';
import ShoppingTabDesktop  from './ShoppingTabDesktop.jsx';
import { getShoppingCartItemDetails } from '../../actions/shoppingCartActions.jsx';

function ShoppingTab({isOpen, onClose}) {
  const { products, appSizeMode, shoppingCartItems } = useAppState();
  // const dispatch = useAppDispatch();  
  const shoppingCartItemDetials = getShoppingCartItemDetails({products,  shoppingCartItems});

  return (
    <>
      {appSizeMode === 'desktop' ?    
        <ShoppingTabDesktop isOpen={isOpen} onClose={onClose} shoppingCartItemDetials={shoppingCartItemDetials} 
        /> : 
        <ShoppingTabMobile isOpen={isOpen} onClose={onClose}  shoppingCartItemDetials={shoppingCartItemDetials}
        />
      }
    </>
  )
}

export default ShoppingTab
