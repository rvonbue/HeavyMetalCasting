import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productEditFields: [],
  shopBlocks: [],
  adminDataLoaded: false,
}

const adminSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAdminInitialData(state, action) {
      Object.assign(state, action.payload);
      state.adminDataLoaded = true;
    },
    setShopBlocks(state, action) {
      state.shopBlocks = action.payload;
    },
    addShopBlock(state, action) {
      state.shopBlocks.push(action.payload);
    },
    updateShopBlock(state, action) {
      const updated = action.payload;
      const idx = state.shopBlocks.findIndex((b) => b.id === updated.id);
      if (idx !== -1) {
        state.shopBlocks[idx] = { ...state.shopBlocks[idx], ...updated };
      }
    },
    removeShopBlock(state, action) {
      state.shopBlocks = state.shopBlocks.filter((b) => b.id !== action.payload);
    },
  },
})

export const {
  setAdminInitialData,
  setShopBlocks,
  addShopBlock,
  updateShopBlock,
  removeShopBlock,
} = adminSlice.actions

export default adminSlice.reducer
