"use client";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export default function ReportTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/cod_rpt_requests",
    });
  }, []);
  return (
    <ReactApiTable
      table={tableStructure}
      tableStructureLoading={tableStructureLoading}
    />
  );
}
