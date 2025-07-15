import React, { createContext, useReducer, useContext } from 'react';

// Initial global state
const initialState = {
  user: null,
  theme: 'light',
  loading: false,
  showShoppingCart: false,
  shoppingCartItems: [],
  orders: [],
  productCategories: [
    {id: 1, label: "rings", },
    {id: 2, label: "necklaces"},
    {id: 3, label: "pins"},
    {id: 3, label: "earrings"},
  ],
  toolbarHeight: 56,  
  products: [
    { 
      id: 1, 
      name: 'Ring =#`1', 
      live: true, 
      price: 19.99, 
      productCat: [1],
      stock: 120, 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, nisl vitae luctus interdum, orci tortor vulputate purus, sed vulputate ante mauris sit amet urna. Sed nec ante at purus fermentum sollicitudin. Integer quis ex sed quam aliquet facilisis. Nulla facilisi. Phasellus euismod, mauris vitae malesuada efficitur, justo libero cursus nibh, sit amet consequat odio felis quis orci. Donec ac dolor sit amet purus feugiat interdum. Curabitur in felis ac justo sollicitudin hendrerit.", 
      images: ["20210202_215207.jpg", "20210902_163609.jpg","20210202_215207.jpg", "20210902_163609.jpg","20210202_215207.jpg",] },
    { 
      id: 2, 
      name: 'Hoodie', 
      live: false, 
      price: 39.99, 
      productCat: [3], 
      stock: 75, 
      description: "I love Hoodies", 
      images: []  
    },
    { 
      id: 3, 
      name: 'Ring and Necklace', 
      live: true, 
      price: 14.99, 
      productCat: [2,1], 
      stock: 200, 
      description: "Raskdljflkasdjfkl;sdj f are ok", 
      images: [] 
    },
  ],
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