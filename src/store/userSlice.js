import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  userLoggedIn: false,
  hasAdminAccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;  
      state.userLoggedIn = action.payload.id !== undefined ? true : false;
      state.hasAdminAccess = action.payload.role === 'admin' ? true : false;
    }
  }
})

export const {
  setUser,
} = userSlice.actions

export default userSlice.reducer
