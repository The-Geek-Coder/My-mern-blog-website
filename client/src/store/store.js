import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {persistReducer} from "redux-persist";
import userReducer from "./user/userSlice.js";
import themeReducer from "./theme/themeSlice.js";
import storage from 'redux-persist/lib/storage'; 
//path to use session storage instead of local storage if you want:'redux-persist/es/storage/session 
//if you write /session after storage it will use session storage, local storage is by default.
import persistStore from 'redux-persist/es/persistStore';
const rootReducer=combineReducers({
  user:userReducer,
  theme:themeReducer
});

const persistConfig={
  key:'root',
  storage,
  version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
      getDefaultMiddleware({serializableCheck:false}),
});


export const persistor=persistStore(store);