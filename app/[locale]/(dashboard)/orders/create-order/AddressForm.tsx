"use client";

import type { ReactElement } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvalidFeedback from "@/components/InvalidFeedback";
import axiosPrivate from "@/axios/axios";
import { validatePhoneByCountry, countryData } from "@/helpers/utils";
import type { RootState } from "@/store/store";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FaBuilding, FaUser } from "react-icons/fa";
import { BiSolidCity } from "react-icons/bi";
import { MdEmail, MdLocationOn } from "react-icons/md";

interface AddressFormValues {
  order_number?: string;
  s_first_name?: string;
  s_last_name?: string;
  s_city?: string;
  s_country?: string;
  s_address1?: string;
  s_email?: string;
  s_phone?: string;
  sa_short_address?: string;
}

/* =====================
   Props
===================== */

interface AddressFormProps {
  shortAddressValid: boolean;
  setShortAddressValid: (val: boolean) => void;
}

/* =====================
   Component
===================== */

export default function AddressForm({
  shortAddressValid,
  setShortAddressValid,
}: AddressFormProps): ReactElement {
  const { countries, loadingCountries } = useSelector(
    (state: RootState) => state.app
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // mark currently-unused props/state as intentionally read
  void shortAddressValid;
  void loadingCountries;

  const t = useTranslations("CreateOrder");

  const {
    watch,
    setValue,
    clearErrors,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<AddressFormValues>();

  const shortAddress = watch("sa_short_address");
  const country = watch("s_country");
  const phone = watch("s_phone") || "";
  const flag = country ? countryData?.[country]?.flag : undefined;
  const prefix = country ? countryData?.[country]?.code : undefined;

  const [cityDisabled, setCityDisabled] = useState(false);
  const [loadingShortAddress, setLoadingShortAddress] = useState(false);

  const orderNumberRef = useRef<string | null>(null);

  /* =====================
     Fetch short address
  ===================== */

  const resetShortAddress = useCallback(() => {
    setValue("sa_short_address", "");
    setValue("s_city", "");
    setValue("s_address1", "");
    clearErrors(["sa_short_address", "s_city", "s_address1"]);
    setCityDisabled(false);
    setShortAddressValid(false);
  }, [clearErrors, setShortAddressValid, setValue]);

  // If short address is empty or less than 8 chars, unlock city/address and mark invalid
  useEffect(() => {
    if (!shortAddress) {
      setCityDisabled(false);
      setValue("s_city", "");
      setValue("s_address1", "");
      setShortAddressValid(false);
      return;
    }

    if (shortAddress.length < 8) {
      setCityDisabled(false);
      setValue("s_city", "");
      setValue("s_address1", "");
      setShortAddressValid(false);
    }
  }, [setCityDisabled, setShortAddressValid, setValue, shortAddress]);

  useEffect(() => {
    if (!shortAddress || shortAddress.length !== 8) return;

    const fetchShortAddress = async () => {
      setLoadingShortAddress(true);
      try {
        const res = await axiosPrivate.get(
          `/addresses/short-address-details?sa_short_address=${shortAddress}`
        );

        if (res?.data?.success) {
          const data = res.data.data;
          setValue("s_city", data.city || "");
          setValue("s_address1", data.address_line_1 || "");
          clearErrors(["s_city", "s_address1"]);
          setCityDisabled(true);
          setShortAddressValid(true);
        } else {
          resetShortAddress();
        }
      } catch {
        resetShortAddress();
      } finally {
        setLoadingShortAddress(false);
      }
    };

    fetchShortAddress();
  }, [
    clearErrors,
    resetShortAddress,
    setShortAddressValid,
    setValue,
    shortAddress,
  ]);

  /* =====================
     Country change
  ===================== */

  useEffect(() => {
    if (!country) return;

    setValue("s_phone", "");
    setValue("s_city", "");
    setValue("s_address1", "");
    setValue("sa_short_address", "");
    clearErrors();
    setCityDisabled(false);

    setShortAddressValid(country !== "المملكة العربية السعودية");
  }, [clearErrors, country, setShortAddressValid, setValue]);

  /* =====================
     Phone validation
  ===================== */

  useEffect(() => {
    if (country && phone) {
      clearErrors("s_phone");
      trigger("s_phone");
    }
  }, [clearErrors, country, phone, trigger]);

  /* =====================
     Order number
  ===================== */

  useEffect(() => {
    if (user?.id && !orderNumberRef.current) {
      const generated = `sp-${Math.floor(Date.now() / 1000)}-${user.id}`;
      orderNumberRef.current = generated;
      setValue("order_number", generated);
    }
  }, [setValue, user]);

  /* =====================
     Render
  ===================== */

  return (
    <div className="relative">
      {loadingShortAddress && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/70 dark:bg-black/60 backdrop-blur">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-10">
        {/* Order number */}
        <div className="md:col-span-2">
          <FormField
            control={control}
            name="order_number"
            rules={{
              required:
                t("order_number_required") ?? "Order number is required",
              maxLength: { value: 25, message: t("orderNumberMax") },
              pattern: {
                value: /^[A-Za-z0-9\-_.]+$/,
                message: t("orderNumberPattern"),
              },
            }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("order_number")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder=" "
                      className="pl-8 rtl:pr-8"
                      {...field}
                    />
                  </FormControl>
                  <RiBarChartBoxAiFill className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.order_number && (
            <InvalidFeedback
              error={String(
                errors.order_number.message ?? "Order number is required"
              )}
            />
          )}
        </div>

        <div>
          <FormField
            control={control}
            name="s_first_name"
            rules={{
              required: t("firstNameRequired") ?? "First name is required",
              minLength: { value: 2, message: t("firstNameMin") },
              maxLength: { value: 30, message: t("firstNameMax") },
              pattern: {
                value: /^[\u0600-\u06FFa-zA-Z\s]+$/i,
                message: t("firstNamePattern"),
              },
            }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-light">{t("firstName")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder=" "
                      className="pl-8 rtl:pr-8"
                      {...field}
                    />
                  </FormControl>
                  <FaUser className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.s_first_name && (
            <InvalidFeedback
              error={String(errors.s_first_name.message ?? "")}
            />
          )}
        </div>

        {/* Last name */}
        <div>
          <FormField
            control={control}
            name="s_last_name"
            rules={{
              required: t("lastNameRequired"),
              minLength: { value: 2, message: t("lastNameMin") },
              maxLength: { value: 30, message: t("lastNameMax") },
              pattern: {
                value: /^[\u0600-\u06FFa-zA-Z\s]+$/i,
                message: t("lastNamePattern"),
              },
            }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-light">{t("lastName")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder=" "
                      type="text"
                      className="pl-8 rtl:pr-8"
                      {...field}
                    />
                  </FormControl>
                  <FaUser className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {errors?.s_last_name && (
            <InvalidFeedback error={String(errors.s_last_name.message ?? "")} />
          )}
        </div>

        {/* Country */}
        <div>
          <FormField
            control={control}
            name="s_country"
            rules={{ required: t("countryRequired") ?? "Country is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-light w-full">
                  {t("country")}
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="pl-8 rtl:pr-8 w-full">
                        <SelectValue placeholder={t("countryplaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(
                          countries ?? ({} as Record<string, string>)
                        ).map(([code, name]) => (
                          <SelectItem key={String(code)} value={String(name)}>
                            {String(name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/* أيقونة على يسار/يمين حسب RTL */}
                  <FaBuilding className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {errors?.s_country && (
            <InvalidFeedback error={String(errors.s_country.message ?? "")} />
          )}
        </div>

        {/* City */}
        <div>
          <FormField
            control={control}
            name="s_city"
            rules={{
              required: t("cityRequired") ?? "City is required",
              minLength: { value: 3, message: t("cityMin") },
              maxLength: { value: 50, message: t("cityMax") },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-light">{t("city")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      disabled={!country || cityDisabled}
                      className="pl-8 rtl:pr-8"
                    />
                  </FormControl>
                  <BiSolidCity className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {country === "المملكة العربية السعودية" && (
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="sa_short_address"
              rules={{
                minLength: { value: 8, message: t("shortAddressMin") },
                maxLength: { value: 8, message: t("shortAddressMax") },
                validate: (value) => {
                  if (!value || value.trim() === "") return true;
                  if (value.length < 8) return t("shortAddressMin");
                  // if (!regex.test(value)) return t("shortAddressPattern");
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-light">
                    {t("shortAddress")}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder={t("shortAddressPlaceholder")}
                        maxLength={8}
                        {...field}
                        className="pl-8 rtl:pr-8"
                      />
                    </FormControl>
                    <MdLocationOn className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                  </div>
                  <FormMessage />
                  <p className="text-[12px] bg-neutral-100 dark:bg-neutral-700/80 dark:text-white px-3 py-2 flex flex-wrap items-center gap-1  rounded-lg mt-2">
                    {t("shortAddressNote")}
                  </p>
                </FormItem>
              )}
            />
            {errors?.sa_short_address && (
              <InvalidFeedback
                error={String(errors.sa_short_address.message ?? "")}
              />
            )}
          </div>
        )}

        {/* Address */}
        <div className="md:col-span-2">
          <FormField
            control={control}
            name="s_address1"
            rules={{
              required: t("addressRequired"),
              minLength: { value: 5, message: t("addressMin") },
              maxLength: { value: 100, message: t("addressMax") },
            }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-light">{t("address")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      className="pl-8 rtl:pr-8"
                    />
                  </FormControl>
                  <MdLocationOn className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.s_address1 && (
            <InvalidFeedback error={String(errors.s_address1.message ?? "")} />
          )}
        </div>

        {/* Email */}
        <div>
          <FormField
            control={control}
            name="s_email"
            rules={{
              required: t("emailRequired"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("emailPattern"),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-light">{t("email")}</FormLabel>

                <div className="relative">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder=" "
                      {...field}
                      className="pl-8 rtl:pr-8"
                    />
                  </FormControl>

                  <MdEmail
                    size={16}
                    className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-accent-foreground"
                  />
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.s_email && (
            <InvalidFeedback error={String(errors.s_email.message ?? "")} />
          )}
        </div>

        {/* Phone */}
        <div>
          <FormField
            control={control}
            name="s_phone"
            rules={{
              required: t("phoneRequired"),
              pattern: {
                value: /^[0-9]+$/,
                message: t("phonePattern"),
              },
              validate: (value) => {
                if (!country) return t("countryRequired");

                const plainValue = (value ?? "")
                  .replace(/^(\+?2|0020)?/, "")
                  .trim();

                if (!plainValue) return t("phoneRequired");

                return validatePhoneByCountry(country, plainValue, t);
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-light">{t("phone")}</FormLabel>

                <div className="relative">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder=" "
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\s+/g, ""))
                      }
                      className="pl-[72px] rtl:pr-[72px]"
                    />
                  </FormControl>

                  {/* Flag + Prefix */}
                  <div className="pointer-events-none absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 min-w-[60px] justify-center">
                    {country && flag && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={flag}
                          alt={country}
                          className="w-5 h-4 rounded-sm object-cover"
                        />
                      </>
                    )}
                    {prefix && (
                      <span className="text-sm text-muted-foreground">
                        {prefix}
                      </span>
                    )}
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
