"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

import PurchaseOrdersColumns from "./PurchaseOrdersColumns";
import RegularTable from "@/app/regular-tables/RegularTable";

import type { RootState } from "@/app/regular-tables/provider/store";
import type { TablePagination } from "@/app/regular-tables/RegularTable";

/* ================= Types ================= */

interface Warehouse {
  id: string | number;
  identifier: string;
}

interface PurchaseOrderNode {
  id: string | number;
  warehouse_id?: string | number;
  legacy_id?: string;
  fulfillment_status?: string;
  created_at?: string;
  po_date?: string;
  total_price?: string | number;
  warehouse_name?: string;
  [key: string]: any;
}

interface PurchaseOrderEdge {
  node: PurchaseOrderNode;
}

interface PurchaseOrdersData {
  edges?: PurchaseOrderEdge[];
  pageInfo?: TablePagination;
}

interface PurchaseOrdersResponse {
  data?: PurchaseOrdersData;
}

interface PurchaseOrdersTableProps {
  purchaseOrders?: PurchaseOrdersResponse;
  warehouses?: Warehouse[];
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

interface PurchaseOrdersResponse {
  edges: { node: PurchaseOrderNode }[];
}

interface FormattedPurchaseOrder extends PurchaseOrderNode {
  warehouse_name?: string;
}

/* ================= Component ================= */

export default function PurchaseOrdersTable({
  purchaseOrders,
  warehouses,
  tbLoading,
  manageCursor,
}: PurchaseOrdersTableProps) {
  const { filterText } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );
  console.log(warehouses, "warehouses");
  console.log(purchaseOrders, "purchaseOrders");
  const formattedArray: FormattedPurchaseOrder[] = useMemo(() => {
    return (
      purchaseOrders?.edges
        ?.map(({ node }) => node)
        ?.map((purchaseOrder) => {
          return {
            ...purchaseOrder,
            warehouse_name: warehouses?.find(
              (warehouse) => warehouse?.id === purchaseOrder?.warehouse_id
            )?.identifier,
          };
        }) || []
    );
  }, [purchaseOrders, warehouses]);
  const filteredPurchaseOrders: FormattedPurchaseOrder[] = useMemo(() => {
    if (!formattedArray) return [];

    const searchInOrder = (item: FormattedPurchaseOrder) => {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(filterText.toLowerCase());
        }
        if (typeof value === "number") {
          return value
            .toString()
            .toLowerCase()
            .includes(filterText.toLowerCase());
        }
        return false;
      });
    };

    return formattedArray.filter(searchInOrder);
  }, [formattedArray, filterText]);
  console.log(filteredPurchaseOrders, "filteredPurchaseOrders");
  console.log(purchaseOrders?.pageInfo, "pageInfo");
  return (
    <>
      <PurchaseOrdersColumns tableData={filteredPurchaseOrders} />

      <RegularTable
        tableData={{ rows: filteredPurchaseOrders }}
        tablePagination={purchaseOrders?.pageInfo as any}
        exportFileName="Purchase Orders"
        hasDateFilter
        tbLoading={tbLoading}
        manageCursor={manageCursor}
      />
    </>
  );
}
