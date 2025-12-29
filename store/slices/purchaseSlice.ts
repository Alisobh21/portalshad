import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * عدّل الواجهة دي حسب شكل الـ Purchase Order الحقيقي عندك
 */
export interface PurchaseOrder {
  id: string;
  // أي حقول إضافية
}

interface PurchaseState {
  purchaseOrders: PurchaseOrder[];
  onePurchaseOrder: PurchaseOrder | null;
  purchaseCursor: string | null;
}

const initialState: PurchaseState = {
  purchaseOrders: [],
  onePurchaseOrder: null,
  purchaseCursor: null,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    _setPurchaseCursor: (state, action: PayloadAction<string | null>) => {
      state.purchaseCursor = action.payload;
    },

    getPurchaseOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.purchaseOrders = action.payload;
    },

    setOnePurchaseOrder: (
      state,
      action: PayloadAction<PurchaseOrder | null>
    ) => {
      state.onePurchaseOrder = action.payload;
    },
  },
});

export const { getPurchaseOrders, setOnePurchaseOrder, _setPurchaseCursor } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
