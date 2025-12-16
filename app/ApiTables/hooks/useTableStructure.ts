"use client";

import { axiosTable } from "@/axios/axios";
import { useState } from "react";
import { useLocale } from "next-intl";
import { _getTableData } from "../table-providers/slices/tableCoreSlice";
import { useDispatch } from "react-redux";

/**
 * Parameters for fetching table structure
 */
interface TableStructureParams {
  /** Name/identifier of the table */
  table: string;
  /** Optional additional parameters */
  params?: Record<string, unknown>;
}

/**
 * Response format from the table structure API
 */
interface TableStructureResponse {
  /** Table structure data */
  data: any; // Replace with more specific type if known
}

/**
 * Custom hook for managing table structure data
 *
 * Features:
 * - Fetches table structure from API
 * - Manages loading state
 * - Handles locale-specific requests
 * - Integrates with Redux for state management
 * - Provides error handling
 *
 * @returns Object containing:
 * - getTableStructure: Function to fetch table structure
 * - tableStructure: Current table structure data
 * - tableStructureLoading: Loading state boolean
 */
export default function useTableStructure() {
  const [tableStructure, setTableStructure] = useState<any>(null); // Replace any with specific type
  const [tableStructureLoading, setTableStructureLoading] = useState(true);
  const locale = useLocale();
  const dispatch = useDispatch();

  /**
   * Fetches table structure data from the API
   *
   * @param params - Object containing table name and optional parameters
   */
  const getTableStructure = async ({ table, params }: TableStructureParams) => {
    setTableStructureLoading(true);
    dispatch(_getTableData([]));
    try {
      const response = await axiosTable.get<TableStructureResponse>(table, {
        headers: {
          ...(locale && { ln: locale }),
        },
      });
      setTableStructure(response?.data);
      setTableStructureLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setTableStructureLoading(false);
    }
  };

  return { getTableStructure, tableStructure, tableStructureLoading };
}
