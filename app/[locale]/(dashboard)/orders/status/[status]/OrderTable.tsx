"use client";

import React, { useMemo } from "react";
import OrdersColumns from "./OrdersColumns";
import { useSelector } from "react-redux";
import RegularTable from "@/app/regular-tables/RegularTable";
import { usePathname } from "@/i18n/navigation";
import type { RootState } from "@/app/regular-tables/provider/store";
import type { OrderProduct } from "@/store/slices/orderSlice";
import type { TablePagination } from "@/app/regular-tables/RegularTable";
import store from "@/store/store";

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

// interface OrdersResponse {
//   data?: OrdersData;
// }

interface OrdersTableProps {
  orders: any;
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

export default function OrdersTable({
  tbLoading,
  manageCursor,
  orders,
}: OrdersTableProps) {
  const { filterText } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );
  const pathname = usePathname();
  const ordersStatus = pathname?.split("/")?.at(-1) || "";

  const filteredOrders = useMemo<OrderEdge[]>(() => {
    if (!orders?.data?.edges) return [];

    if (!filterText) return orders.data.edges;

    const search = filterText.toLowerCase();

    return orders.data.edges.filter((item: OrderEdge) =>
      Object.values({
        ...item.node?.shipping_address,
        ...item.node,
      }).some((value: any): any => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(search);
        }

        if (typeof value === "number") {
          return value.toString().includes(search);
        }

        return false;
      })
    );
  }, [orders, filterText, ordersStatus]);
  return (
    <>
      <OrdersColumns tableData={filteredOrders as any} />
      <RegularTable
        tableData={{ rows: filteredOrders } as any}
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
