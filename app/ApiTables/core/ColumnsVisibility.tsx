"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { _setVisibleColumns } from "../table-providers/slices/tableColumnsSlice";
import { FiChevronDown } from "react-icons/fi";
import { RiEyeCloseFill } from "react-icons/ri";
import { useTranslations } from "next-intl";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useSecureLS from "@/hooks/useSecureLS";

interface TableColumn {
    data_src: string;
    name: string;
}

interface RootState {
    tableCore: {
        tableName: string;
    };
    tableColumns: {
        tableColumns: TableColumn[];
        visibleColumns: string[];
    };
}

function ColumnsVisibility() {
    const { tableName } = useSelector((state: RootState) => state.tableCore);
    const { tableColumns, visibleColumns } = useSelector((state: RootState) => state.tableColumns);
    const dispatch = useDispatch();
    const tApiTables = useTranslations("ApiTables");
    const { set } = useSecureLS();

    function toggleColumnVisibility(value: boolean, data_src: string, tableName: string) {
        let columns = [...visibleColumns];
        if (value === true) {
            columns = [...visibleColumns, data_src];
        } else {
            columns = columns.filter((col) => col !== data_src);
        }
        dispatch(_setVisibleColumns(columns));
        set(`${tableName}_tb`, JSON.stringify(columns));
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-full sm:w-auto" variant="outline">
                    <RiEyeCloseFill />
                    {tApiTables("columns")}
                    <FiChevronDown className="ms-auto" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-4 flex flex-col gap-1">
                {tableColumns?.map((col: TableColumn, index: number) => {
                    return (
                        <div className="flex items-center gap-2" key={index}>
                            <Checkbox
                                className="cursor-pointer"
                                checked={visibleColumns?.indexOf(col.data_src) !== -1}
                                onCheckedChange={(checked) => toggleColumnVisibility(checked as boolean, col.data_src, tableName)}
                                id={col.data_src}
                            />
                            <label htmlFor={col.data_src} className="text-sm cursor-pointer">
                                {col.name}
                            </label>
                        </div>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}

export default ColumnsVisibility;
