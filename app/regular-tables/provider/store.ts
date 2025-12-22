import { configureStore } from "@reduxjs/toolkit";
import { store as externalStore } from "@/store/store";
import mainSlice from "./slices/mainSlice";

export const store = configureStore({
  reducer: {
    regularTablesSlice: mainSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Get external store state
export const getExternalState = (): ReturnType<typeof externalStore.getState> =>
  externalStore.getState();
