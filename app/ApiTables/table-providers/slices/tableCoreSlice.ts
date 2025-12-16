import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tableName: null,
    structureColumns: null,
    structureFilters: null,
    appliedFilters: [],
    renderedFilters: [],
    tableSorting: {},
    tableData: [],
    tableBindings: null,
    currentPage: 1,
    pageSize: 10,
    tablePagination: null,
    tableFetchingLoading: false,
    tableRefresher: 0,
};

const tableCoreSlice = createSlice({
    name: "tableCore",
    initialState,
    reducers: {
        _getTableComponents: (state, action) => {
            state.tableName = action?.payload?.tableName;
            state.structureColumns = action?.payload?.columns;
            state.structureFilters = action?.payload?.filters;
        },
        _setAppliedFilters: (state, action) => {
            state.appliedFilters = action?.payload?.reduce((acc: any, curr: any) => {
                acc[curr.key] = curr;
                return acc;
            }, {});
        },
        _setRenderedFilters: (state, action) => {
            state.renderedFilters = action?.payload;
        },
        _getTableData: (state, action) => {
            state.tableData = action?.payload;
        },
        _getTablePagination: (state, action) => {
            state.tablePagination = action?.payload;
        },
        _getTableBindings: (state, action) => {
            state.tableBindings = action?.payload;
        },
        _setTableLoading: (state, action) => {
            state.tableFetchingLoading = action?.payload;
        },
        _setCurrentPage: (state, action) => {
            state.currentPage = action?.payload;
        },
        _setTableSorting: (state, action) => {
            state.tableSorting = action?.payload;
        },
        _changePageSize: (state, action) => {
            state.pageSize = action?.payload;
        },
        _triggerTableReload: (state) => {
            state.tableRefresher = state.tableRefresher + 1;
        },
        _resetTableCore: (state) => {
            state.tableName = null;
            state.structureColumns = null;
            state.structureFilters = null;
            state.appliedFilters = [];
            state.renderedFilters = [];
            state.tableSorting = {};
            state.tableData = [];
            state.tableBindings = null;
            state.currentPage = 1;
            state.pageSize = 10;
            state.tablePagination = null;
            state.tableFetchingLoading = false;
            state.tableRefresher = 0;
        },
    },
});

export const {
    _getTableComponents,
    _setAppliedFilters,
    _setRenderedFilters,
    _getTableData,
    _getTablePagination,
    _getTableBindings,
    _setTableLoading,
    _setCurrentPage,
    _setTableSorting,
    _changePageSize,
    _triggerTableReload,
    _resetTableCore,
} = tableCoreSlice.actions;

export default tableCoreSlice.reducer;
