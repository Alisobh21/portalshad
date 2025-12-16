"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosPrivate from "@/axios/axios";

type WarehouseProduct = {
  price?: number;
  [key: string]: unknown;
};

export type Product = {
  sku?: string;
  price?: number;
  quantity?: number;
  warehouse_products?: WarehouseProduct[];
  [key: string]: unknown;
};

export interface CountryState {
  CN: unknown[];
  shippingMethods: unknown[];
  shippingError: unknown;
  shippingLoading: boolean;
  cities: unknown[];
  products: Product[];
  warehouses: unknown[];
  loadingwarehouses: boolean;
  errorwarehouses: unknown;
  vendors: unknown[];
  suppliers: unknown[];
  orderProducts: Product[];
  shippingProducts: Product[];
  errorProducts: boolean;
  loadingProducts: boolean;
  loadingCountries: boolean;
  loadingCities: boolean;
  citiesError: unknown;
  loadingSuppliers: boolean;
  errorSuppliers: unknown;
  loading: boolean;
  error: unknown;
  query: string | null;
  productsQuery: Product[];
  errorQuery: unknown;
  productsEdite: Product[];
}

type TargetArray =
  | "orderProducts"
  | "shippingProducts"
  | "productsEdite"
  | "products";

export const fetchShipping = createAsyncThunk<unknown[] | undefined>(
  "country/fetchShipping",
  async () => {
    try {
      const response = await axiosPrivate("/ddl/shipping-methods");
      return response.data.data;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
);

type WarehousesResponse = {
  account?: { data?: { warehouses?: unknown[] } };
  vendors?: { data?: unknown[] };
  [key: string]: unknown;
};

export const fetchWarehousesDDL = createAsyncThunk<
  WarehousesResponse,
  void,
  { rejectValue: string }
>("warehouses/fetchWarehousesDDL", async (_, thunkAPI) => {
  try {
    const response = await axiosPrivate("/purchase-orders/create");
    return response.data;
  } catch (error) {
    const message =
      (
        error as {
          response?: { data?: { message?: string } };
          message?: string;
        }
      )?.response?.data?.message ||
      (error as { message?: string })?.message ||
      "Error";
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState: CountryState = {
  CN: [],
  shippingMethods: [],
  shippingError: null,
  shippingLoading: false,
  cities: [],
  products: [],
  warehouses: [],
  loadingwarehouses: false,
  errorwarehouses: null,
  vendors: [],
  suppliers: [],
  orderProducts: [],
  shippingProducts: [],
  errorProducts: false,
  loadingProducts: false,
  loadingCountries: false,
  loadingCities: false,
  citiesError: null,
  loadingSuppliers: false,
  errorSuppliers: null,
  loading: false,
  error: null,
  query: null,
  productsQuery: [],
  errorQuery: null,
  productsEdite: [],
};

const CountrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    addToOrder: (
      state,
      action: PayloadAction<{ product: Product; targetArray: TargetArray }>
    ) => {
      const { product, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const existingIndex = array.findIndex((p) => p.sku === product?.sku);

      if (existingIndex !== -1) {
        const existing = array[existingIndex];
        const currentQty = Number(existing?.quantity) || 0;
        const newQuantity = currentQty + 1;
        const price =
          Number(existing?.warehouse_products?.at(0)?.price) ||
          Number(existing?.price) ||
          0;

        array[existingIndex] = {
          ...existing,
          warehouse_products: existing?.warehouse_products?.map((wp) => ({
            ...wp,
            price: Number(wp?.price),
          })),
          quantity: newQuantity,
          total: newQuantity * price,
        };
      } else {
        const price =
          Number(product?.warehouse_products?.at(0)?.price) ||
          Number(product?.price) ||
          0;

        array.push({
          ...product,
          warehouse_products: product?.warehouse_products?.map((wp) => ({
            ...wp,
            price: Number(wp?.price),
          })),
          quantity: 1,
          total: price,
        });
      }
    },
    addProductsListToEdit: (state, action: PayloadAction<Product[]>) => {
      state.productsEdite = action.payload;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ sku: string; quantity: number }>
    ) => {
      const { sku, quantity } = action.payload;
      const item = state.productsEdite?.find((p) => p.sku === sku);
      if (item) {
        item.quantity = quantity;
      }
    },
    addCountries: (state, action: PayloadAction<unknown[]>) => {
      state.CN = action.payload;
    },
    addQuery: (state, action: PayloadAction<string | null>) => {
      state.query = action.payload;
    },
    updateOrderQuantity: (
      state,
      action: PayloadAction<{
        index: number;
        quantity: number;
        targetArray: TargetArray;
      }>
    ) => {
      const { index, quantity, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const product = array[index];
      if (product) {
        const price =
          Number(product?.warehouse_products?.at(0)?.price) ||
          Number(product?.price) ||
          0;
        array[index] = {
          ...product,
          quantity,
          total: quantity * price,
        };
      }
    },
    updateOrderQuantityEdite: (
      state,
      action: PayloadAction<{
        index: number;
        quantity: number;
        targetArray: TargetArray;
      }>
    ) => {
      const { index, quantity, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const product = array[index];
      if (product) {
        const price = Number(product.price) || 0;
        array[index] = {
          ...product,
          quantity,
          total: quantity * price,
        };
      }
    },
    removeFromOrder: (
      state,
      action: PayloadAction<{ index: number; targetArray: TargetArray }>
    ) => {
      const { index, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;
      array.splice(index, 1);
    },
    addProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    getProducts: (state, action: PayloadAction<Product[]>) => {
      state.productsQuery = action.payload;
    },
    clearTargetArray: (state, action: PayloadAction<TargetArray>) => {
      const targetArray = action.payload;
      if (Array.isArray(state[targetArray])) {
        state[targetArray] = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehousesDDL.pending, (state) => {
        state.loadingwarehouses = true;
        state.errorwarehouses = null;
      })
      .addCase(fetchWarehousesDDL.fulfilled, (state, action) => {
        state.loadingwarehouses = false;
        state.warehouses = action.payload?.account?.data?.warehouses ?? [];
        state.vendors = action.payload?.vendors?.data ?? [];
      })
      .addCase(fetchWarehousesDDL.rejected, (state, action) => {
        state.loadingwarehouses = false;
        state.errorwarehouses = action.payload;
      })
      .addCase(fetchShipping.pending, (state) => {
        state.shippingLoading = true;
      })
      .addCase(fetchShipping.fulfilled, (state, action) => {
        state.shippingLoading = false;
        state.shippingMethods = action.payload ?? [];
      })
      .addCase(fetchShipping.rejected, (state, action) => {
        state.shippingLoading = false;
        state.shippingError = action.payload;
      });
  },
});

export const {
  addToOrder,
  updateOrderQuantity,
  removeFromOrder,
  addCountries,
  addQuery,
  getProducts,
  addProducts,
  addProductsListToEdit,
  updateOrderQuantityEdite,
  updateQuantity,
  clearTargetArray,
} = CountrySlice.actions;

export default CountrySlice.reducer;
