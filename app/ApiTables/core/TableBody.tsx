/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { Checkbox } from "../general-components/Checkbox";
import { TableLoader } from "../general-components/Loaders";
import { HiChevronUpDown } from "react-icons/hi2";

import ExpandedRow from "./ExpandedRow";
import { useDispatch, useSelector } from "react-redux";
import { _setTableSorting } from "../table-providers/slices/tableCoreSlice";
import { _setSelectedRows, _setTableColumns, _setVisibleColumns } from "../table-providers/slices/tableColumnsSlice";
import { useTranslations } from "next-intl";
import useSecureLS from "@/hooks/useSecureLS";

interface Column {
    name: string;
    colIdentifier: string;
    showable?: boolean;
    data_src: string;
}

interface Action {
    applicableAsBulkAction?: boolean;
}

interface RootState {
    bulkActions: {
        bulkActions: any[];
    };
    rowActions: {
        structureRowActions: Action[];
        actionsInRegularCells: any;
    };
    tableColumns: {
        tableColumns: any[];
        toggledClearRows: boolean;
    };
    tableCore: {
        tableData: any[];
        tableFetchingLoading: boolean;
        pageSize: number;
        structureColumns: Column[];
        tableName: string;
    };
}

function TableBody() {
    const { bulkActions } = useSelector((state: RootState) => state.bulkActions);
    const { structureRowActions, actionsInRegularCells } = useSelector((state: RootState) => state.rowActions);
    const { tableColumns, toggledClearRows } = useSelector((state: RootState) => state.tableColumns);
    const { tableData, tableFetchingLoading, pageSize, structureColumns, tableName } = useSelector((state: RootState) => state.tableCore);
    const dispatch = useDispatch();
    const tApiTables = useTranslations("ApiTables");
    const { get } = useSecureLS();

    function sortingTableHandler(column: Column, sortDirection: string) {
        dispatch(_setTableSorting({ label: column?.name, direction: sortDirection, [column?.colIdentifier]: sortDirection }));
    }

    useEffect(() => {
        dispatch(_setTableColumns({ cols: structureColumns?.filter((col: Column) => col?.showable), tbData: tableData }));
        if (!get(`${tableName}_tb`)) {
            dispatch(_setVisibleColumns(structureColumns?.map((col: Column) => col?.data_src)));
        } else {
            dispatch(_setVisibleColumns(JSON.parse(get(`${tableName}_tb`))));
        }
    }, [structureColumns, tableData]);

    return (
        <>
            <div className="rdt-table-holder static">
                <div className={`table-scrollable-holder text-nowrap static`}>
                    <DataTable
                        className="text-nowrap"
                        columns={tableColumns}
                        data={tableData}
                        expandableRows
                        expandableRowsComponent={ExpandedRow}
                        responsive
                        progressPending={tableFetchingLoading}
                        progressComponent={<TableLoader count={Number(pageSize)} />}
                        sortIcon={<HiChevronUpDown className="me-1" />}
                        selectableRowsComponent={Checkbox as any}
                        sortServer
                        onSort={sortingTableHandler as any}
                        noDataComponent={
                            <div className="py-4 text-foreground bg-neutral-100 dark:bg-neutral-800 px-4 w-full text-start lg:text-center">
                                {tApiTables("no_results")}
                            </div>
                        }
                        persistTableHead={true}
                        selectableRows={
                            !tableFetchingLoading &&
                            (bulkActions.length > 0 || structureRowActions?.filter((action: Action) => action?.applicableAsBulkAction)?.length > 0)
                                ? true
                                : false
                        }
                        onSelectedRowsChange={({ selectedRows }) => dispatch(_setSelectedRows(selectedRows))}
                        clearSelectedRows={!toggledClearRows}
                    />
                </div>
            </div>
        </>
    );
}

export default TableBody;
