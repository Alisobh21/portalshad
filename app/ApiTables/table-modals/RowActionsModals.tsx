"use client";

/**
 * This module contains modal components for handling row actions in API tables
 */

import React, { useMemo } from "react";
import { copyToClipboard } from "../table-utils/utils";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/custom/button";
import { IoCopy } from "react-icons/io5";
import { useSelector } from "react-redux";
import useUtilsProvider from "../table-providers/useUtilsProvider";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * Props for the ViewRowData component
 */
interface ViewRowDataProps {
    data: {
        data:
            | Array<{
                  [key: string]: {
                      label: string;
                      value: string | string[] | number;
                      type?: string;
                  };
              }>
            | {
                  [key: string]: {
                      label: string;
                      value: string | string[] | number;
                      type?: string;
                  };
              };
    };
}

/**
 * Props for the ConfirmationModal component
 */
interface ConfirmationModalProps {
    closeModal: () => void;
    confirmationFor: "rowAction" | "bulkAction";
}

/**
 * Redux state interface for the table components
 */
interface RootState {
    rowActions: {
        clickedRowAction: {
            method: string;
            bulk_actions_url?: { api: string };
            action: { api: string };
            isBulk?: boolean;
        };
        rowActionPostLoading: boolean;
    };
    tableCore: {
        appliedFilters: any;
    };
    bulkActions: {
        bulkActionsPostHandler: any;
        selectedBulkAction: {
            method: string;
            action: { api: string };
        };
        bulkActionPostLoading: boolean;
    };
    tableColumns: {
        selectedIds: string[];
    };
}

/**
 * Component for displaying detailed row data in a modal
 *
 * Features:
 * - Displays data in either table or grid format based on structure
 * - Handles array and object data types
 * - Supports copy-to-clipboard functionality
 * - Responsive layout with different column spans
 *
 * @param data - The row data to display
 */
export function ViewRowData({ data }: ViewRowDataProps) {
    const modalData = useMemo(() => {
        return data?.data;
    }, [data]) as any;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 items-stretch gap-1 pt-7">
            {modalData && modalData?.barcode && (
                <div className="xl:col-span-12  flex flex-col items-center justify-center p-4">
                    <h6 className="mb-2 font-[400] text-md">{modalData.barcode?.label || "Barcode"}</h6>
                    {modalData.barcode && (
                        <img
                            src={`data:image/png;base64,${modalData.barcode}`}
                            alt="Barcode"
                            className="max-w-full h-auto mb-2 border rounded bg-white"
                            style={{ maxHeight: "50vh" }}
                        />
                    )}
                    {modalData.barcode && (
                        <Button variant="outline" onClick={() => copyToClipboard(String(modalData.barcodeValue))} className="mt-2">
                            <IoCopy size={17} />
                            Copy Barcode
                        </Button>
                    )}
                </div>
            )}
            {modalData && Array.isArray(modalData) && (
                <div className="xl:col-span-12">
                    <Table className="border">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                {Object.keys(modalData?.at(0) ?? {}).map((key: any, idx: number) => (
                                    <TableHead className="px-3" key={idx}>
                                        {modalData?.at(0)?.[key]?.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {modalData?.map((item, index) => (
                                <TableRow key={index} className={Object.keys(item)?.length > 2 ? (index % 2 === 0 ? "" : "bg-muted/50") : ""}>
                                    {Object.keys(item)?.map((key: any, idx: number) => (
                                        <TableCell className="font-medium px-3">
                                            <p>{item[key]?.value}</p>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {modalData &&
                !modalData?.barcode &&
                !Array.isArray(modalData) &&
                Object.keys(modalData)?.map((key, index) => (
                    <div key={index} className="2xl:col-span-4 xl:col-span-6">
                        <div className="bg-neutral-100 dark:bg-neutral-800  h-full p-3 rounded-md">
                            <h6 className="mb-0 font-[400] text-[13px]">{modalData[key]?.label}</h6>
                            {modalData[key]?.type === "copy_value" ? (
                                modalData[key]?.value && modalData[key]?.value !== "#!" && modalData[key]?.value !== "!#" ? (
                                    <Button variant="outline" onClick={() => copyToClipboard(String(modalData[key]?.value))}>
                                        <IoCopy size={17} />
                                        Copy Link
                                    </Button>
                                ) : (
                                    <p className="mb-0 text-muted-foreground text-wrap">No share Link</p>
                                )
                            ) : Array.isArray(modalData[key]?.value) ? (
                                <ul className="mb-0 mt-3 pe-4 text-[13px]">
                                    {modalData[key]?.value?.map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                (typeof modalData[key]?.value === "string" || typeof modalData[key]?.value === "number") && (
                                    <p className="text-muted-foreground text-wrap mb-0 text-[14px] mt-2">{modalData[key]?.value || "----"}</p>
                                )
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

/**
 * Modal component for confirming row/bulk actions
 *
 * Features:
 * - Handles both single row and bulk actions
 * - Shows loading state during action execution
 * - Provides confirm/dismiss options
 * - Integrates with Redux state management
 *
 * @param closeModal - Function to close the modal
 * @param confirmationFor - Type of action requiring confirmation
 */
export function ConfirmationModal({ closeModal, confirmationFor }: ConfirmationModalProps) {
    const { clickedRowAction, rowActionPostLoading } = useSelector((state: RootState) => state.rowActions);
    const { appliedFilters } = useSelector((state: RootState) => state.tableCore);
    const { bulkActionsPostHandler, selectedBulkAction, bulkActionPostLoading } = useSelector((state: RootState) => state.bulkActions);
    const { selectedIds } = useSelector((state: RootState) => state.tableColumns);
    const { rowActionsPostHandler } = useUtilsProvider();

    function fireRowAction() {
        if (confirmationFor === "rowAction")
            rowActionsPostHandler(
                clickedRowAction?.method,
                clickedRowAction?.isBulk ? clickedRowAction?.bulk_actions_url?.api ?? "" : clickedRowAction?.action?.api?.replace(/^\/api/, "") ?? "",
                { selected_ids: selectedIds },
                clickedRowAction
            );
        if (confirmationFor === "bulkAction") {
            bulkActionsPostHandler(
                selectedBulkAction?.method,
                selectedBulkAction?.action.api,
                { filters: appliedFilters, selected_ids: selectedIds },
                null,
                selectedBulkAction
            );
        }
    }

    return (
        <div className="text-center">
            <h4 className="mb-1 font-bold text-2xl">Confirm Action</h4>
            <p className="h6 mb-4 text-sm pb-6">Are you sure you want to do this action?</p>
            <div className="grid grid-cols-2 ms-auto max-w-[200px] gap-2">
                <div className="col">
                    <LoadingButton
                        variant="default"
                        className="w-full"
                        onClick={fireRowAction}
                        isDisabled={rowActionPostLoading || bulkActionPostLoading}
                        isLoading={rowActionPostLoading || bulkActionPostLoading}
                    >
                        Confirm
                    </LoadingButton>
                </div>
                <div className="col">
                    <Button variant="outline" className="w-full" onClick={closeModal}>
                        Dismiss
                    </Button>
                </div>
            </div>
        </div>
    );
}
