import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type HubArea = {
  id: string | number;
  hub_id?: string | number;
  aisles?: HubAisle[];
  [key: string]: unknown;
};

export type HubAisle = {
  id: string | number;
  area_id: string | number;
  hub_id?: string | number;
  [key: string]: unknown;
};

export type Hub = {
  id: string | number;
  areas?: HubArea[];
  [key: string]: unknown;
};

export interface HubsFetchingLoaders {
  getHubs: boolean;
  getHubsDepths: boolean;
  getCurrentHub: boolean;
}

export interface HubsState {
  hubs: Hub[];
  hubSlots: unknown[];
  currentHub: Hub | null;
  hubsFetchingLoaders: HubsFetchingLoaders;
  hubsDepths: unknown[];
}

const initialState: HubsState = {
  hubs: [],
  hubSlots: [],
  currentHub: null,
  hubsFetchingLoaders: {
    getHubs: true,
    getHubsDepths: true,
    getCurrentHub: true,
  },
  hubsDepths: [],
};

const hubsSlice = createSlice({
  name: "hubs",
  initialState,
  reducers: {
    _getAllHubs: (state, action: PayloadAction<Hub[]>) => {
      state.hubs = action.payload;
    },
    _getHubSlots: (state, action: PayloadAction<unknown[]>) => {
      state.hubSlots = action.payload;
    },
    _addNewSlot: (state, action: PayloadAction<unknown>) => {
      state.hubSlots.push(action.payload);
    },
    _getCurrentHub: (state, action: PayloadAction<Hub | null>) => {
      state.currentHub = action.payload;
      state.hubsFetchingLoaders = {
        ...state.hubsFetchingLoaders,
        getCurrentHub: false,
      };
    },
    _getHubDepth: (state, action: PayloadAction<unknown[]>) => {
      state.hubsDepths = action.payload;
      state.hubsFetchingLoaders = {
        ...state.hubsFetchingLoaders,
        getHubsDepths: false,
      };
    },
    _addNewHub: (state, action: PayloadAction<Hub>) => {
      state.hubs?.push(action.payload);
    },
    _deleteHub: (state, action: PayloadAction<Hub["id"]>) => {
      state.hubs = state.hubs.filter((hub) => hub?.id !== action.payload);
    },
    _toggleHubsLoaders: (
      state,
      action: PayloadAction<Partial<HubsFetchingLoaders>>
    ) => {
      state.hubsFetchingLoaders = {
        ...state.hubsFetchingLoaders,
        ...action.payload,
      };
    },
    _attachHubArea: (
      state,
      action: PayloadAction<HubArea & { hub_id?: Hub["id"] }>
    ) => {
      if (!state.currentHub) return;
      const currentHub = state.currentHub;

      state.currentHub = {
        ...currentHub,
        areas: [...(currentHub.areas ?? []), action.payload],
      };

      state.hubs = state.hubs?.map((hub) =>
        hub?.id === action.payload?.hub_id
          ? {
              ...hub,
              areas: [...(hub?.areas ?? []), action.payload],
            }
          : hub
      );
    },
    _deleteHubArea: (
      state,
      action: PayloadAction<{ areaId: HubArea["id"]; hubId: Hub["id"] }>
    ) => {
      if (!state.currentHub) return;
      const currentHub = state.currentHub;

      state.currentHub = {
        ...currentHub,
        areas: currentHub.areas?.filter(
          (area) => area?.id !== action.payload.areaId
        ),
      };

      state.hubs = state.hubs?.map((hub) =>
        hub?.id === action.payload.hubId
          ? {
              ...hub,
              areas: hub?.areas?.filter(
                (area) => area?.id !== action.payload.areaId
              ),
            }
          : hub
      );
    },
    _attachHubAisle: (
      state,
      action: PayloadAction<HubAisle & { hub_id?: Hub["id"] }>
    ) => {
      if (!state.currentHub) return;
      const currentHub = state.currentHub;

      state.currentHub = {
        ...currentHub,
        areas: currentHub.areas?.map((area) =>
          area?.id === action.payload?.area_id
            ? {
                ...area,
                aisles: [...(area?.aisles ?? []), action.payload],
              }
            : area
        ),
      };

      state.hubs = state.hubs?.map((hub) =>
        hub?.id === action.payload?.hub_id
          ? {
              ...hub,
              areas: hub?.areas?.map((area) =>
                area?.id === action.payload?.area_id
                  ? {
                      ...area,
                      aisles: [...(area?.aisles ?? []), action.payload],
                    }
                  : area
              ),
            }
          : hub
      );
    },
    _deleteHubAisle: (
      state,
      action: PayloadAction<{
        hubId: Hub["id"];
        area_id: HubArea["id"];
        id: HubAisle["id"];
      }>
    ) => {
      if (!state.currentHub) return;
      const currentHub = state.currentHub;

      state.currentHub = {
        ...currentHub,
        areas: currentHub.areas?.map((area) =>
          area?.id === action.payload.area_id
            ? {
                ...area,
                aisles: area?.aisles?.filter(
                  (aisle) => aisle?.id !== action.payload.id
                ),
              }
            : area
        ),
      };

      state.hubs = state.hubs?.map((hub) =>
        hub?.id === action.payload.hubId
          ? {
              ...hub,
              areas: hub?.areas?.map((area) =>
                area?.id === action.payload.area_id
                  ? {
                      ...area,
                      aisles: area?.aisles?.filter(
                        (aisle) => aisle?.id !== action.payload.id
                      ),
                    }
                  : area
              ),
            }
          : hub
      );
    },
  },
});

export const {
  _getAllHubs,
  _getHubDepth,
  _addNewHub,
  _deleteHub,
  _toggleHubsLoaders,
  _attachHubArea,
  _deleteHubArea,
  _attachHubAisle,
  _deleteHubAisle,
  _getCurrentHub,
  _getHubSlots,
  _addNewSlot,
} = hubsSlice.actions;

export default hubsSlice.reducer;
