"use client";

import React, { useEffect, useMemo } from "react";
import { downloadURL } from "../table-utils/utils";
import { useDispatch, useSelector } from "react-redux";
import useUtilsProvider from "../table-providers/useUtilsProvider";
import { _bulkActionPostResponse, _getSelectedBulkAction } from "../table-providers/slices/bulkActionsSlice";
import { FiChevronDown } from "react-icons/fi";
import { PiGearFill } from "react-icons/pi";
import { useTranslations } from "next-intl";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Action {
    action_key: string;
    label: string;
    method: string;
    action: {
        api: string;
    };
    payload_keys?: string[];
    need_confirmation?: boolean;
}

interface RootState {
    tableColumns: {
        selectedIds: string[];
    };
    bulkActions: {
        bulkActions: Action[];
        bulkActionPostResponse: {
            success: boolean;
            type: string;
            data: {
                url: string;
            };
            file_name: string;
            onSuccess: string;
        } | null;
    };
    tableCore: {
        tableData: any[];
        tableFetchingLoading: boolean;
        appliedFilters: any;
        triggerTableReload: () => void;
    };
}

function TableBulkActions() {
    const { selectedIds } = useSelector((state: RootState) => state.tableColumns);
    const { bulkActions, bulkActionPostResponse } = useSelector((state: RootState) => state.bulkActions);
    const { tableData, tableFetchingLoading, appliedFilters, triggerTableReload } = useSelector((state: RootState) => state.tableCore);
    const { bulkActionsPostHandler } = useUtilsProvider();
    const dispatch = useDispatch();
    const tApiTables = useTranslations("ApiTables");

    // ... 🐼 Disable Bulk Actions Indicator
    const disableBulkActions = useMemo(() => {
        return !tableData || tableData?.length === 0 || tableFetchingLoading;
    }, [tableData, tableFetchingLoading]);

    // ... 🐼 Check if the bulk action needs a modal form
    const requireModal = (action: Action) => {
        return false;
        // (
        //     (action?.payload_keys?.filter((key: string) => key !== "filters" && key !== "selected_ids")?.length ?? 0) > 0 || action?.need_confirmation
        // );
    };

    // ... 🐼 Handle bulk action response
    useEffect(() => {
        if (bulkActionPostResponse?.success && bulkActionPostResponse?.type === "stream") {
            downloadURL(bulkActionPostResponse?.data?.url, bulkActionPostResponse?.file_name);
        }
        if (bulkActionPostResponse?.success && bulkActionPostResponse?.onSuccess === "refetchData") {
            triggerTableReload();
        }
        if (bulkActionPostResponse?.success && bulkActionPostResponse?.onSuccess === "reload") {
            triggerTableReload();
        }
        dispatch(_bulkActionPostResponse(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulkActionPostResponse]);

    // ... 🐼 Bulk Action API Post Handler
    function fireBulkAction(action: Action) {
        console.log("action", action);
        if (requireModal(action)) {
            console.log("action", action);
            dispatch(_getSelectedBulkAction(action));
        } else {
            console.log("action", action);
            bulkActionsPostHandler(
                action?.method,
                action?.action.api?.replace("/api", ""),
                { filters: appliedFilters, selected_ids: selectedIds, ...(action?.payload_keys && { ...action?.payload_keys }) },
                {
                    msg: action?.action_key === "export-excel-blob" ? tApiTables("exporting_excel") : tApiTables("processing_data"),
                    icon: "excel",
                },
                action
            );
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-full sm:w-auto" variant="outline">
                        <PiGearFill />
                        {tApiTables("bulk_actions")}
                        <FiChevronDown className="ms-auto" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
                    {bulkActions?.map((action: Action, index: number) => {
                        return (
                            <DropdownMenuItem disabled={disableBulkActions} asChild key={index}>
                                <Button variant="ghost" className="w-full text-[14px] cursor-pointer" onClick={() => fireBulkAction(action)}>
                                    {action?.label}
                                </Button>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default TableBulkActions;
