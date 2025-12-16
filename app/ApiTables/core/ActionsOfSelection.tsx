"use client";

import React from "react";
import {
    ExternalRedirectRowActionElement,
    GeneralRowActionElement,
    RedirectRowActionElement,
    ToggleRowActionElement,
} from "../general-components/RowActionsElements";
import { useDispatch, useSelector } from "react-redux";
import useUtilsProvider from "../table-providers/useUtilsProvider";
import { _getSelectedBulkAction } from "../table-providers/slices/bulkActionsSlice";
import { Button } from "@/components/ui/button";

interface Action {
    action_key: string;
    action_type: string;
    label: string;
    method: string;
    action?: {
        bulk_action_url?: {
            api: string;
        };
        api?: string;
    };
    payload_keys?: string[];
    need_confirmation?: boolean;
}

interface RootState {
    tableColumns: {
        selectedRows: any[];
        selectedIds: string[];
    };
    tableCore: {
        appliedFilters: any;
    };
    bulkActions: {
        bulkActions: Action[];
    };
    rowActions: {
        selectedRowActions: Action[];
    };
}

function ActionsOfSelections() {
    const { selectedRows, selectedIds } = useSelector((state: RootState) => state.tableColumns);
    const { appliedFilters } = useSelector((state: RootState) => state.tableCore);
    const { bulkActions } = useSelector((state: RootState) => state.bulkActions);
    const { selectedRowActions } = useSelector((state: RootState) => state.rowActions);
    const { bulkActionsPostHandler } = useUtilsProvider();
    const dispatch = useDispatch();

    const requireModal = (action: any) => {
        return action?.payload_keys?.filter((key: string) => key !== "filters" && key !== "selected_ids")?.length > 0 || action?.need_confirmation;
    };

    function fireBulkAction(action: Action) {
        if (requireModal(action)) {
            dispatch(_getSelectedBulkAction(action));
        } else {
            bulkActionsPostHandler(
                action.method,
                action.action?.bulk_action_url
                    ? action.action.bulk_action_url.api.replace("/api", "")
                    : action.action?.api?.replace("/api", "") || "",
                { filters: appliedFilters, selected_ids: selectedIds },
                {
                    msg: action.action_key === "export_excel" ? "جاري تصدير ملف الاكسل" : "جاري معالجة البيانات",
                    icon: "excel",
                },
                action
            );
        }
    }

    return (
        <>
            {selectedRows?.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {selectedRowActions?.map((action: Action) => (
                        <div className="flex flex-grow-1 md:flex-grow-0 items-center" key={action.action_key}>
                            {action.action_type === "toggle" ? (
                                <ToggleRowActionElement action={action} isBulk={true} />
                            ) : action.action_type === "redirect" ? (
                                <RedirectRowActionElement action={action} isBulk={true} />
                            ) : action.action_type === "external_redirect" ? (
                                <ExternalRedirectRowActionElement action={action} isBulk={true} />
                            ) : (
                                <GeneralRowActionElement action={action} isBulk={true} />
                            )}
                        </div>
                    ))}

                    {/* {bulkActions?.map((action: Action) => (
                        <div className="flex flex-grow-1 md:flex-grow-0 items-center" key={action.action_key}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    fireBulkAction(action);
                                }}
                            >
                                {action.label}
                            </Button>
                        </div>
                    ))} */}
                </div>
            )}
        </>
    );
}

export default ActionsOfSelections;
