import React, { createContext, useReducer, useContext } from 'react';
import { productData } from './staticData/testData.js';
import appReducer from './reducers/appReducer.jsx';

// Initial global state
const initialState = {
  theme: 'dark',
  loading: false,
  appSizeMode: 'desktop', // 'desktop' or 'mobile'
  toolbarHeight: toolbarHeight,  
  initialLoading: false
};

// Create context
const AppStateContext = createContext();
const AppDispatchContext = createContext();

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}

export function useAppDispatch() {
  // console.log("useAppDispatch:", useAppDispatch);
  const context = useContext(AppDispatchContext);
  if (context === undefined) throw new Error('useAppDispatch must be used within AppStateProvider');
  return context;
}