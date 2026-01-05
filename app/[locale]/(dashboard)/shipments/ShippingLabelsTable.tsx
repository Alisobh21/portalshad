"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import { Card } from "@/components/ui/card";
import ShipmentsBinding from "./ShipmentsBinding";
import TableCard from "@/components/TableCard";
import ApiTablesController from "@/app/ApiTables/ApiTablesController";

/* ================= Types ================= */

interface TimeScopeParams {
  time_scope?: string;
  [key: string]: unknown;
}

/* ================= Component ================= */

export default function ShippingLabelsTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTimeScope = searchParams.get("time_scope") || "current_month";
  const [timeScope, setTimeScope] = useState<string>(initialTimeScope);

  const handleTimeScopeChange = (key: string) => {
    setTimeScope(key);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("time_scope", key);
    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/shipping_labels",
      params: { time_scope: timeScope },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeScope]);

  const params: TimeScopeParams = { time_scope: timeScope };

  return (
    <>
      <ReactApiTable
        params={params}
        controller={
          <TableCard className="p-5 dark:bg-default-50/70 overflow-visible static">
            <ApiTablesController params={params} table={tableStructure} />
          </TableCard>
        }
        tableStructureLoading={tableStructureLoading}
      >
        <div className="w-full mb-5">
          <ShipmentsBinding
            timeScope={timeScope}
            setTimeScope={handleTimeScopeChange}
          />
        </div>
      </ReactApiTable>
    </>
  );
}
