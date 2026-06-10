import React, { createContext, useReducer, useContext } from 'react';
import { productData } from './staticData/testData.js';
import appReducer from './reducers/appReducer.jsx';

// Initial global state
const initialState = {
  user: {},
  theme: 'dark',
  loading: false,
  appSizeMode: 'desktop', // 'desktop' or 'mobile'
  showShoppingCart: false,
  shoppingCartItems: [],
  orders: [],
  productAttributes: {
    product_categories: [
      {id: 1, label: "ring", },
      {id: 2, label: "necklace"},
      {id: 3, label: "pin"},
      {id: 4, label: "earrings"},
    ],
    size_charts: [
      {
        id: 1, 
        label: "ring_sizes",
        options: [{label: "6", value: "6"},{label: "7", value: "7"},{label: "8", value: "8"},{label: "9", value: "9"},{label: "10", value: "10"},{label: "11", value: "11"},{label: "12", value: "12"}]
      },
      {
        id: 2, 
        label: "necklace_lengths", 
        options: [{label:"16in", value:"16in"},{label:"18in", value:"18in"},{label:"20in", value:"20in"},{label:"22in", value:"22in"},{label:"24in", value:"24in"}]
      },
      {
        id: 3, 
        label: "earring_types", 
        options: [{label:"studs", value:"studs"},{label:"hoops", value:"hoops"},{label:"dangles", value:"dangles"}]
      },
    ],
  },
  toolbarHeight: 56,  
  products: [...productData], 
  productsLoading: false,
  initialLoading: false
};

// Create context
const AppStateContext = createContext();
const AppDispatchContext = createContext();

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}

export function useAppDispatch() {
  // console.log("useAppDispatch:", useAppDispatch);
  const context = useContext(AppDispatchContext);
  if (context === undefined) throw new Error('useAppDispatch must be used within AppStateProvider');
  return context;
}