"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchShipping } from "@/store/slices/CountrySlice";
import type { RootState, AppDispatch } from "@/store/store";

type ShippingFormValues = {
  sl_carrier?: string;
  sl_method?: string;
};

export default function ShippingForm(): ReactElement {
  const tShipping = useTranslations("ShippingCompany");
  const dispatch = useDispatch<AppDispatch>();
  const { control, watch } = useFormContext<ShippingFormValues>();

  const shippingMethodsRaw = useSelector(
    (state: RootState) => state.country.shippingMethods
  );
  const shippingMethods = Array.isArray(shippingMethodsRaw)
    ? undefined
    : (shippingMethodsRaw as Record<string, Record<string, string>>);
  const loadingShippingMethods = useSelector(
    (state: RootState) => state.country.shippingLoading || false
  );

  useEffect(() => {
    dispatch(fetchShipping());
  }, [dispatch]);

  const shippingMethod = watch("sl_carrier");
  const selectedCompanies =
    (shippingMethods?.[shippingMethod ?? ""] as Record<string, string>) ?? {};

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-10">
      <FormField
        control={control}
        name="sl_carrier"
        rules={{
          required: tShipping("select_method_required"),
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light w-full">
              {tShipping("shipping_companies")}
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={loadingShippingMethods}
                >
                  <SelectTrigger className="pl-8 rtl:pr-8 w-full">
                    <SelectValue placeholder=" " />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingMethods &&
                      Object.entries(shippingMethods).map(([code]) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FaShippingFast className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sl_method"
        rules={{
          required: tShipping("select_company_required"),
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={`font-light w-full ${
                !shippingMethod ? "text-muted-foreground" : ""
              }`}
            >
              {tShipping("company_name")}
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!shippingMethod}
                >
                  <SelectTrigger className="pl-8 rtl:pr-8 whitespace-normal w-full">
                    <SelectValue placeholder=" " />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(selectedCompanies).map(([code, name]) => (
                      <SelectItem
                        key={code}
                        value={code}
                        className="whitespace-normal wrap-break-word"
                      >
                        <div className="whitespace-normal wrap-break-word">
                          {name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <LiaShippingFastSolid
                className={`pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground ${
                  !shippingMethod ? "text-muted-foreground" : ""
                }`}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
