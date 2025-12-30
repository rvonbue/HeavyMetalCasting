
export function updateCartAction({ dispatch, product, newQuantity }) {
  dispatch({ type: "UPDATE_CART", payload: { id: product.id, quantity: newQuantity } })
}
export function updateCartReducer({ state, action }) {
  let newShoppingCartItems = state.shoppingCartItems.filter(item => item.id !== action.payload.id);
  return [...newShoppingCartItems, action.payload ];
} 