import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productEditFields: [],
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
  },
})

export const {
  setAdminInitialData,
} = adminSlice.actions

export default adminSlice.reducer
