"use client";

import React, { useState } from "react";
import TableFilters from "./core/TableFilters";
import TableBody from "./core/TableBody";
import TablePagination from "./core/TablePagination";
import TableSorting from "./core/TableSorting";
import TablePageSize from "./core/TablePageSize";
import ColumnsVisibility from "./core/ColumnsVisibility";
import ActionsOfSelections from "./core/ActionsOfSelection";
import ApiTablesModals from "./table-modals/ApiTablesModals";
import { useSelector } from "react-redux";
import TableBulkActions from "./core/TableBulkActions";
import FilterTrigger from "./core/FilterTrigger";

/**
 * ApiTablesComponent is a comprehensive data table component that provides advanced functionality
 * for displaying and managing tabular data.
 *
 * Features:
 * - Filtering: Allows users to filter table data using customizable filter conditions
 * - Sorting: Enables column-based sorting of table data
 * - Bulk Actions: Supports performing actions on multiple selected rows
 * - Column Visibility: Users can show/hide specific columns
 * - Pagination: Breaks down large datasets into manageable pages
 * - Page Size Control: Allows users to adjust number of rows per page
 * - Custom Elements: Supports injection of custom UI elements
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.customElement - Optional custom element to render above the table
 *
 * @example
 * ```jsx
 * <ApiTablesComponent customElement={<CustomHeader />} />
 * ```
 */
function ApiTablesComponent({ customElement }: any) {
    // Redux selectors for accessing global state
    const { bulkActions } = useSelector((state: any) => state?.bulkActions);
    const { structureFilters } = useSelector((state: any) => state?.tableCore);
    const { selectedRows } = useSelector((state: any) => state?.tableColumns);

    // Local state for managing filters visibility
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            {/* Render filters panel if filters are configured */}
            {structureFilters && structureFilters?.length > 0 && <TableFilters showFilters={showFilters} setShowFilters={setShowFilters} />}

            {/* Table sorting controls */}
            <TableSorting />

            <div className="flex mb-4 items-end justify-center lg:justify-between pt-5">
                <ul className="flex w-full flex-col sm:flex-row sm:justify-between items-center gap-3">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:w-auto">
                        {/* Render bulk actions if available */}
                        {bulkActions?.length > 0 && <TableBulkActions />}
                        <ColumnsVisibility />
                        {structureFilters?.length > 0 && <FilterTrigger showFilters={showFilters} setShowFilters={setShowFilters} />}
                    </div>

                    {/* Page size selector */}
                    <li className="w-full sm:w-fit">
                        <TablePageSize />
                    </li>
                </ul>
            </div>

            {/* Render custom element if provided */}
            {customElement && <div className="py-2"> {customElement} </div>}

            {/* Show selected rows count */}
            {selectedRows.length > 0 && (
                <div className="text-center text-sm text-muted mb-1">
                    <strong className="fw-bold mx-1">{selectedRows?.length}</strong>
                </div>
            )}

            {/* Actions for selected rows */}
            <ActionsOfSelections />

            {/* Main table content */}
            <TableBody />

            {/* Pagination controls */}
            <TablePagination />

            {/* Modal dialogs for table operations */}
            <ApiTablesModals />
        </>
    );
}

export default ApiTablesComponent;
