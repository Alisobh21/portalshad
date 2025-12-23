"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { _setTableColumns } from "@/app/regular-tables/provider/slices/mainSlice";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  calculateMinWidth,
  flattenData,
  rowWithLongestField,
} from "@/app/regular-tables/helpers/utils";

interface ProductRow {
  id: string | number;
  name: string;
  on_hand?: number;
  backorder?: number;
  available?: number;
  allocated?: number;
  sku?: string;
  warehouse_name?: string;
}

interface ProductsColumnsProps {
  tableData: ProductRow[];
}

export default function ProductsColumns({ tableData }: ProductsColumnsProps) {
  const colData = useMemo(() => flattenData(tableData), [tableData]);
  const t = useTranslations("TableProductColumns");
  const dispatch = useDispatch();
  const prevColumnsKeyRef = useRef<string>("");

  const columns = useMemo(() => {
    return [
      {
        id: "name",
        name: t("product"),
        title: t("product"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "name"),
          t("product")
        ),
        selector: (row: ProductRow) => row?.name,
        identifier: "name",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => (
          <Link
            href={`/products/show/${row?.id}`}
            className="anchor-reset font-en fw-normal text-wrap"
          >
            <span className="d-block" style={{ direction: "ltr" }}>
              {row?.name}
            </span>
          </Link>
        ),
      },
      {
        id: "on_hand",
        name: t("on_hand"),
        title: t("on_hand"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "on_hand"),
          t("on_hand")
        ),
        selector: (row: ProductRow) => row?.on_hand?.toString(),
        identifier: "on_hand",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => <div>{row?.on_hand}</div>,
      },
      {
        id: "backorder",
        name: t("quantityShould"),
        title: t("quantityShould"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "backorder"),
          t("quantityShould")
        ),
        selector: (row: ProductRow) => row?.backorder?.toString(),
        identifier: "backorder",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => <div>{row?.backorder}</div>,
      },
      {
        id: "available",
        name: t("available"),
        title: t("available"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "available"),
          t("available")
        ),
        selector: (row: ProductRow) => row?.available?.toString(),
        identifier: "available",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => <div>{row?.available}</div>,
      },
      {
        id: "allocated",
        name: t("allocated"),
        title: t("allocated"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "allocated"),
          t("allocated")
        ),
        selector: (row: ProductRow) => row?.allocated?.toString(),
        identifier: "allocated",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => <div>{row?.allocated}</div>,
      },
      {
        id: "sku",
        name: t("sku"),
        title: t("sku"),
        width: calculateMinWidth(rowWithLongestField(colData, "sku"), t("sku")),
        selector: (row: ProductRow) => row?.sku,
        identifier: "sku",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => (
          <div style={{ direction: "ltr" }}>{row?.sku}</div>
        ),
      },
      {
        id: "warehouse_name",
        name: t("warehouse_name"),
        title: t("warehouse_name"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "warehouse_name"),
          t("warehouse_name")
        ),
        selector: (row: ProductRow) => row?.warehouse_name,
        identifier: "warehouse_name",
        sortable: true,
        omit: false,
        cell: (row: ProductRow) => <div>{row?.warehouse_name}</div>,
      },
    ];
  }, [colData, t]);

  useEffect(() => {
    const columnsKey = columns.map((col) => col.id).join(",");
    if (columnsKey && columnsKey !== prevColumnsKeyRef.current) {
      dispatch(_setTableColumns(columns));
      prevColumnsKeyRef.current = columnsKey;
    }
  }, [dispatch, columns]);

  return null;
}
