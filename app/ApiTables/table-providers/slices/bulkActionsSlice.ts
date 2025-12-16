import { createSlice } from "@reduxjs/toolkit";
import { objectToArrayValue } from "../../table-utils/utils";

const initialState = {
    bulkActions: [] as any[],
    selectedBulkAction: null,
    bulkActionPostLoading: false,
    bulkActionPostResponse: null,
};

const bulkActionsSlice = createSlice({
    name: "bulkActions",
    initialState,
    reducers: {
        _getStructureBulkActions: (state, action) => {
            state.bulkActions = objectToArrayValue(action?.payload);
        },
        _getSelectedBulkAction: (state, action) => {
            state.selectedBulkAction = action?.payload;
        },
        _bulkActionPostLoading: (state, action) => {
            state.bulkActionPostLoading = action?.payload;
        },
        _bulkActionPostResponse: (state, action) => {
            state.bulkActionPostResponse = action?.payload;
        },
        _resetTableBulkActions: (state) => {
            state.bulkActions = [];
            state.selectedBulkAction = null;
            state.bulkActionPostLoading = false;
            state.bulkActionPostResponse = null;
        },
    },
});

export const { _getStructureBulkActions, _getSelectedBulkAction, _bulkActionPostLoading, _bulkActionPostResponse, _resetTableBulkActions } =
    bulkActionsSlice.actions;

export default bulkActionsSlice.reducer;
