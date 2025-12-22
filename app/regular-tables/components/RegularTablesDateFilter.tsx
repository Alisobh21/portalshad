"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

/* Redux */
import { _setSelectedDates } from "../provider/slices/mainSlice";
import type { AppDispatch } from "../provider/store";

/* ShadCN */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* Icons */
import { CalendarIcon } from "lucide-react";

interface FormValues {
  sku?: string;
  per_page?: string;
  date_range?: DateRange | undefined;
}

interface RegularTablesDateFilterProps {
  hasSkuFilter?: boolean;
  hasDateFilter?: boolean;
  hasPerPageFilter?: boolean;
}

const RegularTablesDateFilter: React.FC<RegularTablesDateFilterProps> = ({
  hasSkuFilter,
  hasDateFilter,
  hasPerPageFilter,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateFormRef = useRef<HTMLFormElement | null>(null);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      sku: "",
      per_page: "25",
      date_range: undefined,
    },
  });
  const t = useTranslations("ShowOrder");
  const locale = useLocale();

  const rawPathname = usePathname();
  const pathname = `${locale}${rawPathname}`;

  /* ---------------------------------- */
  /* Query Params Init */
  /* ---------------------------------- */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setQueryParams(params);
  }, []);

  useEffect(() => {
    if (queryParams.from || queryParams.to) {
      dispatch(
        _setSelectedDates({
          from: queryParams.from || null,
          to: queryParams.to || null,
        })
      );
    }

    reset({
      sku: queryParams.sku || "",
      per_page: queryParams.per_page || "25",
      date_range:
        queryParams.from && queryParams.to
          ? {
              from: new Date(queryParams.from),
              to: new Date(queryParams.to),
            }
          : undefined,
    });
  }, [queryParams, dispatch, reset]);

  /* ---------------------------------- */
  /* Helpers */
  /* ---------------------------------- */
  const formatRange = (range?: DateRange) => {
    if (!range?.from || !range?.to) return null;
    return {
      from: format(range.from, "yyyy/MM/dd"),
      to: format(range.to, "yyyy/MM/dd"),
    };
  };

  /* ---------------------------------- */
  /* Submit */
  /* ---------------------------------- */
  const onSubmit = (data: FormValues) => {
    const query: string[] = [];

    const dateRange = formatRange(data.date_range);
    if (dateRange) {
      query.push(`from=${dateRange.from}`, `to=${dateRange.to}`);
    }

    if (data.sku) query.push(`sku=${data.sku}`);
    if (data.per_page) query.push(`per_page=${data.per_page}`);

    const queryString = query.length ? `?${query.join("&")}` : "";
    window.location.href = `${window.location.origin}/${pathname}${queryString}`;
  };

  const handleReset = () => {
    reset({
      sku: "",
      date_range: undefined,
      per_page: "25",
    });
    dispatch(_setSelectedDates({ from: null, to: null }));
    window.location.href = `${window.location.origin}/${pathname}`;
  };

  return (
    <form
      ref={updateFormRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col xl:flex-row xl:items-end gap-3 w-full"
    >
      {/* Date Range */}
      {hasDateFilter && (
        <Controller
          name="date_range"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[260px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="me-2 h-4 w-4" />
                  {field.value?.from
                    ? `${format(field.value.from, "PPP")} - ${
                        field.value.to ? format(field.value.to, "PPP") : ""
                      }`
                    : t("searchDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      )}

      {/* SKU */}
      {hasSkuFilter && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Controller
            name="sku"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                id="sku"
                placeholder="Search with SKU"
                className="max-w-[220px]"
              />
            )}
          />
        </div>
      )}

      {/* Submit */}
      <Button type="submit" variant="outline">
        {t("update")}
      </Button>

      {/* Reset */}
      <Button type="button" variant="outline" onClick={handleReset}>
        {t("reset")}
      </Button>

      {/* Per Page */}
      {hasPerPageFilter && (
        <div className="ms-auto">
          <Controller
            name="per_page"
            control={control}
            defaultValue="25"
            render={({ field }) => (
              <Select
                value={field.value || "25"}
                onValueChange={(val: string) => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("per_page", val);
                  window.location.href = `${
                    window.location.origin
                  }/${pathname}?${params.toString()}`;
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
    </form>
  );
};

export default RegularTablesDateFilter;
