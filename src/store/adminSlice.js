import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productEditFields: [],
}

const adminSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAdminProductEditFields(state, action) {
      state.productEditFields = action.payload
    },
  },
})

export const {
  setAdminProductEditFields,
} = adminSlice.actions

export default adminSlice.reducer
