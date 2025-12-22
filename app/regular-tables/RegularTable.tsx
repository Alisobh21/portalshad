import React, { FC } from "react";
import RegularTableComponent from "./RegularTableComponent";

// Type definitions
interface TablePagination {
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  total?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  [key: string]: unknown;
}

interface TableData {
  columns?: Array<{
    name: string;
    selector?: (row: unknown) => unknown;
    cell?: (row: unknown) => React.ReactNode;
    sortable?: boolean;
    omit?: boolean;
    [key: string]: unknown;
  }>;
  rows?: unknown[];
  [key: string]: unknown;
}

interface RegularTableProps {
  tableData: TableData;
  hasSkuFilter?: boolean;
  exportFileName?: string;
  hasDateFilter?: boolean;
  hasPerPageFilter?: boolean;
  tablePagination?: TablePagination;
  tbLoading?: boolean;
  manageCursor?: (cursor: string | null) => void;
}

const RegularTable: FC<RegularTableProps> = ({
  tableData,
  hasSkuFilter,
  exportFileName,
  hasDateFilter,
  hasPerPageFilter,
  tablePagination,
  tbLoading,
  manageCursor,
}) => {
  return (
    <RegularTableComponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableData={tableData as any}
      exportFileName={exportFileName}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tablePagination={tablePagination as any}
      tbLoading={tbLoading}
      manageCursor={manageCursor}
      hasDateFilter={hasDateFilter}
      hasPerPageFilter={hasPerPageFilter}
      hasSkuFilter={hasSkuFilter}
    />
  );
};

export default RegularTable;

// Export types for reuse
export type { RegularTableProps, TableData, TablePagination };
