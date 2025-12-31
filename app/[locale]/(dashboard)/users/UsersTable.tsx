"use client";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export default function UsersTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  useEffect(() => {
    getTableStructure({ table: "users" });
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
