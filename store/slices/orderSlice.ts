"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WarehouseProduct = {
  price?: number;
  warehouse_id?: string | number;
  warehouse_identifier?: string;
  [key: string]: unknown;
};

export type OrderProduct = {
  sku?: string;
  name?: string;
  price?: number;
  quantity?: number;
  total?: number;
  warehouse_products?: WarehouseProduct[];
  warehouse_identifier?: string;
  warehouse_id?: string | number;
  [key: string]: unknown;
};

type LineItemNode = {
  id?: string;
  sku?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  warehouse?: { identifier?: string; id?: string | number };
};

type OneOrder = {
  line_items?: { edges: { node: LineItemNode }[] };
  [key: string]: unknown;
};

type ArrayStateKeys =
  | "orders"
  | "orderProducts"
  | "shippingProducts"
  | "productsQuery"
  | "productsEdite";

type OrderState = {
  orders: OrderProduct[];
  orderProducts: OrderProduct[];
  oneOrder: OneOrder;
  shippingProducts: OrderProduct[];
  ordersCursor: unknown;
  editMode: boolean;
  productsQuery: OrderProduct[];
  productsEdite: OrderProduct[];
};

const initialState: OrderState = {
  orders: [],
  orderProducts: [],
  oneOrder: {},
  shippingProducts: [],
  ordersCursor: null,
  editMode: true,
  productsQuery: [],
  productsEdite: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    _getOrders: (state, action: PayloadAction<OrderProduct[]>) => {
      state.orders = action.payload;
    },
    _setOrdersCursor: (state, action: PayloadAction<unknown>) => {
      state.ordersCursor = action.payload;
    },
    _addOrder: (state, action: PayloadAction<OneOrder>) => {
      state.oneOrder = action.payload;
    },
    clearTargetArray: (state, action: PayloadAction<ArrayStateKeys>) => {
      const targetArray = action.payload;
      if (Array.isArray(state[targetArray])) {
        state[targetArray] = [];
      }
    },

    addToOrder: (
      state,
      action: PayloadAction<{
        product: OrderProduct;
        targetArray: ArrayStateKeys;
      }>
    ) => {
      const { product, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const existingIndex = array.findIndex((p) => p.sku === product?.sku);

      if (existingIndex !== -1) {
        const existing = array[existingIndex];
        const newQuantity = (existing?.quantity ?? 0) + 1;

        array[existingIndex] = {
          ...existing,
          warehouse_products: existing?.warehouse_products?.map((wp) => ({
            ...wp,
            price: Number(wp?.price),
          })),
          quantity: newQuantity,
          total:
            newQuantity *
            Number(
              existing?.warehouse_products?.at(0)?.price ?? existing?.price ?? 0
            ),
        };
      } else {
        array.push({
          ...product,
          warehouse_products: product?.warehouse_products?.map((wp) => ({
            ...wp,
            price: Number(wp?.price),
          })),
          quantity: 1,
          total: Number(
            product?.warehouse_products?.at(0)?.price ?? product?.price ?? 0
          ),
        });
      }
    },

    addToOrder2: (
      state,
      action: PayloadAction<{
        product: OrderProduct;
        targetArray: ArrayStateKeys;
      }>
    ) => {
      const { product, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const wp = product?.warehouse_products?.at(0);
      const newWarehouseIdentifier = wp?.warehouse_identifier;
      const newWarehouseId = wp?.warehouse_id;

      const existingIndex = array.findIndex(
        (p) =>
          p.sku === product?.sku &&
          p.warehouse_identifier === newWarehouseIdentifier
      );

      if (existingIndex !== -1) {
        const existing = array[existingIndex];
        const newQuantity = (existing.quantity ?? 0) + 1;

        array[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          total: newQuantity * Number(existing.price ?? wp?.price ?? 0),
        };
      } else {
        array.push({
          ...product,
          price: Number(wp?.price ?? product?.price ?? 0),
          quantity: 1,
          total: Number(wp?.price ?? product?.price ?? 0),
          warehouse_identifier: newWarehouseIdentifier,
          warehouse_id: newWarehouseId,
        });
      }
    },

    updateOrderPrice: (
      state,
      action: PayloadAction<{
        index: number;
        price: number;
        targetArray: ArrayStateKeys;
      }>
    ) => {
      const { index, price, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array) || !array[index]) return;
      const product = array[index];
      if (product.warehouse_products?.[0]) {
        product.warehouse_products[0].price = price;
      }
      product.total = price * Number(product.quantity ?? 0);
    },

    getProducts: (state, action: PayloadAction<OrderProduct[]>) => {
      state.productsQuery = action.payload;
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

    updateOneOrderPrice: (
      state,
      action: PayloadAction<{ sku: string; price: number }>
    ) => {
      const { sku, price } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;
      const item = edges.find((p) => p?.node?.sku === sku);
      if (item?.node) {
        item.node.price = price;
      }
    },

    updateOneOrderPrice2: (
      state,
      action: PayloadAction<{ id: string | number; price: number }>
    ) => {
      const { id, price } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;
      state.oneOrder.line_items!.edges = edges.map((item) =>
        item?.node?.id === id
          ? {
              ...item,
              node: {
                ...item.node,
                price,
              },
            }
          : item
      );
    },

    addTempProductToOrder: (state, action: PayloadAction<OrderProduct>) => {
      const product = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      const exists = edges.find((item) => item.node.sku === product.sku);

      if (!exists) {
        const newItem = {
          node: {
            id: `temp-${Date.now()}`,
            sku: product.sku,
            product_name: product.name,
            quantity: 1,
            price: Number(product?.warehouse_products?.[0]?.price ?? 0),
          },
        };

        edges.push(newItem);
      }
    },

    addTempProductToOrder2: (
      state,
      action: PayloadAction<{
        product: OrderProduct;
        price?: number;
        warehouse: { identifier?: string; id?: string | number };
      }>
    ) => {
      const { product, price, warehouse } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      const exists = edges.find(
        (item) =>
          item.node.sku === product.sku &&
          item.node.warehouse?.identifier === warehouse.identifier
      );

      if (!exists) {
        const newItem = {
          node: {
            id: `temp-${Date.now()}`,
            sku: product.sku,
            product_name: product.name,
            quantity: 1,
            price: Number(price ?? 0),
            warehouse: {
              identifier: warehouse.identifier,
              id: warehouse.id,
            },
          },
        };

        edges.push(newItem);
      }
    },

    removeTempProductBySku2: (
      state,
      action: PayloadAction<{ sku: string; warehouseId: string }>
    ) => {
      const { sku, warehouseId } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      state.oneOrder.line_items!.edges = edges.filter(
        (item) =>
          !(
            item.node.sku === sku &&
            item.node.warehouse?.identifier === warehouseId &&
            item.node.id?.startsWith("temp-")
          )
      );
    },

    removeTempProductBySku: (state, action: PayloadAction<string>) => {
      const skuToRemove = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      state.oneOrder.line_items!.edges = edges.filter(
        (item) =>
          item.node.sku !== skuToRemove || !item.node.id?.startsWith("temp-")
      );
    },

    updateOneOrderQuantity: (
      state,
      action: PayloadAction<{ sku: string; quantity: number }>
    ) => {
      const { sku, quantity } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      state.oneOrder.line_items!.edges = edges.map((item) =>
        item?.node?.sku === sku
          ? {
              ...item,
              node: {
                ...item.node,
                quantity,
              },
            }
          : item
      );
    },

    updateOneOrderQuantity2: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const edges = state.oneOrder?.line_items?.edges;
      if (!Array.isArray(edges)) return;

      state.oneOrder.line_items!.edges = edges.map((item) =>
        item?.node?.id === id
          ? {
              ...item,
              node: {
                ...item.node,
                quantity,
              },
            }
          : item
      );
    },

    updateOrderQuantity: (
      state,
      action: PayloadAction<{
        index: number;
        quantity: number;
        targetArray: ArrayStateKeys;
      }>
    ) => {
      const { index, quantity, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const product = array[index];
      if (product) {
        array[index] = {
          ...product,
          quantity,
          warehouse_products: product?.warehouse_products?.map((wp) => ({
            ...wp,
            price: Number(wp?.price),
          })),
          total:
            Number(quantity) *
            Number(
              product?.warehouse_products?.at(0)?.price ?? product.price ?? 0
            ),
        };
      }
    },

    addProductsListToEdit: (state, action: PayloadAction<OrderProduct[]>) => {
      state.productsEdite = action.payload;
    },

    updateOrderQuantityEdite: (
      state,
      action: PayloadAction<{
        index: number;
        quantity: number;
        targetArray: ArrayStateKeys;
      }>
    ) => {
      const { index, quantity, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;

      const product = array[index];
      if (product) {
        array[index] = {
          ...product,
          quantity,
          total: quantity * Number(product.price ?? 0),
        };
      }
    },

    removeFromOrder: (
      state,
      action: PayloadAction<{ index: number; targetArray: ArrayStateKeys }>
    ) => {
      const { index, targetArray } = action.payload;
      const array = state[targetArray];
      if (!Array.isArray(array)) return;
      array.splice(index, 1);
    },

    updateOneOrder: (state, action: PayloadAction<Partial<OneOrder>>) => {
      state.oneOrder = {
        ...state.oneOrder,
        ...action.payload,
      };
    },
  },
});

export const {
  _getOrders,
  _setOrdersCursor,
  _addOrder,
  addToOrder,
  addToOrder2,
  addProductsListToEdit,
  updateQuantity,
  updateOrderQuantity,
  updateOrderQuantityEdite,
  removeFromOrder,
  getProducts,
  updateOneOrderQuantity,
  updateOneOrderQuantity2,
  updateOneOrderPrice,
  updateOneOrderPrice2,
  clearTargetArray,
  addTempProductToOrder,
  addTempProductToOrder2,
  removeTempProductBySku,
  removeTempProductBySku2,
  updateOrderPrice,
  updateOneOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
