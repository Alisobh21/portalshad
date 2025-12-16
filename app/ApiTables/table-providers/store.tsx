import { configureStore } from "@reduxjs/toolkit";
import tableCoreSlice from "./slices/tableCoreSlice";
import bulkActionsSlice from "./slices/bulkActionsSlice";
import rowActionsSlice from "./slices/rowActionsSlice";
import tableColumnsSlice from "./slices/tableColumnsSlice";
import { store as externalStore } from "@/store/store";

export const store = configureStore({
    reducer: {
        tableCore: tableCoreSlice,
        bulkActions: bulkActionsSlice,
        rowActions: rowActionsSlice,
        tableColumns: tableColumnsSlice,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const getExternalState = () => externalStore.getState();
