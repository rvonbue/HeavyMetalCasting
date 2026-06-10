import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import productsReducer from './productsSlice'
import cartReducer from './shoppingCartSlice'
import adminReducer from "./adminSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productsReducer,
    admin: adminReducer,
    cart: cartReducer,
  },
})
export default store;