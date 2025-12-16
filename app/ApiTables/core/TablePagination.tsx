"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { _setCurrentPage } from "../table-providers/slices/tableCoreSlice";
import { useTranslations } from "next-intl";
import CustomPagination from "@/components/TablePagination";

interface TableCoreState {
    tableCore: {
        tablePagination: {
            total: number;
            from: number;
            to: number;
            last_page: number;
        };
        currentPage: number;
    };
}

function TablePagination() {
    const { tablePagination, currentPage } = useSelector((state: TableCoreState) => state.tableCore);
    const dispatch = useDispatch();
    const tApiTables = useTranslations("ApiTables");

    function setCurrentPageHandler(link: number) {
        dispatch(_setCurrentPage(Number(link)));
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-5 text-center lg:text-end">
            <div className="col">
                {tablePagination?.total > 0 && (
                    <CustomPagination
                        currentPage={currentPage}
                        lastPage={tablePagination.last_page}
                        totalRecords={tablePagination.total}
                        onPageChange={(page: number) => {
                            setCurrentPageHandler(page);
                        }}
                    />
                )}
            </div>
            <div className="text-muted-foreground text-center lg:text-end text-sm">
                <span> {tApiTables("show_results")} </span>
                <strong className="mx-1">{tablePagination?.from || 0}</strong>
                <span>{tApiTables("to_results")} </span>
                <strong className="mx-1">{tablePagination?.to || 0}</strong>
                <span> {tApiTables("from_results")}</span>
                <strong className="mx-1">{tablePagination?.total || 0}</strong>
                <span> {tApiTables("results")}</span>
            </div>
        </div>
    );
}

export default TablePagination;
