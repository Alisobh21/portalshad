"use client";

import { useEffect } from "react";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";

interface MainReportTableProps {
  params: { id: string };
}

const MainReportTable = ({ params }: MainReportTableProps) => {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();

  useEffect(() => {
    getTableStructure({
      table: `/api-table/control-tables/load-table/cod_reqs_processing_res?request_id=${params.id}`,
    });
  }, [getTableStructure, params.id]);

  return (
    <ReactApiTable
      table={tableStructure}
      tableStructureLoading={tableStructureLoading}
      params={{ request_id: params?.id }}
    />
  );
};

export default MainReportTable;
