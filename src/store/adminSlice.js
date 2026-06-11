import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productEditFields: [],
}

const adminSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAdminInitialData(state, action) {
      Object.assign(state, action.payload);
    },
  },
})

export const {
  setAdminInitialData,
} = adminSlice.actions

export default adminSlice.reducer
