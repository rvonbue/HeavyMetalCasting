import React, { createContext, useReducer, useContext } from 'react';
import { productData } from './staticData/testData.js';
import appReducer from './reducers/appReducer.jsx';

// Initial global state
const initialState = {
  user: null,
  theme: 'light',
  loading: false,
  appSizeMode: 'desktop', // 'desktop' or 'mobile'
  showShoppingCart: false,
  shoppingCartItems: [],
  orders: [],
  productCategories: [
    {id: 1, label: "rings", },
    {id: 2, label: "necklaces"},
    {id: 3, label: "pins"},
    {id: 4, label: "earrings"},
  ],
  toolbarHeight: 56,  
  products: [...productData], 
  productsLoading: false,
  productProps: [
      { 
        adminDisplayName: "ID", 
        storeDisplayName: "", 
        dataType: "number", 
        dataName: "id",
        userEdit: false,
        classNames: "min-w-36",
        inputStyles: {
          width: "50%"
        }
      },
      { 
        adminDisplayName: "Product Name", 
        storeDisplayName: "", 
        dataType: "text", 
        dataName: "name",
        userEdit: true,
        classNames: "min-w-36",
        divStyles: {
          width: "50%"
        },
        inputStyles: {
          maxWidth: "100%"
        }
      },
    
       { 
        adminDisplayName: "Product Categories", 
        storeDisplayName: "", 
        dataType: "list", 
        dataName: "productCat",
        userEdit: true,
        classNames: "min-w-36",
        inputStyles: {
          width: "500px",
        }
      },
      { 
        adminDisplayName: "Live", 
        storeDisplayName: "", 
        dataType: "checkbox", 
        dataName: "live",
        userEdit: true,
        inputStyles: {
          width: "24px",
          height: "24px"
        }
      },
      { 
        adminDisplayName: "Price($)", 
        storeDisplayName: "", 
        dataType: "number", 
        dataName: "price",
        userEdit: true,
        inputProps: {step: "0.01"},
        inputStyles: {
          maxWidth: "100px"
        }
      },
      { 
        adminDisplayName: "Stock",
        storeDisplayName: "",  
        dataType: "number", 
        dataName: "stock",
        userEdit: true,
        inputStyles: {
          maxWidth: "100px"
        }
      },
      { 
        adminDisplayName: "Description", 
        storeDisplayName: "", 
        dataType: "textarea", 
        dataName: "description",
        userEdit: true,
        classNames: "min-w-36",
        divStyles: {
          width: "100%"
        },
        inputStyles: {
          maxWidth: "100%"
        }
      },
  ],
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