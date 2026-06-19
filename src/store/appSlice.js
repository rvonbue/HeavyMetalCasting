import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  themeName: 'light',
  loading: false,
  initialLoading: false,
  appSizeMode: 'desktop',
  toolbarHeight: 56,
  headerTransparent: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.themeName = action.payload
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
    setHeaderTransparent(state, action) {
      state.headerTransparent = action.payload
    },
  },
})

export const {
  setTheme,
  setLoading,
  setInitialLoading,
  setAppSizeMode,
  setToolbarHeight,
  setHeaderTransparent,
} = appSlice.actions

export default appSlice.reducer
