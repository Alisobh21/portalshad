"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import { flatKMNumbers } from "@/helpers/utils";
import type { RootState } from "@/store/store";
import { cn } from "@/lib/utils";

/* ================= Types ================= */

interface TableBindings {
  CanceledCount?: number | string;
  DeliveredCount?: number | string;
  DeliveryFailureCount?: number | string;
  OutForDeliveryCount?: number | string;
  ReadyForShipCount?: number | string;
  TrialFailureCount?: number | string;
  totalCount?: number | string;
  COD_Amount?: number | string;
  [key: string]: unknown;
}

interface ChartDataItem {
  label: string;
  shippingAwbs: number;
}

interface ShippingAwbsReportBindingsProps {
  customHeight?: string;
}

/* ================= Component ================= */

export default function ShippingAwbsReportBindings({
  customHeight,
}: ShippingAwbsReportBindingsProps) {
  const { tableBindings } = useSelector(
    (state: RootState & { tableCore?: { tableBindings: unknown } }) => {
      const stateWithTableCore = state as RootState & {
        tableCore?: { tableBindings: unknown };
      };
      return stateWithTableCore.tableCore || { tableBindings: null };
    }
  );
  const t = useTranslations("shippingAWBs");

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
    if (!value || !bindings?.totalCount) return 0;
    const total =
      typeof bindings.totalCount === "string"
        ? flatKMNumbers(bindings.totalCount)
        : bindings.totalCount;
    return Math.min((value / total) * 100, 100);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex flex-col">
          <p className="text-muted-foreground text-[15px]">
            {t("totalAwbsCount")}
          </p>
          <h2 className="text-4xl font-bold">
            {bindings?.totalCount !== undefined ? (
              bindings.totalCount
            ) : (
              <Spinner className="inline-block" />
            )}{" "}
            <span className="text-[14px] text-muted-foreground">
              {t("awb")}
            </span>
          </h2>
        </div>
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
        <div className="rounded-xl bg-neutral-200/20 dark:bg-neutral-700/20 lg:col-span-5 hidden xl:block">
          <ChartContainer
            config={chartConfig}
            className={cn(
              customHeight ? `lg:${customHeight}` : "lg:h-[350px]",
              "h-auto w-full"
            )}
          >
            <BarChart barSize={30} data={Object.values(chartData)}>
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign="top"
                iconType="circle"
              />
              <CartesianGrid vertical={false} opacity={0.05} />
              <XAxis
                textAnchor="end"
                height={80}
                angle={-25}
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                domain={[0, "dataMax"]}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="shippingAwbs"
                fill="var(--color-shippingAwbs)"
                radius={40}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:col-span-7">
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
                      {t("awb")}
                    </span>
                  </h2>
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <strong className="me-1 font-bold">
                      {getProgressPercentage(value?.shippingAwbs).toFixed(2)}%
                    </strong>{" "}
                    <span className="text-muted-foreground text-[14px]">
                      {t("ofTotal")} {t("awbs")}
                    </span>
                  </p>
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
