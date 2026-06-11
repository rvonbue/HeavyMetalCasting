import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showShoppingCart: false,
  shoppingCartItems: [
     {
      id: '3_1_7',
      product_id: 3,
      product_name: "Dragon Sccale Ring Z",
      product_price: 89.99,
      quantity: 1,
      metal_type: 1,
      size_chart: '7'
    }

  ] // { id, quantity }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Toggle the shopping cart panel
    toggleShoppingCart(state) {
      state.showShoppingCart = !state.showShoppingCart
    },

    // Update quantity of a product (add, update, or remove if quantity=0)
    updateCart(state, action) {
      const { id, quantity } = action.payload
      const existingIndex = state.shoppingCartItems.findIndex(item => item.id === id)

      if (quantity === 0) {
        if (existingIndex !== -1) state.shoppingCartItems.splice(existingIndex, 1)
      } else if (existingIndex !== -1) {
        state.shoppingCartItems[existingIndex].quantity = quantity
      } else {
        state.shoppingCartItems.push({...action.payload})
      }
    },

    // Remove a single product
    removeFromCart(state, action) {
      state.shoppingCartItems = state.shoppingCartItems.filter(item => item.id !== action.payload)
    },

    // Clear the entire cart
    clearCart(state) {
      state.shoppingCartItems = []
    },
  },
})

// ===== Selectors =====

// Get quantity for a specific product
export const selectProductQuantity = (state, productId) => {
  const item = state.cart.shoppingCartItems.find(i => i.id === productId)
  return item ? item.quantity : 0
}

// Get cart item details and totals
export const selectCartDetails = (state, products) => {
  const shoppingCartItemsList = state.cart.shoppingCartItems.map(cartItem => {
    const product = products.find(prd => prd.id === cartItem.id)
    return { ...product, ...cartItem }
  })

  const totalQuantities = shoppingCartItemsList.reduce((total, item) => total + item.quantity, 0)
  const totalCost = parseFloat(
    shoppingCartItemsList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  )

  return { shoppingCartItemsList, totalQuantities, totalCost }
}

export const { toggleShoppingCart, updateCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
