"use client";

/**
 * This module contains modal components for displaying column data in different formats
 */

import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

/**
 * Props for all modal components
 */
interface ModalProps {
    closeModal: () => void;
}

/**
 * Redux state interface for table columns
 */
interface TableColumnsState {
    tableColumns: {
        rowSelectedModal: {
            label: string;
            value: {
                value: string[] | Record<string, string[]>;
            };
        };
    };
}

/**
 * Modal component for displaying array data in a list format
 *
 * Features:
 * - Displays data as numbered list items
 * - Each item has neutral background and rounded corners
 * - Handles text wrapping and whitespace
 * - Includes dismiss button
 *
 * @param closeModal - Function to close the modal
 */
export function DatalistModal({ closeModal }: ModalProps) {
    const { rowSelectedModal } = useSelector((state: TableColumnsState) => state.tableColumns);
    return (
        <>
            <div className="text-center mb-4">
                <h5 className="font-bold">{rowSelectedModal?.label}</h5>
            </div>
            <ol className="mb-4 overflow-hidden">
                {Array.isArray(rowSelectedModal?.value?.value) &&
                    rowSelectedModal?.value?.value?.map((item: string, index: number) => (
                        <li className="p-3 text-wrap whitespace-normal bg-neutral-100 dark:bg-neutral-800 text-sm rounded-md mb-2" key={index}>
                            {item}
                        </li>
                    ))}
            </ol>
            <Button variant="outline" className="w-full" onClick={closeModal}>
                Dismiss
            </Button>
        </>
    );
}

/**
 * Modal component for displaying object data in a key-value list format
 *
 * Features:
 * - Shows object keys and values in a two-column layout
 * - Keys are bold and values are plain text
 * - Both columns have neutral background and rounded corners
 * - Values are joined with dashes if arrays
 * - Includes dismiss button
 *
 * @param closeModal - Function to close the modal
 */
export function DatalistObjModal({ closeModal }: ModalProps) {
    const { rowSelectedModal } = useSelector((state: TableColumnsState) => state.tableColumns);

    const obj = rowSelectedModal?.value?.value as Record<string, string[]>;

    return (
        <>
            <div className="text-center mb-6">
                <h5>{rowSelectedModal?.label}</h5>
            </div>
            <ol className="mb-4">
                {obj &&
                    Object.keys(obj)?.map((key: string, index: number) => (
                        <li className="flex items-center gap-2 mb-2" key={index}>
                            <strong className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 w-full rounded-md">{key}</strong>
                            <span className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 w-full rounded-md">{obj[key]?.join(" - ")}</span>
                        </li>
                    ))}
            </ol>
            <Button variant="outline" className="w-full" onClick={closeModal}>
                Dismiss
            </Button>
        </>
    );
}

/**
 * Modal component for displaying HTML content
 *
 * Features:
 * - Parses and renders HTML strings safely
 * - Shows modal title above content
 * - Only processes string values
 */
export function HTMLParsedModal() {
    const { rowSelectedModal } = useSelector((state: TableColumnsState) => state.tableColumns);

    return (
        <>
            <div className="text-center mb-4">
                <h5>{rowSelectedModal?.label}</h5>
            </div>
            {rowSelectedModal?.value?.value && typeof rowSelectedModal?.value?.value === "string" && parse(rowSelectedModal?.value?.value)}
        </>
    );
}
