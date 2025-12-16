"use client";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { useEffect } from "react";

export default function UsersTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  useEffect(() => {
    getTableStructure({ table: "users" });
  }, []);
  return (
    <>
      <ReactApiTable
        table={tableStructure}
        tableStructureLoading={tableStructureLoading}
      />
    </>
  );
}
