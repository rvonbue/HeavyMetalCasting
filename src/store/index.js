import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import productsReducer from './productsSlice'
import cartReducer from './shoppingCartSlice'
import adminReducer from "./adminSlice"
import userReducer from "./userSlice"
import settingsReducer from "./settingsSlice"
import eventsReducer from "./eventsSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productsReducer,
    admin: adminReducer,
    cart: cartReducer,
    user: userReducer,
    settings: settingsReducer,
    events: eventsReducer,
  },
})
export default store;