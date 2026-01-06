"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MdLibraryAdd } from "react-icons/md";
import useTableStructure from "@/app/ApiTables/hooks/useTableStructure";
import ReactApiTable from "@/app/ApiTables/ReactApiTable";
import ApiTablesController from "@/app/ApiTables/ApiTablesController";
import ReturnAwbsReportBindings from "./ReturnAwbsReportBindings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  _resetWizardSteps,
  _toggleReturnWizardOpening,
} from "@/store/slices/awbsSlice";
import {
  _getUserAddresses,
  _getUserReturnAddresses,
  _toggleGeoloactionLoaders,
  _getReturnConsigneeAddresses,
} from "@/store/slices/geolocationSlice";
import { getUserAddresses } from "@/helpers/asyncUtils";
import type { Address } from "@/store/slices/geolocationSlice";

interface AddressResponse {
  addresses?: Address[];
  info?: unknown;
}

/* ================= Component ================= */

export default function ReturnAwbsTable() {
  const { getTableStructure, tableStructure, tableStructureLoading } =
    useTableStructure();
  const t = useTranslations("shippingAWBs");
  const dispatch = useDispatch();

  useEffect(() => {
    getTableStructure({
      table: "/api-table/control-tables/load-table/return_awbs",
    });
    dispatch(_resetWizardSteps());
    dispatch(_getUserAddresses([]));
    dispatch(_toggleGeoloactionLoaders({ key: "getAddresses", value: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchReturnData() {
    getUserAddresses(
      "shipper",
      "regular",
      (data: unknown) => {
        const response = data as AddressResponse;
        dispatch(_getUserReturnAddresses(response?.addresses || []));
        dispatch(
          _toggleGeoloactionLoaders({ key: "getAddresses", value: false })
        );
      },
      true
    );
    getUserAddresses(
      "consignee",
      "regular",
      (data: unknown) => {
        const response = data as AddressResponse;
        dispatch(_getReturnConsigneeAddresses(response?.addresses || []));
        dispatch(
          _toggleGeoloactionLoaders({
            key: "getConsigneeAddresses",
            value: false,
          })
        );
      },
      true
    );
  }

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
                <Button
                  onClick={() => {
                    dispatch(_toggleReturnWizardOpening(true));
                    fetchReturnData();
                  }}
                  asChild
                  variant="modal"
                  className="px-5"
                >
                  <Link
                    href="/return-awbs/create"
                    className="flex items-center gap-2"
                  >
                    <MdLibraryAdd size={17} />
                    {t("returnAWBS.createShippingAwb")}
                  </Link>
                </Button>
              </div>
              <ReturnAwbsReportBindings />
            </CardContent>
          </Card>
        </div>
      </ReactApiTable>
    </>
  );
}
