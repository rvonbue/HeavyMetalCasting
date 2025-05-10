import React, { createContext, useReducer, useContext } from 'react';

// Initial global state
const initialState = {
  user: null,
  theme: 'light',
  loading: false,
  showShoppingCart: false,
  shoppingCartItems: [],
  orders: [],
  products: [
    { id: 1, name: 'T-shirt', price: 19.99, stock: 120, description: "I love tshirts" },
    { id: 2, name: 'Hoodie', price: 39.99, stock: 75, description: "I love Hoodies"  },
    { id: 3, name: 'Cap', price: 14.99, stock: 200, description: "Caps are ok" },
  ],
  productsLoading: false
};

// Reducer to handle state updates
function appReducer(state, action) {
  // console.log("action",action )
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SHOPPING_CART':
      return { ...state, showShoppingCart: action.payload };
    default:
      return state;
  }
}

// Create context
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
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

// Custom hooks for usage
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