"use client";

import React, { useMemo } from "react";
import OrdersColumns from "./OrdersColumns";
import { useSelector } from "react-redux";
import RegularTable from "@/app/regular-tables/RegularTable";
import { usePathname } from "@/i18n/navigation";
import type { RootState } from "@/app/regular-tables/provider/store";
import type { OrderProduct } from "@/store/slices/orderSlice";
import type { TablePagination } from "@/app/regular-tables/RegularTable";

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
  shipping_address?: Record<string, unknown>;
  [key: string]: unknown;
}

interface OrderEdge {
  node: OrderProduct & {
    shipping_address?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface OrdersData {
  edges?: OrderEdge[];
  pageInfo?: TablePagination;
}

interface OrdersResponse {
  data?: OrdersData;
}

interface OrdersTableProps {
  orders: OrdersResponse;
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

export default function OrdersTable({
  orders,
  tbLoading,
  manageCursor,
}: OrdersTableProps) {
  const { filterText } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );
  const pathname = usePathname();
  const ordersStatus = pathname?.split("/")?.at(-1) || "";

  const filteredOrders = useMemo(() => {
    if (!orders?.data?.edges) return [];
    const { edges } = orders.data;

    const searchInOrder = (item: OrderEdge): boolean => {
      const node = item.node;
      const searchableData = {
        ...node?.shipping_address,
        ...node,
      };

      return Object.values(searchableData || {}).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(filterText?.toLowerCase() || "");
        }
        if (typeof value === "number") {
          return value
            .toString()
            .toLowerCase()
            .includes(filterText?.toLowerCase() || "");
        }
        return false;
      });
    };

    return edges.filter(searchInOrder);
  }, [orders, filterText]);

  // Extract node data from edges for OrdersColumns
  const tableData = filteredOrders.map((edge) => edge.node as OrderRow);

  return (
    <>
      <OrdersColumns tableData={tableData} />
      <RegularTable
        tableData={{ rows: tableData } as { rows: unknown[] }}
        tablePagination={orders?.data?.pageInfo}
        exportFileName={`Orders - ${ordersStatus}`}
        hasDateFilter={true}
        hasSkuFilter={true}
        hasPerPageFilter={true}
        tbLoading={tbLoading}
        manageCursor={manageCursor}
      />
    </>
  );
}
