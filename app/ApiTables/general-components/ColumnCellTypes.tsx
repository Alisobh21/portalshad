"use client";

import React from "react";
import { copyToClipboard } from "../table-utils/utils";
import { useDispatch } from "react-redux";
import { _setRowSelectedModal } from "../table-providers/slices/tableColumnsSlice";
import { IoMdExpand } from "react-icons/io";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useLocale, useTranslations } from "next-intl";
import { Link as NextLink } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TextCell({ col, row }: any) {
    return col?.values_formating &&
        Object.keys(col?.values_formating)?.filter((key) => row[col?.data_src] === col?.values_formating[key]["showValue"])?.length > 0 ? (
        Object.keys(col?.values_formating)
            ?.filter((key) => row[col?.data_src] === col?.values_formating[key]["showValue"])
            ?.map((key, index) => (
                <span
                    className={`status text-capitalize ${
                        col?.values_formating[key]["style"] === "success"
                            ? "active"
                            : col?.values_formating[key]["style"] === "danger"
                            ? "in-active"
                            : col?.values_formating[key]["style"] === "info" && "info"
                    }`}
                    key={index}
                >
                    {row[col?.data_src]}
                </span>
            ))
    ) : row[col?.data_src] === "CR" || row[col?.data_src] === "approved" ? (
        <span className="status active">{row[col?.data_src]}</span>
    ) : row[col?.data_src] === "DR" || row[col?.data_src] === "pending" ? (
        <span className="status in-active">{row[col?.data_src]}</span>
    ) : (
        <p className="mb-0 text-wrap">{row[col?.data_src]}</p>
    );
}

export function LinkCell({ col, row }: any) {
    const tApiTables = useTranslations("ApiTables");

    return (
        <>
            {col?.linkStyle === "text" ? (
                <Button asChild variant="outline" size="sm" className="text-[12px]">
                    <NextLink
                        href={row[col?.data_src]?.value || row[col?.data_src]}
                        className={`text-${col?.linkColor} ${
                            row[col?.data_src] === "!#" || row[col?.data_src]?.value === "!#" || !row[col?.data_src]
                                ? "disabled pointer-events-none"
                                : ""
                        }`}
                        target="_blank"
                    >
                        {row[col?.data_src]?.label || col?.linkText}
                    </NextLink>
                </Button>
            ) : (
                col?.linkStyle === "button" && (
                    <Button asChild variant="outline" size="sm" className="text-[12px]">
                        <NextLink color="primary" href={row[col?.data_src]?.value || row[col?.data_src]} target="_blank">
                            {col?.linkText}
                        </NextLink>
                    </Button>
                )
            )}

            {col?.showCopyBtn && (
                <Button variant="outline" type="button" size="sm" className="text-[12px]" onClick={() => copyToClipboard(row[col?.data_src])}>
                    {tApiTables("copy_link")}
                </Button>
            )}
        </>
    );
}

export function BooleanCell({ row, col }: any) {
    if (row[col?.data_src] === true) {
        return (
            <Badge
                variant="outline"
                className="inline-flex items-center border-green-500/5 px-3 py-[2px] text-green-800 dark:border-green-300/40 dark:text-green-100 bg-green-400/5 gap-1"
            >
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                {col?.values_formating?.trueLabel}
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="inline-flex items-center  border-red-500/5 dark:border-red-300/40 px-3 py-[2px] text-red-800 dark:text-red-50 bg-red-400/5 gap-1"
        >
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            {col?.values_formating?.falseLabel}
        </Badge>
    );
}

export function HTMLCell({ col, row }: any) {
    const dispatch = useDispatch();
    const tApiTables = useTranslations("ApiTables");

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() => {
                dispatch(
                    _setRowSelectedModal({
                        label: col?.label,
                        value: row[col?.data_src],
                    })
                );
            }}
        >
            {tApiTables("show")}
        </Button>
    );
}

export function DataListCell({ col, row }: any) {
    const dispatch = useDispatch();

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => {
                dispatch(
                    _setRowSelectedModal({
                        label: col?.label,
                        value: row[col?.data_src],
                    })
                );
            }}
        >
            <IoMdExpand />
            {col?.linkText}
        </Button>
    );
}

export function BarcodeCell({ col, row }: any) {
    return (
        <>
            <PhotoProvider>
                <PhotoView src={`data:image/png;base64,${row[col?.data_src]}`}>
                    <img src={`data:image/png;base64,${row[col?.data_src]}`} alt="Barcode" className="w-auto max-w-[50px] cursor-pointer" />
                </PhotoView>
            </PhotoProvider>
        </>
    );
}
