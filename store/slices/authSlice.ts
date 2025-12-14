"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import lsSecure from "@/helpers/Secure";

type CSRFToken = string | null;
type AuthToken = string | null;

export type ChildUser = {
  id: string | number;
  // Allow other fields without enforcing a strict shape
  [key: string]: unknown;
};

export type AuthUser = {
  id?: string | number;
  [key: string]: unknown;
} | null;

export interface AuthState {
  csrf: CSRFToken;
  user: AuthUser;
  token: AuthToken;
  childUsers: ChildUser[];
}

const initialState: AuthState = {
  csrf: null,
  user: null,
  token:
    typeof window !== "undefined" && lsSecure
      ? lsSecure.get("auth_token")
      : null,
  childUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    _getCSRFToken: (state, action: PayloadAction<CSRFToken>) => {
      state.csrf = action.payload;
    },
    _getAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    _getChildUsers: (state, action: PayloadAction<ChildUser[]>) => {
      state.childUsers = action.payload;
    },
    _incrementChildUsers: (state, action: PayloadAction<ChildUser>) => {
      state.childUsers.push(action.payload);
    },
    _deleteChildUser: (state, action: PayloadAction<ChildUser["id"]>) => {
      state.childUsers = state.childUsers.filter(
        (user) => user?.id !== action.payload
      );
    },
    _setToken: (state, action: PayloadAction<AuthToken>) => {
      state.token = action.payload;
    },
  },
});

export const {
  _getCSRFToken,
  _getAuthUser,
  _getChildUsers,
  _incrementChildUsers,
  _deleteChildUser,
  _setToken,
} = authSlice.actions;

export default authSlice.reducer;
