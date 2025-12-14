import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IntegrationState {
  activeStores: unknown[];
}

const initialState: IntegrationState = {
  activeStores: [],
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    _getActiveStores: (state, action: PayloadAction<unknown[]>) => {
      state.activeStores = action.payload;
    },
  },
});

export const { _getActiveStores } = integrationSlice.actions;

export default integrationSlice.reducer;
