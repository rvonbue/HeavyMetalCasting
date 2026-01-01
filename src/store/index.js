import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import productsReducer from './productsSlice'
import cartReducer from './shoppingCartSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productsReducer,
    cart: cartReducer,
  },
})
export default store;