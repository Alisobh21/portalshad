"use client";

import React, { useMemo } from "react";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
// @ts-expect-error - react-data-table-component doesn't have proper TypeScript types
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { flattenData, mapStatusToString } from "./helpers/utils";

import TableColumnsVisibility from "./components/TableColumnsVisibilty";
import RegularTablesExport from "./components/RegularTablesExport";
import ExpnadedRowComponent from "./components/ExpandedRowComponent";
import RegularTablePagination from "./components/RegularTablePagination";
import RegularTablesDateFilter from "./components/RegularTablesDateFilter";

import { TableLoader } from "@/components/Loaders";
import type { RootState } from "./provider/store";

/* =========================
   Types
========================= */

interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RegularTableComponentProps<T = any> {
  tableData?: T[];
  exportFileName?: string;
  tablePagination?: PaginationInfo;
  hasDateFilter?: boolean;
  hasSkuFilter?: boolean;
  hasPerPageFilter?: boolean;
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

/* =========================
   Component
========================= */

function RegularTableComponent<T>({
  tableData = [],
  exportFileName = "",
  tablePagination,
  hasDateFilter,
  hasSkuFilter,
  hasPerPageFilter,
  tbLoading = false,
  manageCursor,
}: RegularTableComponentProps<T>) {
  const { columns } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );

  const t = useTranslations("General");

  const flattenedData = useMemo(
    () => flattenData(tableData?.rows || []),
    [tableData]
  );

  return (
    <>
      {/* Filters */}
      <div className="ms-auto row g-2 align-items-end mb-10">
        <RegularTablesDateFilter
          hasDateFilter={hasDateFilter}
          hasPerPageFilter={hasPerPageFilter}
          hasSkuFilter={hasSkuFilter}
        />
      </div>

      {/* Actions */}
      <div className="mb-5 flex gap-2 flex-wrap flex-col sm:flex-row">
        {/* Columns Visibility */}
        <TableColumnsVisibility />

        {/* Table Export */}
        <RegularTablesExport
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as any}
          filename={exportFileName}
          data={flattenedData?.map((item: Record<string, unknown>) => ({
            ...item,
            ready_to_ship: item?.ready_to_ship ? t("yes") : t("no"),
            system_status: mapStatusToString(item?.system_status as string),
          }))}
        />
      </div>

      {/* Table Body */}
      <div className="rdt-table-holder table-manual">
        <DataTable
          data={flattenedData}
          columns={columns}
          sortIcon={<HiOutlineChevronUpDown className="me-1" />}
          expandableRows
          expandableRowsComponentProps={{ columns }}
          expandableRowsComponent={ExpnadedRowComponent}
          noDataComponent={
            <div className="py-4 text-center dark:bg-content2 dark:text-foreground w-full">
              {t("noData")}
            </div>
          }
          persistTableHead={true}
          progressPending={tbLoading}
          progressComponent={<TableLoader count={10} />}
        />
      </div>

      {/* Pagination */}
      <div className="mt-3">
        <RegularTablePagination
          manageCursor={manageCursor || (() => {})}
          pagination={tablePagination}
        />
      </div>
    </>
  );
}

export default RegularTableComponent;

// Export types
export type { RegularTableComponentProps, PaginationInfo };
