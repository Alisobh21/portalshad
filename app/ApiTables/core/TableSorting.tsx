"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { _setTableSorting } from "../table-providers/slices/tableCoreSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function TableSorting() {
    const { tableSorting } = useSelector((state: any) => state?.tableCore);
    const dispatch = useDispatch();

    function resetTableSorting() {
        dispatch(_setTableSorting({}));
    }

    return (
        <>
            {Object.keys(tableSorting)?.length > 0 && (
                <div className="my-3">
                    <div className="flex flex-wrap items-center gap-1 p-0 mb-1 pt-3">
                        <div className="text-sm font-bold me-2">Sorted By </div>
                        <Badge variant="secondary" className="ps-4 pe-0.5 rounded-full border !border-foreground/30 dark:border-foreground/10">
                            {tableSorting?.label}: {tableSorting?.direction}
                            <Button
                                variant="default"
                                className="p-0 ms-3 h-6 w-6 rounded-full hover:bg-destructive/10 dark:hover:bg-destructive/10 hover:text-destructive  bg-foreground dark:bg-foreground/10"
                                onClick={resetTableSorting}
                            >
                                <X className="size-3" />
                            </Button>
                        </Badge>
                    </div>
                </div>
            )}
        </>
    );
}

export default TableSorting;
