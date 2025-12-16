"use client";

import React from "react";
import { formatDateNoTime } from "../table-utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { _setAppliedFilters, _setCurrentPage, _setRenderedFilters } from "../table-providers/slices/tableCoreSlice";
import { nanoid } from "@reduxjs/toolkit";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Filter {
    key: string;
    label: string;
    type: string;
    value: string;
    valueLable: string;
    props?: {
        operators: string[];
    };
}

interface TableCoreState {
    tableCore: {
        renderedFilters: Filter[];
    };
}

interface AppliedFiltersProps {
    setValue: (name: string, value: any, options?: object) => void;
    resetField: (name: string) => void;
}

function AppliedFilters({ setValue, resetField }: AppliedFiltersProps) {
    const { renderedFilters } = useSelector((state: TableCoreState) => state.tableCore);
    const dispatch = useDispatch();

    function handleClearRenderedFilters(key: string, props: Filter["props"], type: string) {
        const filteredRenderedFilters = renderedFilters?.filter((filter: Filter) => filter?.key !== key);
        if (type !== "date") {
            setValue(`${key}.fieldValue`, "", { shouldDirty: true, shouldValidate: true });
            setValue(`${key}.operator`, props?.operators[0], { shouldDirty: true, shouldValidate: true });
        } else {
            resetField(`${key}.fieldValue`);
        }

        dispatch(_setRenderedFilters(filteredRenderedFilters));
        dispatch(_setAppliedFilters(filteredRenderedFilters));
        dispatch(_setCurrentPage(1));
    }

    return (
        <>
            {renderedFilters?.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 p-0 mb-1 my-5">
                    <div className="text-sm font-bold me-2">Filter By</div>
                    {renderedFilters?.map((filter: Filter) => (
                        <div className="mb-1" key={nanoid()}>
                            <Badge variant="secondary" className="ps-2 pe-0.5 rounded-full border !border-foreground/30 dark:border-foreground/10">
                                <strong className="me-1">{filter?.label}:</strong>
                                <span>{filter?.type !== "date" ? filter?.valueLable : formatDateNoTime(filter?.value)}</span>

                                <Button
                                    variant="default"
                                    className="p-0 ms-3 !px-0 h-5 w-5 max-w-5 rounded-full hover:bg-destructive/10 dark:hover:bg-destructive/10 hover:text-destructive  bg-foreground dark:bg-foreground/10"
                                    onClick={() => handleClearRenderedFilters(filter?.key, filter?.props, filter?.type)}
                                >
                                    <X className="size-3" />
                                </Button>
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default AppliedFilters;
