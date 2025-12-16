"use client";

import axios from "axios";
import { handleNetworkErrors } from "../table-utils/errorHandling";
import { calculateMinWidth, rowWithLongestField } from "../table-utils/utils";
import { axiosTable } from "@/axios/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  _getTableBindings,
  _getTableData,
  _getTablePagination,
  _setTableLoading,
} from "../table-providers/slices/tableCoreSlice";
import {
  _setSelectedRows,
  _setTableColumns,
  _setToggledClearRow,
} from "../table-providers/slices/tableColumnsSlice";

/**
 * Interface representing a table column configuration
 */
interface TableColumn {
  /** Source field name in the data */
  data_src: string;
  /** Display name of the column */
  name: string;
  /** Data type of the column */
  type: string;
  /** Optional styling for the column */
  style?: {
    width: string;
  };
}

/**
 * Interface representing the table state in Redux store
 */
interface TableState {
  tableColumns: {
    /** Array of table column configurations */
    tableColumns: TableColumn[];
    /** Flag to track row clearing state */
    toggledClearRows: boolean;
  };
}

/**
 * Interface for parameters required by table fetching function
 */
interface TableFetcherParams {
  /** Name of the table to fetch */
  tableName: string;
  /** AbortSignal for cancelling requests */
  signal: AbortSignal;
  /** Number of items per page */
  pageSize: number;
  /** Current page number */
  currentPage: number;
  /** Applied filter conditions */
  appliedFilters: Record<string, unknown>;
  /** Sorting configuration */
  tableSorting: Record<string, unknown>;
  /** Optional additional parameters */
  params?: Record<string, unknown>;
  /** Table data array */
  tbData: unknown[];
}

/**
 * Custom hook for handling table data fetching operations
 *
 * Features:
 * - Manages table data fetching and state updates
 * - Handles pagination, filtering, and sorting
 * - Updates column widths based on content
 * - Manages loading states and error handling
 * - Integrates with Redux for state management
 *
 * @returns Object containing the table fetching handler function
 */
const useTableFetcher = () => {
  const dispatch = useDispatch();
  const { tableColumns, toggledClearRows } = useSelector(
    (state: TableState) => state.tableColumns
  );

  /**
   * Handles fetching table data and updating related states
   *
   * @param params - Object containing all required parameters for fetching table data
   */
  async function tableFetchingHandler({
    tableName,
    signal,
    pageSize,
    currentPage,
    appliedFilters,
    tableSorting,
    params,
    tbData,
  }: TableFetcherParams) {
    dispatch(_setSelectedRows([]));
    dispatch(_setTableLoading(true));
    dispatch(_getTableData([]));
    dispatch(_setToggledClearRow(!toggledClearRows));
    try {
      const response = await axiosTable({
        method: "POST",
        url: `/control-tables/query-table/${tableName}`,
        data: {
          perPage: pageSize,
          page: currentPage,
          filters: appliedFilters,
          sorts: tableSorting,
          ...(params ? { params } : {}),
        },
        signal,
      });
      if (tableColumns) {
        dispatch(
          _setTableColumns({
            update: true,
            cols: tableColumns?.map((col: TableColumn) => ({
              ...col,
              style: {
                width: calculateMinWidth(
                  rowWithLongestField(response?.data?.items, col?.data_src),
                  col?.name,
                  col?.type
                ),
              },
            })),
            tbData,
          })
        );
      }
      dispatch(_getTableData(response?.data?.items));
      dispatch(_getTablePagination(response?.data?.pagination));
      dispatch(_getTableBindings(response?.data?.bindings));
      dispatch(_setTableLoading(false));
    } catch (err) {
      handleNetworkErrors(err as any);
      if (axios.isCancel(err)) {
        dispatch(_setTableLoading(true));
      } else {
        dispatch(_setTableLoading(false));
      }
    }
  }

  return { tableFetchingHandler };
};

export default useTableFetcher;
