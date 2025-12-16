import { createSlice } from "@reduxjs/toolkit";
import { objectToArrayValue } from "../../table-utils/utils";

const initialState = {
    structureRowActions: [] as any[],
    selectedRowActions: [] as any[],
    clickedRowAction: null,
    rowActionPostLoading: false,
    clickedRowActionResponse: null,
    customControlAction: null,
    actionsInRegularCells: false,
    clickedRowActionId: null,
};

const rowActionsSlice = createSlice({
    name: "rowActions",
    initialState,
    reducers: {
        _getStructureRowActions: (state, action) => {
            state.structureRowActions = objectToArrayValue(action?.payload);
        },
        _checkActionsInRegularCells: (state, action) => {
            state.actionsInRegularCells = action.payload;
        },
        _getSelectedRowActions: (state, action) => {
            state.selectedRowActions = objectToArrayValue(action?.payload)?.filter((action: any) => action?.applicableAsBulkAction);
        },
        _setRowActionPostLoading: (state, action) => {
            state.rowActionPostLoading = action?.payload;
        },
        _getClickedRowAction: (state, action) => {
            state.clickedRowAction = action?.payload;
        },
        _getClickedRowActionId: (state, action) => {
            state.clickedRowActionId = action?.payload;
        },
        _getClickedRowActionResponse: (state, action) => {
            state.clickedRowActionResponse = action?.payload;
        },
        _getCustomControlRequest: (state, action) => {
            state.customControlAction = action?.payload;
        },
        _resetTableRowActions: (state) => {
            state.structureRowActions = [];
            state.selectedRowActions = [];
            state.clickedRowAction = null;
            state.rowActionPostLoading = false;
            state.clickedRowActionResponse = null;
            state.customControlAction = null;
            state.actionsInRegularCells = false;
            state.clickedRowActionId = null;
        },
    },
});

export const {
    _getStructureRowActions,
    _checkActionsInRegularCells,
    _getSelectedRowActions,
    _setRowActionPostLoading,
    _getClickedRowAction,
    _getClickedRowActionId,
    _getClickedRowActionResponse,
    _getCustomControlRequest,
    _resetTableRowActions,
} = rowActionsSlice.actions;

export default rowActionsSlice.reducer;
