import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  theme: 'light',
  loading: false,
  initialLoading: false,
  appSizeMode: 'desktop',
  toolbarHeight: 56,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setInitialLoading(state, action) {
      state.initialLoading = action.payload
    },
    setAppSizeMode(state, action) {
      state.appSizeMode = action.payload
    },
    setToolbarHeight(state, action) {
      state.toolbarHeight = action.payload
    },
  },
})

export const {
  setTheme,
  setLoading,
  setInitialLoading,
  setAppSizeMode,
  setToolbarHeight,
} = appSlice.actions

export default appSlice.reducer
