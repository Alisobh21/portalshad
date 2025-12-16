"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type HomeState = {
  homeOrders: unknown[];
};

const initialState: HomeState = {
  homeOrders: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeOrders: (state, action: PayloadAction<unknown[]>) => {
      state.homeOrders = action.payload;
    },
  },
});

export const { setHomeOrders } = homeSlice.actions;

export default homeSlice.reducer;
