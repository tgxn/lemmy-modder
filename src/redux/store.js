import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import thunk from "redux-thunk";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import accountReducer from "./reducer/accountReducer";
import configReducer from "./reducer/configReducer";


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    accountReducer,
    configReducer
  },
  middleware: (getDefaultMiddleware) => 
   getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(thunk)
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
