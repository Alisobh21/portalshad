"use client";

import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { useEffect } from "react";

export default function AllReports() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/cod_rpt_requests",
    });
  }, [getTableStructure]);

  return (
    <ReactApiTable
      table={tableStructure}
      tableStructureLoading={tableStructureLoading}
    />
  );
}
