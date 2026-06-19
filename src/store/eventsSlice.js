import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: [],
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action) {
      state.events = action.payload ?? [];
    },
    addEvent(state, action) {
      state.events.push(action.payload);
    },
    updateEvent(state, action) {
      const idx = state.events.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.events[idx] = { ...state.events[idx], ...action.payload };
    },
    removeEvent(state, action) {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
  },
})

export const { setEvents, addEvent, updateEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
