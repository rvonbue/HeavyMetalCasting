import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import productsReducer from './productsSlice'
import cartReducer from './shoppingCartSlice'
import adminReducer from "./adminSlice"
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productsReducer,
    admin: adminReducer,
    cart: cartReducer,
    user: userReducer
  },
})
export default store;