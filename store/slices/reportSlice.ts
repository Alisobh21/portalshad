import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CarrierData {
  upload_data?: {
    validating_status?: string;
    validating_error?: string;
    is_processed?: boolean;
    file_name?: string;
    total_records_count?: number;
    cod_records_count?: number;
    processed_records_count?: number;
  };
  label?: string;
  logo?: string;
  url?: string;
}

interface ProcessingStatistics {
  TotalRecords?: { value?: number };
  UnprocessedRecordsCount?: { value?: number };
  ProcessedRecordsCount?: { value?: number };
  ProcessedThroughShippingCompanyReport?: { value?: number };
  ProcessedThroughManualEntryUpdate?: { value?: number };
  ProcessedThroughTrackingAPI?: { value?: number };
  CountOfUndefinedCarriersRecords?: { value?: number };
  ShippingCarriersIncludedInOriginalSheet?: { value?: string[] };
  SystemDefinedShippingCarriers?: {
    value?: Record<string, { label?: string }>;
  };
  UndefinedShippingCarriers?: { value?: Record<string, string> };
  Total3PLCustomersIncluded?: { value?: number };
}

interface ReportPayload {
  processing_statistics?: ProcessingStatistics;
  [key: string]: unknown;
}

export interface OneReport {
  payload?: ReportPayload;
  neededCarriers?: Record<string, CarrierData>;
  [key: string]: unknown;
}

interface ReportState {
  OneReport: OneReport | OneReport[] | null;
  neededCarriers: Record<string, CarrierData>;
  loadingOneReport: boolean;
}

const initialState: ReportState = {
  OneReport: null,
  neededCarriers: {},
  loadingOneReport: false,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    _getOneReport: (state, action: PayloadAction<OneReport | OneReport[]>) => {
      state.OneReport = action.payload;
    },
    _getNeededCarriers: (
      state,
      action: PayloadAction<Record<string, CarrierData>>
    ) => {
      state.neededCarriers = action.payload;
    },
    _setLoadingOneReport: (state, action: PayloadAction<boolean>) => {
      state.loadingOneReport = action.payload;
    },
  },
});

export const { _getOneReport, _setLoadingOneReport, _getNeededCarriers } =
  reportSlice.actions;

export default reportSlice.reducer;
