import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WithId = {
  id?: string | number;
  [key: string]: unknown;
};

export type Country = WithId;
export type City = WithId;
export type Address = WithId & { selected?: boolean };

export interface GeolocationLoaders {
  getAddresses: boolean;
  insertingAddress: boolean;
  getConsigneeAddresses: boolean;
}

export interface GeolocationState {
  countries: Country[];
  addresses: Address[];
  returnAddresses: Address[];
  returnConsigneeAddresses: Address[];
  consigneeAddresses: Address[];
  userCities: City[];
  consigneePairableCities: City[];
  returnConsigneePairableCities: City[];
  addressInsertionType: string | null;
  loaders: GeolocationLoaders;
}

const initialState: GeolocationState = {
  countries: [],
  addresses: [],
  returnAddresses: [],
  returnConsigneeAddresses: [],
  consigneeAddresses: [],
  userCities: [],
  consigneePairableCities: [],
  returnConsigneePairableCities: [],
  addressInsertionType: null,
  loaders: {
    getAddresses: true,
    insertingAddress: false,
    getConsigneeAddresses: false,
  },
};

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    _getCountries: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload;
    },
    _getUserCities: (state, action: PayloadAction<City[]>) => {
      state.userCities = action.payload;
    },
    _getUserAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    _getUserReturnAddresses: (state, action: PayloadAction<Address[]>) => {
      state.returnAddresses = action.payload;
    },
    _getConsigneeAddresses: (state, action: PayloadAction<Address[]>) => {
      state.consigneeAddresses = action.payload;
    },
    _getReturnConsigneeAddresses: (state, action: PayloadAction<Address[]>) => {
      state.returnConsigneeAddresses = action.payload;
    },
    _insertNewAddress: (state, action: PayloadAction<Address[]>) => {
      const incoming = action.payload;
      state.addresses = [
        ...incoming,
        ...state.addresses.filter(
          (address) => !incoming.some((add) => add.id === address.id)
        ),
      ];
    },
    _getConsigneePairableCities: (state, action: PayloadAction<City[]>) => {
      state.consigneePairableCities = action.payload;
    },
    _getReturnConsigneePairableCities: (
      state,
      action: PayloadAction<City[]>
    ) => {
      state.returnConsigneePairableCities = action.payload;
    },
    _insertReturnAddress: (state, action: PayloadAction<Address[]>) => {
      const incoming = action.payload;
      state.returnAddresses = [
        ...incoming,
        ...state.returnAddresses
          .filter((address) => !incoming.some((add) => add.id === address.id))
          .map((address) => ({ ...address, selected: false })),
      ];
    },
    _insertReturnConsigneeAddress: (
      state,
      action: PayloadAction<Address[]>
    ) => {
      const incoming = action.payload;
      state.returnConsigneeAddresses = [
        ...incoming,
        ...state.returnConsigneeAddresses.filter(
          (address) => !incoming.some((add) => add.id === address.id)
        ),
      ];
    },
    _insertNewConsigneeAddress: (state, action: PayloadAction<Address[]>) => {
      const incoming = action.payload;
      state.consigneeAddresses = [
        ...incoming,
        ...state.consigneeAddresses.filter(
          (address) => !incoming.some((add) => add.id === address.id)
        ),
      ];
    },
    _setAddressInsertionType: (state, action: PayloadAction<string | null>) => {
      state.addressInsertionType = action.payload;
    },
    _toggleGeoloactionLoaders: (
      state,
      action: PayloadAction<{
        key: keyof GeolocationLoaders;
        value: boolean;
      }>
    ) => {
      state.loaders = {
        ...state.loaders,
        [action.payload.key]: action.payload.value,
      };
    },
  },
});

export const {
  _getCountries,
  _getUserAddresses,
  _getUserCities,
  _toggleGeoloactionLoaders,
  _insertNewAddress,
  _setAddressInsertionType,
  _getConsigneeAddresses,
  _insertNewConsigneeAddress,
  _getUserReturnAddresses,
  _getReturnConsigneeAddresses,
  _getConsigneePairableCities,
  _getReturnConsigneePairableCities,
  _insertReturnConsigneeAddress,
  _insertReturnAddress,
} = geolocationSlice.actions;

export default geolocationSlice.reducer;
