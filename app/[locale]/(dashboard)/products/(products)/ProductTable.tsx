"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import RegularTable from "@/app/regular-tables/RegularTable";
import ProductsColumns from "./ProductsColumn";
import type { RootState } from "@/app/regular-tables/provider/store";

export interface Warehouse {
  id: string | number;
  identifier: string;
  [key: string]: any;
}

export interface WarehouseProduct {
  warehouse_id: string | number;
  warehouse?: Warehouse;
  on_hand?: number;
  backorder?: number;
  available?: number;
  allocated?: number;
  [key: string]: any;
}

export interface ProductNode {
  id: string | number;
  name: string;
  sku: string;
  warehouse_products: WarehouseProduct[];
  [key: string]: any;
}

export interface ProductsEdge {
  node: ProductNode;
}

export interface ProductsResponse {
  edges?: ProductsEdge[];
  pageInfo?: any;
}

export interface ProductsTableProps {
  products?: ProductsResponse;
  warehouses?: Warehouse[];
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
  getFilteredData?: (...args: any) => void;
}

export default function ProductsTable({
  products,
  warehouses,
  tbLoading,
  manageCursor,
  getFilteredData,
}: ProductsTableProps) {
  const { filterText } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );

  // Flatten products with warehouse info
  const formattedArray = useMemo(() => {
    return (
      products?.edges?.flatMap(({ node }) =>
        node.warehouse_products.map((warehouseProduct) => ({
          ...warehouseProduct,
          name: node.name,
          id: `${node.id}-${warehouseProduct.warehouse_id}`,
          sku: node.sku,
          warehouse_name:
            warehouses?.find((w) => w.id === warehouseProduct.warehouse_id)
              ?.identifier ||
            warehouseProduct?.warehouse?.identifier ||
            "",
        }))
      ) || []
    );
  }, [products, warehouses]);

  // Filter products by search text
  const filteredProducts = useMemo(() => {
    if (!products?.edges) return [];

    const search = filterText?.toLowerCase() || "";

    return formattedArray.filter((item) =>
      Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(search);
        }
        if (typeof value === "number") {
          return value.toString().includes(search);
        }
        return false;
      })
    );
  }, [formattedArray, filterText, products]);

  return (
    <>
      <ProductsColumns tableData={filteredProducts} />
      <RegularTable
        tableData={{ rows: filteredProducts } as any}
        tablePagination={products?.pageInfo}
        exportFileName="Products"
        // hasDateFilter={true}
        hasSkuFilter={true}
        // hasPerPageFilter={true}
        tbLoading={tbLoading}
        manageCursor={manageCursor}
      />
    </>
  );
}
