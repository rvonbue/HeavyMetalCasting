
export function updateCartAction({ dispatch, product, newQuantity }) {
  dispatch({ type: "UPDATE_CART", payload: { id: product.id, quantity: newQuantity } })
}
export function updateCartReducer({ state, action }) {
  let newShoppingCartItems = state.shoppingCartItems.filter(item => item.id !== action.payload.id);
  return [...newShoppingCartItems, action.payload ];
} 
 export function getShoppingCartItemDetails({products, shoppingCartItems}) {
   let shoppingCartItemsList = shoppingCartItems.map(cartItem => {
     const product = products.find(prd => prd.id === cartItem.id);
     return {
       ...product,
       ...cartItem,
     };
   });
   return { 
      shoppingCartItemsList, 
      totalQuantities: shoppingCartItemsList.reduce((total, item) => total + item.quantity, 0),
      totalCost: shoppingCartItemsList.reduce((total, item) => total + (item.price * item.quantity), 0)
   };  
}