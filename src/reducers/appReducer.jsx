
// Reducer to handle state updates
import { updateCartReducer } from "../actions/shoppingCartActions.jsx";

export default function appReducer(state, action) {
  // console.log("action",action )
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SHOW_SHOPPING_CART':
      return { ...state, showShoppingCart: action.payload };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter((prd) => prd.id !== action.payload )};
    case "UPDATE_CART":
      return { ...state, shoppingCartItems: updateCartReducer({ state, action })};
    default:
      return state;
  }
}