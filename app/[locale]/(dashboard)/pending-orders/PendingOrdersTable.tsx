"use client";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export default function PendingOrdersTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/sky_pending_orders",
    });
  }, []);
  return (
    <Card className="p-5">
      <ReactApiTable
        table={tableStructure}
        tableStructureLoading={tableStructureLoading}
      />
    </Card>
  );
}
