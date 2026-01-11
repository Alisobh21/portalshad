"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
// Chart components are commented out in the original, keeping imports for future use
// import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { flatKMNumbers } from "@/helpers/utils";
import type { RootState } from "@/store/store";

/* ================= Types ================= */

interface TableBindings {
  CanceledCount?: number | string;
  DeliveredCount?: number | string;
  DeliveryFailureCount?: number | string;
  OutForDeliveryCount?: number | string;
  ReadyForShipCount?: number | string;
  TrialFailureCount?: number | string;
  totalCountNoFilters?: number | string;
  COD_Amount?: number | string;
  [key: string]: unknown;
}

interface ChartDataItem {
  label: string;
  shippingAwbs: number;
}

interface ShipmentsBindingProps {
  customHeight?: string;
  timeScope: string;
  setTimeScope: (value: string) => void;
}

/* ================= Component ================= */

export default function ShipmentsBinding({
  customHeight,
  timeScope,
  setTimeScope,
}: ShipmentsBindingProps) {
  const { tableBindings } = useSelector(
    (state: RootState & { tableCore?: { tableBindings: unknown } }) =>
      (state as any).tableCore || { tableBindings: null }
  );
  const t = useTranslations("shippingAWBs");
  const tShipments = useTranslations("Pending");

  const chartConfig = {
    shippingAwbs: {
      label: t("chartTitle"),
      color: "hsl(var(--chart-3))",
    },
  };

  const chartData = useMemo<Record<string, ChartDataItem>>(() => {
    const bindings = tableBindings as TableBindings | null;
    if (!bindings) {
      return {} as Record<string, ChartDataItem>;
    }

    return {
      cancelledAwbs: {
        label: t("shippingAwbsStatuses.cancelled"),
        shippingAwbs: flatKMNumbers(bindings?.CanceledCount || 0),
      },
      deliveredAwbs: {
        label: t("shippingAwbsStatuses.delivered"),
        shippingAwbs: flatKMNumbers(bindings?.DeliveredCount || 0),
      },
      deliveryFailureAwbs: {
        label: t("shippingAwbsStatuses.deliveryFailure"),
        shippingAwbs: flatKMNumbers(bindings?.DeliveryFailureCount || 0),
      },
      outForDeliveryAwbs: {
        label: t("shippingAwbsStatuses.outForDelivery"),
        shippingAwbs: flatKMNumbers(bindings?.OutForDeliveryCount || 0),
      },
      readyForShipmentAwbs: {
        label: t("shippingAwbsStatuses.readyForShipment"),
        shippingAwbs: flatKMNumbers(bindings?.ReadyForShipCount || 0),
      },
      trialFailureAwbs: {
        label: t("shippingAwbsStatuses.trialFailure"),
        shippingAwbs: flatKMNumbers(bindings?.TrialFailureCount || 0),
      },
    };
  }, [tableBindings, t]);

  const bindings = tableBindings as TableBindings | null;

  function getProgressPercentage(value: number): number {
    if (!value || !bindings?.totalCountNoFilters) return 0;
    const total =
      typeof bindings.totalCountNoFilters === "string"
        ? flatKMNumbers(bindings.totalCountNoFilters)
        : bindings.totalCountNoFilters;
    return Math.min((value / total) * 100, 100);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex pb-5">
        <Tabs value={timeScope} onValueChange={setTimeScope}>
          <TabsList className="bg-[#f4f4f5]  dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600/50 border-none">
            <TabsTrigger value="current_month" className="px-5">
              {tShipments("currentMonthShipments")}
            </TabsTrigger>
            <TabsTrigger value="all" className="px-5">
              {tShipments("all_shipments")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
        <div className="flex flex-col">
          <p className="text-muted-foreground text-[15px]">
            {t("totalShipmentsCount")}
          </p>
          <h2 className="text-4xl font-bold">
            {bindings?.totalCountNoFilters !== undefined ? (
              bindings.totalCountNoFilters
            ) : (
              <Spinner className="inline-block" />
            )}{" "}
            <span className="text-[14px] text-muted-foreground">
              {t("Shipment")}
            </span>
          </h2>
        </div>

        <div className="mx-4 h-full w-[2px] bg-content2 rounded-lg hidden lg:flex"></div>

        <div className="flex flex-col">
          <p className="text-muted-foreground text-[15px]">
            {t("totalCodAmount")}
          </p>
          <h2 className="text-4xl font-bold">
            {bindings?.COD_Amount !== undefined ? (
              bindings.COD_Amount
            ) : (
              <Spinner className="inline-block" />
            )}{" "}
            <span className="text-[14px] text-muted-foreground font-saudi">
              &#xE900;
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:col-span-12">
          {chartData &&
            Object.values(chartData).map((value, index) => (
              <div
                className="flex flex-col gap-2 p-5 rounded-xl justify-between bg-neutral-200/20 dark:bg-neutral-700/20"
                key={index}
              >
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-[15px]">
                    {value?.label}
                  </p>
                  <h2 className="text-4xl font-bold">
                    {value?.shippingAwbs !== undefined ? (
                      value.shippingAwbs
                    ) : (
                      <Spinner className="inline-block" />
                    )}{" "}
                    <span className="text-[14px] text-muted-foreground">
                      {t("Shipment")}
                    </span>
                  </h2>
                </div>
                <div className="flex flex-col gap-1">
                  <div>
                    <strong className="me-1 font-bold">
                      {getProgressPercentage(value?.shippingAwbs).toFixed(2)}%
                    </strong>{" "}
                    <span className="text-muted-foreground text-[14px]">
                      {t("ofTotal")}{" "}
                      <span className="text-foreground font-bold">
                        {bindings?.totalCountNoFilters !== undefined ? (
                          bindings.totalCountNoFilters
                        ) : (
                          <Spinner className="inline-block" />
                        )}
                      </span>{" "}
                      {t("Shipment")}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(value?.shippingAwbs)}%`,
                      }}
                      aria-label="Loading..."
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
