import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Carrier = string;
type Country = { id: string | number; name: string };
type Supplier = { id: string | number; name: string };
type Warehouse = { id: string | number; name: string };
type ShippingMethod = { id: string | number; name: string };
type AppEnums = Record<string, unknown> | null;
type AppNavigator = "web" | "mobile" | string;

interface AppState {
  currentPage: string | null;
  countries: Country[];
  carriers: Carrier[];
  suppliers: Supplier[];
  loadingSuppliers: boolean;
  loadingCountries: boolean;
  warehouses: Warehouse[];
  warehousesList: Warehouse[];
  loadingWarehousesList: boolean;
  loadingWarehouses: boolean;
  shippingMethods: ShippingMethod[];
  loadingShippingMethods: boolean;
  enums: AppEnums;
  showSidebar: boolean;
  expandSidebar: boolean;
  currencies: string[];
  mainFetchingLoader: boolean;
  mainFetchingLoaderMsg: string;
  mainFetchingicon?: string;
  outScopeTableRefresher: number;
  appNavigator: AppNavigator;
  showNotificationsPopup: boolean;
}

const initialState: AppState = {
  currentPage: null,
  countries: [],
  carriers: [],
  suppliers: [],
  loadingSuppliers: false,
  loadingCountries: false,
  warehouses: [],
  warehousesList: [],
  loadingWarehousesList: false,
  loadingWarehouses: false,
  shippingMethods: [],
  loadingShippingMethods: false,
  enums: null,
  showSidebar: false,
  expandSidebar: true,
  currencies: ["SAR", "EGP", "EDH"],
  mainFetchingLoader: false,
  mainFetchingLoaderMsg: "جاري معالجة البيانات",
  outScopeTableRefresher: 0,
  appNavigator: "web",
  showNotificationsPopup: true,
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    _getCurrentPage: (state, action: PayloadAction<string | null>) => {
      state.currentPage = action.payload;
    },
    _getAppEnums: (state, action: PayloadAction<AppEnums>) => {
      state.enums = action.payload;
    },
    _getCarriers: (state, action: PayloadAction<Carrier[]>) => {
      state.carriers = action.payload;
    },
    _setMainLoader: (
      state,
      action: PayloadAction<{
        loader: boolean;
        msg?: string;
        icon?: string;
      }>
    ) => {
      state.mainFetchingLoader = action.payload.loader;
      state.mainFetchingLoaderMsg =
        action.payload.msg || "جاري معالجة البيانات";
      state.mainFetchingicon = action.payload.icon;
    },
    _triggerOutscopeTableRefresher: (state) => {
      state.outScopeTableRefresher += 1;
    },
    _toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    _expandSidebar: (state, action: PayloadAction<boolean | undefined>) => {
      if (typeof action.payload === "undefined") {
        state.expandSidebar = !state.expandSidebar;
      } else {
        state.expandSidebar = action.payload;
      }
    },
    _getAppNavigator: (state, action: PayloadAction<string>) => {
      state.appNavigator = action.payload;
    },
    _toggleNotificationsModal: (state, action: PayloadAction<boolean>) => {
      state.showNotificationsPopup = action.payload;
    },
    addCountries: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload;
    },
    setLoadingCountriess: (state, action: PayloadAction<boolean>) => {
      state.loadingCountries = action.payload;
    },
    addWarehouses: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehouses = action.payload;
    },
    addWarehousesList: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehousesList = action.payload;
    },
    setLoadingWarehouses: (state, action: PayloadAction<boolean>) => {
      state.loadingWarehouses = action.payload;
    },
    setLoadingWarehousesList: (state, action: PayloadAction<boolean>) => {
      state.loadingWarehousesList = action.payload;
    },
    addShippingMethods: (state, action: PayloadAction<ShippingMethod[]>) => {
      state.shippingMethods = action.payload;
    },
    setLoadingloadingShippings: (state, action: PayloadAction<boolean>) => {
      state.loadingShippingMethods = action.payload;
    },
    addSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload;
    },
    setLoadingSuppliers: (state, action: PayloadAction<boolean>) => {
      state.loadingSuppliers = action.payload;
    },
  },
});

export const {
  _getCurrentPage,
  _getAppEnums,
  _setMainLoader,
  _triggerOutscopeTableRefresher,
  _toggleSidebar,
  _expandSidebar,
  _getAppNavigator,
  _toggleNotificationsModal,
  _getCarriers,
  addCountries,
  setLoadingCountriess,
  addWarehouses,
  addWarehousesList,
  setLoadingWarehouses,
  setLoadingWarehousesList,
  addShippingMethods,
  setLoadingloadingShippings,
  addSuppliers,
  setLoadingSuppliers,
} = appSlice.actions;

export default appSlice.reducer;
