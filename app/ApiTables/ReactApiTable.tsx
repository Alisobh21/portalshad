import React from "react";
import ApiTablesController from "./ApiTablesController";
import ApiTablesProvider from "./ApiTablesProvider";
import { FullPageTableLoader } from "@/components/Loaders";
import { Card } from "@/components/ui/card";

function ReactApiTable({ table, controller, children, params, tableStructureLoading }: any) {
    return (
        <ApiTablesProvider>
            {children}
            {tableStructureLoading ? (
                <Card className="p-5 dark:bg-none">
                    <FullPageTableLoader count={20} />
                </Card>
            ) : (
                controller || <ApiTablesController table={table} params={params} customElement={null} />
            )}
        </ApiTablesProvider>
    );
}

export default ReactApiTable;
