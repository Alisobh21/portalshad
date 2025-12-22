import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatDateNoTime } from "../../helpers/utils";

// Type definitions
interface SelectedDates {
  from: string | null;
  to: string | null;
}

interface Column {
  id: string;
  title: string;
  name: string;
  omit?: boolean;
  [key: string]: unknown;
}

interface MainState {
  filterText: string;
  columns: Column[];
  loadingColumns: boolean;
  selectedDates: SelectedDates;
}

const initialState: MainState = {
  filterText: "",
  columns: [],
  loadingColumns: true,
  selectedDates: {
    from: formatDateNoTime(new Date().getTime()),
    to: formatDateNoTime(new Date().getTime()),
  },
  // selectedDates: {
  //     from: null,
  //     to: null,
  // },
};

const mainSlice = createSlice({
  name: "regularTablesSlice",
  initialState,
  reducers: {
    _setSelectedDates: (state, action: PayloadAction<SelectedDates>) => {
      state.selectedDates = action.payload;
    },
    _setFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload;
    },
    _setTableColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    _toggleLoadingColumns: (state, action: PayloadAction<boolean>) => {
      state.loadingColumns = action.payload;
    },
  },
});

export const {
  _setSelectedDates,
  _setFilterText,
  _setTableColumns,
  _toggleLoadingColumns,
} = mainSlice.actions;

export default mainSlice.reducer;

// Export types for use in components
export type { MainState, SelectedDates, Column };
