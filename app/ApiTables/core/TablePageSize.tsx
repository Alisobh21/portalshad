"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { _changePageSize, _setCurrentPage } from "../table-providers/slices/tableCoreSlice";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TableCoreState {
    tableCore: {
        pageSize: number;
    };
}

function TablePageSize() {
    const { pageSize } = useSelector((state: TableCoreState) => state.tableCore);
    const dispatch = useDispatch();

    function changePageSize(value: number) {
        dispatch(_changePageSize(value));
        dispatch(_setCurrentPage(1));
    }

    return (
        <div className="w-full sm:w-[90px]">
            <Select onValueChange={(value) => changePageSize(Number(value))} defaultValue={`${pageSize}`}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value={"10"}>10</SelectItem>
                        <SelectItem value={"25"}>25</SelectItem>
                        <SelectItem value={"50"}>50</SelectItem>
                        <SelectItem value={"100"}>100</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default TablePageSize;
