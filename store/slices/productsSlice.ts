import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { InventoryProduct } from "./inventorySlice";

// تعريف أنواع المنتجات
export interface Product {
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

// تعريف حالة الـ slice
interface ProductsState {
  products: Product[];
  productsCursor: string | null;
  oneProduct: Product;
  productsQuery: Product[];
  inventoryOneProduct: InventoryProduct[];
}

const initialState: ProductsState = {
  products: [],
  productsCursor: null,
  oneProduct: {},
  productsQuery: [],
  inventoryOneProduct: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    _getProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    _setProductsCursor: (state, action: PayloadAction<string | null>) => {
      state.productsCursor = action.payload;
    },
    _addOneProduct: (state, action: PayloadAction<Product>) => {
      state.oneProduct = action.payload;
    },
    _addinventoryOneProduct: (
      state,
      action: PayloadAction<InventoryProduct[]>
    ) => {
      state.inventoryOneProduct = action.payload;
    },
    getProductsQuery: (state, action: PayloadAction<Product[]>) => {
      state.productsQuery = action.payload;
    },
  },
});

export const {
  _getProducts,
  _setProductsCursor,
  _addOneProduct,
  getProductsQuery,
  _addinventoryOneProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
