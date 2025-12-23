import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// تعريف نوع المنتج
export interface InventoryProduct {
  id?: string | number;
  name?: string;
  sku?: string;
  warehouse_id?: string | number;
  warehouse?: {
    identifier?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// حالة الـ slice
interface InventoryState {
  products: InventoryProduct[];
  currentProduct: InventoryProduct | null;
  inventoryFetchingLoaders: {
    getCurrentProduct: boolean;
  };
}

const initialState: InventoryState = {
  products: [],
  currentProduct: null,
  inventoryFetchingLoaders: {
    getCurrentProduct: true,
  },
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    _getCurrentProduct: (state, action: PayloadAction<InventoryProduct>) => {
      state.currentProduct = action.payload;
      state.inventoryFetchingLoaders.getCurrentProduct = false;
    },
    _getProducts: (state, action: PayloadAction<InventoryProduct[]>) => {
      state.products = action.payload;
    },
    _addProduct: (state, action: PayloadAction<InventoryProduct>) => {
      state.products.push(action.payload);
    },
    _updateProduct: (state, action: PayloadAction<InventoryProduct>) => {
      state.products = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
    _deleteProduct: (state, action: PayloadAction<string | number>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
});

export const {
  _getProducts,
  _addProduct,
  _updateProduct,
  _deleteProduct,
  _getCurrentProduct,
} = inventorySlice.actions;

export default inventorySlice.reducer;
