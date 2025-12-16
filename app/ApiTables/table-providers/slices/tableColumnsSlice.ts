import { createSlice } from "@reduxjs/toolkit";
import { formatTableColumns } from "../../table-utils/utils";

const initialState = {
    tableColumns: [] as any[],
    visibleColumns: [] as any[],
    selectedRows: [] as any[],
    selectedIds: [] as any[],
    toggledClearRows: false,
    rowSelectedModal: null,
};

const tableColumnsSlice = createSlice({
    name: "tableColumns",
    initialState,
    reducers: {
        _setSelectedRows: (state, action) => {
            state.selectedRows = action?.payload;
            state.selectedIds = action?.payload?.length > 0 ? action?.payload?.map((row: any) => row?.id) : [];
        },
        _setToggledClearRow: (state, action) => {
            state.toggledClearRows = action?.payload;
        },
        _setVisibleColumns: (state, action) => {
            state.visibleColumns = action?.payload;
            state.tableColumns = state.tableColumns?.map((col) => ({
                ...col,
                omit: action?.payload?.indexOf(col?.data_src) === -1,
            }));
        },
        _setRowSelectedModal: (state, action) => {
            state.rowSelectedModal = action?.payload;
        },
        _setTableColumns: (state, action) => {
            state.tableColumns = action?.payload?.update ? action?.payload?.cols : formatTableColumns(action?.payload?.cols, action?.payload?.tbData);
        },
        _resetTableColumns: (state) => {
            state.tableColumns = [];
            state.visibleColumns = [];
            state.selectedRows = [];
            state.selectedIds = [];
            state.toggledClearRows = false;
            state.rowSelectedModal = null;
        },
    },
});

export const { _setSelectedRows, _setToggledClearRow, _setVisibleColumns, _setRowSelectedModal, _setTableColumns, _resetTableColumns } =
    tableColumnsSlice.actions;

export default tableColumnsSlice.reducer;
