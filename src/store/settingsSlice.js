import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  settings: {},
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action) {
      const rows = action.payload ?? [];
      state.settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
    updateSetting(state, action) {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },
  },
})

export const { setSettings, updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
