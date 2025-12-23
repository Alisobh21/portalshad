"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { _setTableColumns } from "@/app/regular-tables/provider/slices/mainSlice";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  calculateMinWidth,
  flattenData,
  rowWithLongestField,
} from "@/app/regular-tables/helpers/utils";

interface OrderRow {
  id: string | number;
  order_number: string;
  fulfillment_status: string;
  first_name: string;
  last_name: string;
  city: string;
  phone: string;
  email: string;
  total_price: string | number;
  address1?: string;
  address2?: string;
  ready_to_ship?: boolean;
  order_date?: string;
  required_ship_date?: string;
  method?: string;
  shop_name?: string;
}

interface OrdersColumnsProps {
  tableData: OrderRow[];
}

export default function OrdersColumns({ tableData }: OrdersColumnsProps) {
  const colData = useMemo(() => flattenData(tableData), [tableData]);
  const t = useTranslations("OrderColumns");
  const dispatch = useDispatch();
  const prevColumnsKeyRef = useRef<string>("");

  const columns = useMemo(() => {
    function checkStatusVariant(status: string) {
      if (status === "canceled") {
        return <Badge variant="red">{t("statusCanceled")}</Badge>;
      } else if (status === "fulfilled") {
        return <Badge variant="green">{t("statusFulfilled")}</Badge>;
      } else if (status === "outstanding") {
        return <Badge variant="orange">{t("statusOutstanding")}</Badge>;
      } else if (status === "inPreparation" || status === "pending") {
        return <Badge variant="orange">{t("statusPending")}</Badge>;
      } else if (status === "High-Priority") {
        return <Badge variant="highPriority">{t("highPriority")}</Badge>;
      }
      return <Badge variant="other">{status}</Badge>;
    }

    return [
      {
        id: "order_number",

        title: t("orderNumber"),
        name: t("orderNumber"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "order_number"),
          t("orderNumber")
        ),
        wrap: true,
        selector: (row: OrderRow) => row?.order_number,
        identifier: "order_number",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <Link
            prefetch={false}
            href={`/orders/show/${row?.id}`}
            className="font-semibold underline"
          >
            {row?.order_number}
          </Link>
        ),
      },
      {
        id: "fulfillment_status",
        title: t("status"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "fulfillment_status"),
          t("status")
        ),
        name: t("status"),
        selector: (row: OrderRow) => row?.fulfillment_status,
        identifier: "fulfillment_status",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">
            {checkStatusVariant(row?.fulfillment_status)}
          </div>
        ),
      },
      {
        id: "first_name",
        title: t("firstName"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "first_name"),
          t("firstName")
        ),
        name: t("firstName"),
        selector: (row: OrderRow) => row?.first_name,
        identifier: "first_name",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.first_name}</div>
        ),
      },
      {
        id: "last_name",
        title: t("lastName"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "last_name"),
          t("lastName")
        ),
        name: t("lastName"),
        selector: (row: OrderRow) => row?.last_name,
        identifier: "last_name",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.last_name}</div>
        ),
      },
      {
        id: "city",
        title: t("city"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "city"),
          t("city")
        ),
        name: t("city"),
        selector: (row: OrderRow) => row?.city,
        identifier: "city",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => <div>{row?.city}</div>,
      },
      {
        id: "phone",
        title: t("phone"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "phone"),
          t("phone")
        ),
        name: t("phone"),
        selector: (row: OrderRow) => row?.phone,
        identifier: "phone",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="font-en text-wrap">{row?.phone || "-"}</div>
        ),
      },
      {
        id: "email",
        title: t("email"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "email"),
          t("email")
        ),
        name: t("email"),
        selector: (row: OrderRow) => row?.email,
        identifier: "email",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="font-en text-wrap">{row?.email || "-"}</div>
        ),
      },
      {
        id: "total_price",
        title: t("total"),
        name: t("total"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "total_price"),
          t("total")
        ),
        selector: (row: OrderRow) => row?.total_price,
        identifier: "total_price",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="font-en text-wrap">{row?.total_price || "-"}</div>
        ),
      },
      {
        id: "address1",
        title: t("address"),
        width: "300px",
        name: t("address"),
        selector: (row: OrderRow) => row?.address1,
        identifier: "address1",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.address1 || "-"}</div>
        ),
      },
      {
        id: "address2",
        title: t("nationalAddress"),
        width: "300px",
        name: t("nationalAddress"),
        selector: (row: OrderRow) => row?.address2,
        identifier: "address2",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.address2 || "-"}</div>
        ),
      },
      {
        id: "ready_to_ship",
        title: t("readyToShip"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "ready_to_ship"),
          t("readyToShip")
        ),
        name: t("readyToShip"),
        selector: (row: OrderRow) => row?.ready_to_ship,
        identifier: "ready_to_ship",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">
            {row?.ready_to_ship ? t("yes") : t("no")}
          </div>
        ),
      },
      {
        id: "order_date",
        title: t("orderDate"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "order_date"),
          t("orderDate")
        ),
        name: t("orderDate"),
        selector: (row: OrderRow) => row?.order_date,
        identifier: "order_date",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.order_date?.slice(0, 10)}</div>
        ),
      },
      {
        id: "required_ship_date",
        title: t("requiredShipDate"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "required_ship_date"),
          t("requiredShipDate")
        ),
        name: t("requiredShipDate"),
        selector: (row: OrderRow) => row?.required_ship_date,
        identifier: "required_ship_date",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">
            {row?.required_ship_date?.slice(0, 10)}
          </div>
        ),
      },
      {
        id: "method",
        title: t("shippingCompany"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "method"),
          t("shippingCompany")
        ),
        name: t("shippingCompany"),
        selector: (row: OrderRow) => row?.method,
        identifier: "method",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => <div className="text-wrap">{row?.method}</div>,
      },
      {
        id: "shop_name",
        title: t("store"),
        width: calculateMinWidth(
          rowWithLongestField(colData, "shop_name"),
          t("store")
        ),
        name: t("store"),
        selector: (row: OrderRow) => row?.shop_name,
        identifier: "shop_name",
        sortable: true,
        omit: false,
        cell: (row: OrderRow) => (
          <div className="text-wrap">{row?.shop_name}</div>
        ),
      },
    ];
  }, [colData, t]);

  useEffect(() => {
    // Create a stable key from column identifiers to detect actual changes
    const columnsKey = columns.map((col) => col.id).join(",");

    // Only dispatch if the column structure actually changed
    if (columnsKey && columnsKey !== prevColumnsKeyRef.current) {
      dispatch(_setTableColumns(columns));
      prevColumnsKeyRef.current = columnsKey;
    }
  }, [dispatch, columns]);

  return null;
}
