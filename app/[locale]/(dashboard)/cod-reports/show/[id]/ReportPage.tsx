"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Details from "./Details";
import CarrierTable from "./CarrieTable";
import MainReportTable from "./MainReportTable";
import axiosPrivate from "@/axios/axios";
import type { RootState } from "@/store/store";
import type { AppDispatch } from "@/store/store";
import { _getOneReport } from "@/store/slices/reportSlice";
import type { OneReport } from "@/store/slices/reportSlice";

interface ReportPageProps {
  params: { id: string };
}

const ReportPage = ({ params }: ReportPageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [partialLoading, setPartialLoading] = useState<boolean>(false);
  const t = useTranslations("Reports");

  const OneReport = useSelector((state: RootState) => state.reports.OneReport);
  const dispatch = useDispatch<AppDispatch>();

  const fetchReport = useCallback(
    async (isPartialLoading?: boolean) => {
      if (isPartialLoading) {
        setPartialLoading(true);
      } else {
        setLoading(true);
      }
      try {
        const response = await axiosPrivate.post(
          `/api-table/control-tables/row-table-action/cod_rpt_requests/show_report/${params?.id}`
        );
        if (response?.data?.success) {
          dispatch(_getOneReport(response?.data as OneReport | OneReport[]));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setPartialLoading(false);
      }
    },
    [dispatch, params?.id]
  );

  useEffect(() => {
    if (params?.id) {
      fetchReport();
    }
  }, [params?.id, fetchReport]);

  // Check if report is empty or not found
  const isReportEmpty =
    !loading &&
    (Array.isArray(OneReport)
      ? OneReport.length === 0
      : Object.keys(OneReport || {}).length === 0);

  if (isReportEmpty) {
    console.log("Not Found");
    notFound();
  }

  if (loading) {
    return (
      <Card className="min-h-[70vh] dark:bg-default-50/70 flex items-center justify-center">
        <CardContent className="flex w-full flex-col items-center justify-center py-12">
          <Spinner className="size-8" />
          <p className="mt-4 text-sm text-muted-foreground">
            {t("loading") || "Loading..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          <Details />
        </div>
        <Card className="col-span-12 md:col-span-7">
          <CarrierTable
            params={params}
            fetchReport={fetchReport}
            partialLoading={partialLoading}
          />
        </Card>
      </div>

      <Card className="p-5 dark:bg-default-50/70">
        <MainReportTable params={params} />
      </Card>
    </div>
  );
};

export default ReportPage;
