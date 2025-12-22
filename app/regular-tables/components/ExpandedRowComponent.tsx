import React, { FC, ReactNode } from "react";
import { TbCircleCheckFilled } from "react-icons/tb";

// Type definitions
interface ExpandedColumn {
  name: string;
  cell: (data: RowData) => ReactNode;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowData = Record<string, any>;

interface ExpandedRowComponentProps {
  data: RowData;
  columns: ExpandedColumn[];
}

const ExpandedRowComponent: FC<ExpandedRowComponentProps> = ({
  data,
  columns,
}) => {
  return (
    <div className="p-4 bg-content2">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="col-xl-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {columns?.map((col, index) => (
              <div className="text-small" key={index}>
                <div className="flex gap-1">
                  <TbCircleCheckFilled className="text-muted mt-1" />
                  <div className="me-2 text-foreground">
                    <strong className="mb-2 inline-block">{col?.name}</strong>
                    <div>{col?.cell(data)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRowComponent;

// Export types for reuse
export type { ExpandedRowComponentProps, ExpandedColumn, RowData };
