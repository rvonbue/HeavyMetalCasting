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
    productCategories: [
      {id: 1, label: "ring", },
      {id: 2, label: "necklace"},
      {id: 3, label: "pin"},
      {id: 4, label: "earrings"},
    ],
    sizeCharts: [
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
        dataName: "productCategories",
        userEdit: true,
        classNames: "min-w-36",
        inputStyles: {
          width: "500px",
        }
      },
      { 
        adminDisplayName: "Size Chart", 
        storeDisplayName: "Size Chart", 
        dataType: "list", 
        dataName: "sizeCharts",
        userEdit: true,
        classNames: "min-w-36",
        divStyles: {
          width: "100%"
        },
        inputStyles: {
          maxWidth: "100%"
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
        },
        inputProps: {
          required: false
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
      }
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