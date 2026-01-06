"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MdLibraryAdd } from "react-icons/md";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import ApiTablesController from "@/app/ApiTables/ApiTablesController";
import ShippingAwbsReportBindings from "./ShippingAwbsReportBindings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { _resetWizardSteps } from "@/store/slices/awbsSlice";
import {
  _getUserAddresses,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";

/* ================= Component ================= */

export default function ShippingAwbsTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  const dispatch = useDispatch();
  const t = useTranslations("shippingAWBs");

  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/shipping_awbs",
    });
    dispatch(_resetWizardSteps());
    dispatch(_getUserAddresses([]));
    dispatch(_toggleGeoloactionLoaders({ key: "getAddresses", value: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ReactApiTable
        controller={
          <Card className="dark:bg-default-50/70 p-5">
            <CardContent className="p-0">
              <ApiTablesController table={tableStructure} />
            </CardContent>
          </Card>
        }
        tableStructureLoading={tableStructureLoading}
      >
        <div className="w-full mb-5">
          <Card className="dark:bg-default-50/70 p-5">
            <CardContent className="flex flex-col gap-5 p-0">
              <div className="w-auto">
                <Button asChild variant="modal" className="px-5">
                  <Link
                    href="/shipping-awbs/create"
                    className="flex items-center gap-2"
                  >
                    <MdLibraryAdd size={17} />
                    {t("createShippingAwb")}
                  </Link>
                </Button>
              </div>
              <ShippingAwbsReportBindings />
            </CardContent>
          </Card>
        </div>
      </ReactApiTable>
    </>
  );
}
