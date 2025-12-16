"use client";

/**
 * This module contains components for rendering different types of row action elements in tables
 */

import { Link } from "@/i18n/navigation";
import React, { useId, useState } from "react";
import { copyToClipboard } from "../table-utils/utils";
import useUtilsProvider from "../table-providers/useUtilsProvider";
import { useDispatch, useSelector } from "react-redux";
import { _getClickedRowAction, _getClickedRowActionId } from "../table-providers/slices/rowActionsSlice";
import { IoCopy } from "react-icons/io5";
import { MdInsertLink } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/custom/button";

/**
 * Checks if an action requires a modal form
 * @param action - The action configuration object
 * @returns boolean indicating if modal is required
 */
const requireModal = (action: any) => {
    return action?.need_confirmation || action?.action_type === "custom_control";
};

/**
 * Component for rendering a toggle switch row action
 * Features:
 * - Toggleable switch with label
 * - Visual feedback for current state
 * - Handles both bulk and single row actions
 */
export const ToggleRowActionElement = ({ action, isBulk }: any) => {
    const { rowActionsPostHandler } = useUtilsProvider();
    const dispatch = useDispatch();
    const { selectedIds } = useSelector((state: any) => state?.tableColumns);
    const id = useId();

    function fireRowAction(action: any) {
        if (requireModal(action)) {
            dispatch(_getClickedRowAction({ ...action, ...(isBulk && { isBulk: true }) }));
        } else {
            rowActionsPostHandler(
                action?.method,
                isBulk ? action?.bulk_actions_url?.api?.replace("/api", "") : action?.action.api?.replace("/api", ""),
                { selected_ids: selectedIds },
                { ...action, ...(isBulk && { isBulk: true }) }
            );
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Label
                htmlFor={`tableRowSwitch_${id}`}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                    ${
                        action?.toggle_current_value
                            ? "border-green-500 dark:border-green-700 text-green-800 dark:text-green-200 bg-green-300/10 dark:bg-green-300/5"
                            : "border-muted-foreground/40"
                    }
                `}
            >
                <Switch
                    defaultChecked={action?.toggle_current_value || false}
                    id={`tableRowSwitch_${id}`}
                    checked={action?.toggle_current_value}
                    onCheckedChange={() => fireRowAction(action)}
                    className="cursor-pointer"
                />
                <span>{action?.button?.label}</span>
            </Label>
        </div>
    );
};

/**
 * Component for rendering an internal redirect link action
 * Features:
 * - Loading state feedback
 * - Uses Next.js Link for client-side navigation
 */
export const RedirectRowActionElement = ({ action }: any) => {
    const [fired, setFired] = useState(false);

    return (
        <Button onClick={() => setFired(true)} isLoading={fired} asChild variant="outline" className="w-full">
            <Link className="inline-flex items-center gap-1" href={action?.redirect_routes?.api?.replace(/^\/api/, "")}>
                <MdInsertLink />
                {fired ? "Redirecting..." : action?.button?.label}
            </Link>
        </Button>
    );
};

/**
 * Component for rendering an external redirect link action
 * Features:
 * - Opens in new tab
 * - Visual indication of external link
 */
export const ExternalRedirectRowActionElement = ({ action }: any) => {
    return (
        <Button asChild variant="primary" className="w-full">
            <a target="_blank" className="inline-flex items-center gap-1 w-full" href={action?.redirect_routes?.api?.replace(/^\/api/, "")}>
                <MdInsertLink />
                {action?.button?.label}
            </a>
        </Button>
    );
};

/**
 * Component for rendering a copy text action
 * Features:
 * - Copies text to clipboard on click
 * - Visual feedback with icon
 */
export const CopyTextRowActionElement = ({ action }: any) => {
    return (
        <Button
            variant="outline"
            onClick={() => {
                copyToClipboard(action?.copy_value);
            }}
        >
            <IoCopy />
            {action?.button?.label}
        </Button>
    );
};

/**
 * Component for rendering a general purpose row action
 * Features:
 * - Handles both bulk and single row actions
 * - Loading state feedback
 * - Modal support for confirmations
 * - Custom control handling
 */
export const GeneralRowActionElement = ({ action, isBulk }: any) => {
    const id = useId();

    const { rowActionsPostHandler } = useUtilsProvider();
    const dispatch = useDispatch();
    const { clickedRowAction, clickedRowActionId, rowActionPostLoading } = useSelector((state: any) => state?.rowActions);
    const { selectedIds } = useSelector((state: any) => state?.tableColumns);

    function fireRowAction(action: any) {
        dispatch(_getClickedRowActionId(id));
        if (requireModal(action)) {
            dispatch(_getClickedRowAction({ ...action, ...(isBulk && { isBulk: true }) }));
            if (action?.action_type === "custom_control") {
                rowActionsPostHandler(
                    action?.method,
                    isBulk ? action?.action?.api?.replace(/^\/api/, "") : action?.action.api?.replace(/^\/api/, ""),
                    { selected_ids: selectedIds },
                    action
                );
            }
        } else {
            rowActionsPostHandler(
                action?.method,
                isBulk ? action?.bulk_actions_url?.api?.replace(/^\/api/, "") : action?.action.api?.replace(/^\/api/, ""),
                { selected_ids: selectedIds },
                { ...action, ...(isBulk && { isBulk: true }) }
            );
        }
    }

    return (
        <Button
            variant="secondary"
            className="w-full text-[13px] h-auto py-1.5 border"
            onClick={() => {
                fireRowAction(action);
            }}
            isLoading={clickedRowAction?.action_key === action?.action_key && rowActionPostLoading && clickedRowActionId === id}
        >
            {action?.button?.label}
        </Button>
    );
};
