import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authSlice from "./slices/authSlice";
import hubSlice from "./slices/hubSlice";
import geolocationSlice from "./slices/geolocationSlice";
import integrationSlice from "./slices/integrationSlice";
export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authSlice,
    hubs: hubSlice,
    geolocation: geolocationSlice,
    integration: integrationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
