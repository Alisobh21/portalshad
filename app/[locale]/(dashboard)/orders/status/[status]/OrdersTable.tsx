"use client";

import React from "react";
import RegularTable from "@/app/regular-tables/RegularTable";
import OrdersColumns from "./OrdersColumns";
import type { OrderProduct } from "@/store/slices/orderSlice";

interface OrdersTableProps {
  orders: OrderProduct[];
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

export default function OrdersTable({
  orders,
  tbLoading,
  manageCursor,
}: OrdersTableProps) {
  return (
    <>
      <OrdersColumns tableData={orders as any} />
      <RegularTable
        tableData={{ rows: orders } as any}
        hasDateFilter={true}
        hasSkuFilter={true}
        hasPerPageFilter={true}
        exportFileName="orders"
        tbLoading={tbLoading}
        manageCursor={manageCursor}
      />
    </>
  );
}
