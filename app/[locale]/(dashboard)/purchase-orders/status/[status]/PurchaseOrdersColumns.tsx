"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";

import { _setTableColumns } from "@/app/regular-tables/provider/slices/mainSlice";
import {
  flattenData,
  rowWithLongestField,
  calculateMinWidth,
} from "@/app/regular-tables/helpers/utils";

/* ================= Types ================= */

export interface PurchaseOrderRow {
  id: string | number;
  legacy_id?: string;
  fulfillment_status?: string;
  created_at?: string;
  po_date?: string;
  total_price?: string | number;
  warehouse_name?: string;
}

interface PurchaseOrdersColumnsProps {
  tableData: PurchaseOrderRow[];
}

/* ================= Component ================= */

export default function PurchaseOrdersColumns({
  tableData,
}: PurchaseOrdersColumnsProps) {
  const dispatch = useDispatch();
  const t = useTranslations("PurchaseOrdersColumns");

  const colData = useMemo(() => flattenData(tableData), [tableData]);
  const prevColumnsKeyRef = useRef<string>("");

  const columns = useMemo(() => {
    const renderStatus = (status?: string) => {
      switch (status) {
        case "canceled":
          return <Badge variant="red">{t("statusCanceled")}</Badge>;

        case "fulfilled":
          return <Badge variant="green">{t("statusFulfilled")}</Badge>;

        case "closed":
          return <Badge variant="green">{t("statusClosed")}</Badge>;

        case "pending":
          return <Badge variant="orange">{t("statusPending")}</Badge>;

        default:
          return <Badge variant="other">{status}</Badge>;
      }
    };

    return [
      {
        id: "legacy_id",
        title: t("purchaseOrderNumber"),
        name: t("purchaseOrderNumber"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "legacy_id"),
          t("purchaseOrderNumber")
        ),
        selector: (row: PurchaseOrderRow) => row?.legacy_id,
        identifier: "legacy_id",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <Link
            href={`/purchase-orders/show/${row.id}`}
            prefetch={false}
            className="font-semibold underline"
          >
            {row?.legacy_id}
          </Link>
        ),
      },
      {
        id: "fulfillment_status",
        title: t("status"),
        name: t("status"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "fulfillment_status"),
          t("status")
        ),
        selector: (row: PurchaseOrderRow) => row?.fulfillment_status,
        identifier: "fulfillment_status",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <div className="text-wrap">
            {renderStatus(row?.fulfillment_status)}
          </div>
        ),
      },
      {
        id: "created_at",
        title: t("createdAt"),
        name: t("createdAt"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "created_at"),
          t("createdAt")
        ),
        selector: (row: PurchaseOrderRow) => row?.created_at,
        identifier: "created_at",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <div className="text-wrap">{row?.created_at}</div>
        ),
      },
      {
        id: "po_date",
        title: t("expectedDate"),
        name: t("expectedDate"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "po_date"),
          t("expectedDate")
        ),
        selector: (row: PurchaseOrderRow) => row?.po_date,
        identifier: "po_date",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <div className="text-wrap">{row?.po_date}</div>
        ),
      },
      {
        id: "total_price",
        title: t("totalPrice"),
        name: t("totalPrice"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "total_price"),
          t("totalPrice")
        ),
        selector: (row: PurchaseOrderRow) => row?.total_price,
        identifier: "total_price",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <div className="text-wrap font-en">{row?.total_price ?? "-"}</div>
        ),
      },
      {
        id: "warehouse_name",
        title: t("warehouse"),
        name: t("warehouse"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "warehouse_name"),
          t("warehouse")
        ),
        selector: (row: PurchaseOrderRow) => row?.warehouse_name,
        identifier: "warehouse_name",
        sortable: true,
        omit: false,
        cell: (row: PurchaseOrderRow) => (
          <div className="text-wrap">{row?.warehouse_name}</div>
        ),
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
