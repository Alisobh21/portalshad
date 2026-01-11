"use client";

import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/store/store";
import type { OneReport } from "@/store/slices/reportSlice";

interface DetailRow {
  label: string;
  value: string | number | undefined;
}

const Details = () => {
  const t = useTranslations("Reports");

  const OneReport = useSelector((state: RootState) => {
    const report = state.reports.OneReport;
    // Handle both array and object cases
    return Array.isArray(report) ? report[0] : report;
  });

  const statistics = OneReport?.payload?.processing_statistics;

  const rows: DetailRow[] = [
    {
      label: t("totalRecords"),
      value: statistics?.TotalRecords?.value,
    },
    {
      label: t("unprocessedRecords"),
      value: statistics?.UnprocessedRecordsCount?.value,
    },
    {
      label: t("processedRecords"),
      value: statistics?.ProcessedRecordsCount?.value,
    },
    {
      label: t("processedViaReport"),
      value: statistics?.ProcessedThroughShippingCompanyReport?.value,
    },
    {
      label: t("processedViaManualUpdate"),
      value: statistics?.ProcessedThroughManualEntryUpdate?.value,
    },
    {
      label: t("processedViaAPI"),
      value: statistics?.ProcessedThroughTrackingAPI?.value,
    },
    {
      label: t("undefinedCarrierRecords"),
      value: statistics?.CountOfUndefinedCarriersRecords?.value,
    },
    {
      label: t("carriersInOriginal"),
      value:
        statistics?.ShippingCarriersIncludedInOriginalSheet?.value?.join(" | "),
    },
    {
      label: t("systemDefinedCarriers"),
      value:
        Object.values(statistics?.SystemDefinedShippingCarriers?.value || {})
          .map((carrier) => carrier.label)
          .join(" | ") || "—",
    },
    {
      label: t("undefinedCarriers"),
      value:
        Object.values(statistics?.UndefinedShippingCarriers?.value || {}).join(
          " | "
        ) || "—",
    },
    {
      label: t("total3plCustomers"),
      value: statistics?.Total3PLCustomersIncluded?.value,
    },
  ];

  return (
    <Card>
      <CardContent className="p-2 lg:p-5">
        <div className="flex flex-col gap-4 text-sm">
          {rows.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex flex-wrap gap-2 text-sm border-b border-border last:border-b-0 pb-3 last:pb-0"
            >
              <span className="font-medium w-full md:w-[300px]">{label}</span>
              <span className="text-xs break-words w-full md:flex-1 text-muted-foreground">
                {value ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Details;
