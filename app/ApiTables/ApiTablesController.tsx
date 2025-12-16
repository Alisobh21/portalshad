"use client";

import React, { useEffect } from "react";
import ApiTablesComponent from "./ApiTablesComponent";
import useTableFetcher from "./hooks/useTableFetcher";
import { useDispatch, useSelector } from "react-redux";
import { _changePageSize, _getTableComponents, _resetTableCore } from "./table-providers/slices/tableCoreSlice";
import { _getStructureBulkActions, _resetTableBulkActions } from "./table-providers/slices/bulkActionsSlice";
import { _checkActionsInRegularCells, _getStructureRowActions, _resetTableRowActions } from "./table-providers/slices/rowActionsSlice";
import { getExternalState } from "./table-providers/store";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { _resetTableColumns } from "./table-providers/slices/tableColumnsSlice";

/**
 * ApiTablesController is the main controller component for the API Tables functionality.
 * It handles the initialization, data fetching, and state management for the data table.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.table - Configuration object for the table structure and behavior
 * @param {Object} props.params - Additional parameters to be passed to the table fetching logic
 * @param {React.ReactNode} props.customElement - Optional custom element to be rendered in the table
 *
 * Features:
 * - Initializes table components, bulk actions, and row actions
 * - Manages table state through Redux
 * - Handles data fetching with pagination, filtering, and sorting
 * - Supports internationalization
 * - Provides cleanup on unmount
 *
 * @example
 * ```jsx
 * <ApiTablesController
 *   table={tableConfig}
 *   params={{ filter: 'active' }}
 *   customElement={<CustomHeader />}
 * />
 * ```
 */
function ApiTablesController({ table, params, customElement }: any) {
    const dispatch = useDispatch();
    const externalState = getExternalState();
    const t = useTranslations("General");
    const { appliedFilters, currentPage, tableSorting, pageSize, tableName, tableData, tableRefresher } = useSelector(
        (state: any) => state?.tableCore
    );
    const pathname = usePathname();

    const { tableFetchingHandler } = useTableFetcher();

    /**
     * Flattens multi-cell actions into a single array
     * @param {Object} rowActions - Row actions configuration object
     * @returns {Array} Flattened array of actions
     */
    function flattenMultiCellsActions(rowActions: any) {
        if (rowActions && Object.keys(rowActions)?.filter((key) => key === "general_actions")?.length > 0) {
            return Object.values(rowActions as any)
                ?.map((object: any) => Object.values(object))
                ?.reduce((acc: any, val: any) => {
                    return acc?.concat(val);
                }, []);
        } else {
            return rowActions;
        }
    }

    /**
     * Checks if actions are configured in regular cells
     * @param {Object} rowActions - Row actions configuration object
     * @returns {boolean} True if actions are in regular cells
     */
    function checkActionsInRegularCells(rowActions: any) {
        return rowActions && Object.keys(rowActions)?.filter((key) => key === "general_actions")?.length > 0;
    }

    // Initialize table components and actions
    useEffect(() => {
        dispatch(_getTableComponents({ ...table }));
        dispatch(_getStructureBulkActions(table?.bulkActions));
        dispatch(_getStructureRowActions(flattenMultiCellsActions(table?.rowActions)));

        if (checkActionsInRegularCells(table?.rowActions)) {
            dispatch(_checkActionsInRegularCells(true));
        }

        return () => {
            dispatch(_resetTableBulkActions());
            dispatch(_resetTableColumns());
            dispatch(_resetTableCore());
            dispatch(_resetTableRowActions());
        };
    }, [table]);

    // Set initial page size
    useEffect(() => {
        dispatch(_changePageSize(10));
    }, []);

    // Handle data fetching
    useEffect(() => {
        const controller = new AbortController();
        if (tableName) {
            tableFetchingHandler({
                tableName,
                currentPage,
                pageSize,
                appliedFilters,
                tableSorting,
                signal: controller.signal,
                params,
                tbData: tableData,
            });
        }

        return () => {
            controller.abort();
        };
    }, [tableName, currentPage, pageSize, appliedFilters, tableSorting, tableRefresher, pathname]);

    return <ApiTablesComponent customElement={customElement} />;
}

export default ApiTablesController;
