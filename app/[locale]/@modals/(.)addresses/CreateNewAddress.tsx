"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import { TbTextCaption } from "react-icons/tb";
import { RiUser6Fill } from "react-icons/ri";
import { RiBuildingFill } from "react-icons/ri";
import { HiMiniEnvelope } from "react-icons/hi2";
import { MdAssignmentAdd } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import InvalidFeedback from "@/components/InvalidFeedback";
import { insertAddress } from "@/helpers/asyncUtils";
import {
  _insertNewAddress,
  _insertNewConsigneeAddress,
  _insertReturnAddress,
  _insertReturnConsigneeAddress,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";
import { _setDefConsigneeOpt } from "@/store/slices/awbsSlice";
import { SuccessToast } from "@/components/Toasts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { RootState } from "@/store/store";
import type { City, Address } from "@/store/slices/geolocationSlice";
import axiosPrivate from "@/axios/axios";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

/* ================= Types ================= */

interface CitySearchResult extends City {
  name_ar?: string;
  name_en?: string;
}

interface FormData {
  sa_short_address?: string;
  label?: string;
  name?: string;
  company_name?: string;
  mobile_number?: string;
  email?: string;
  city?: string;
  address_line_1?: string;
  is_default?: boolean;
}

/* ================= Component ================= */

// Validation helpers
function validateEmail(
  requiredMsg: string,
  invalidMsg: string
): {
  required: { value: boolean; message: string };
  pattern: { value: RegExp; message: string };
} {
  return {
    required: { value: true, message: requiredMsg },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: invalidMsg,
    },
  };
}

function validatePhoneNumber(
  requiredMsg: string,
  invalidStartMsg: string,
  invalidLengthMsg: string
) {
  return {
    required: { value: true, message: requiredMsg },
    validate: (value: string | undefined) => {
      if (!value) return requiredMsg;
      if (!value.startsWith("5")) return invalidStartMsg;
      if (value.length !== 9) return invalidLengthMsg;
      return true;
    },
  };
}

export default function CreateNewAddress() {
  const { loaders, addressInsertionType } = useSelector(
    (state: RootState) => state.geolocation
  );
  const { returnWizardOpened } = useSelector((state: RootState) => state.awbs);
  const [initialCity, setInitialCity] = useState<CitySearchResult | null>(null);
  const t = useTranslations("ModelAddress");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchCityResult, setSearchCityResult] = useState<CitySearchResult[]>(
    []
  );
  const [searchCityLoading, setSearchCityLoading] = useState(false);
  const [searchCityQuery, setSearchCityQuery] = useState("");
  const [shortAddress] = useState(true);
  const [getShortAddressLoading, setGetShortAddressLoading] = useState(false);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  async function checkCityExists(
    cityName: string
  ): Promise<CitySearchResult | null> {
    if (!cityName || typeof cityName !== "string") {
      return null;
    }

    try {
      const response = await axiosPrivate.post<{
        data: CitySearchResult[];
      }>("/cities/search", {
        term: cityName,
      });

      const cities = response?.data?.data || [];

      const matchedCity = cities.find(
        (city: CitySearchResult) =>
          city.name_ar === cityName || city.name_en === cityName
      );

      return matchedCity || null;
    } catch {
      return null;
    }
  }

  async function getShortAddress(signal: AbortSignal) {
    setGetShortAddressLoading(true);

    try {
      const response = await axiosPrivate.get<{
        success: boolean;
        data?: {
          label?: string;
          city?: string;
          address_line_1?: string;
        };
      }>(
        `/addresses/short-address-details?sa_short_address=${watch(
          "sa_short_address"
        )}`,
        { signal }
      );

      if (response?.data?.success) {
        const data = response.data.data;

        if (data) {
          setValue("label", data?.label || "");

          const existingCity = await checkCityExists(data?.city || "");

          if (existingCity) {
            setInitialCity(existingCity);
            setSearchCityResult([existingCity]);
            setValue(
              "city",
              (existingCity[
                `name_${locale}` as keyof CitySearchResult
              ] as string) || ""
            );
            setValue("address_line_1", data?.address_line_1 || "");
          } else {
            setInitialCity(null);
            setValue("city", "");
            setValue("address_line_1", "");
            setSearchCityResult([]);
          }
        }
      } else {
        setInitialCity(null);
        setValue("city", "");
        setValue("address_line_1", "");
        setSearchCityResult([]);
      }
    } catch {
      setInitialCity(null);
      setValue("city", "");
      setValue("address_line_1", "");
      setSearchCityResult([]);
    } finally {
      setGetShortAddressLoading(false);
    }
  }

  const shipment_direction = returnWizardOpened ? "return" : "shipping";

  const handleCitySearch = async (value: string) => {
    setSearchCityQuery(value);

    if (value.length < 3) {
      // Preserve initial city if it exists
      if (initialCity) {
        setSearchCityResult([initialCity]);
      } else {
        setSearchCityResult([]);
      }
      return;
    }

    setSearchCityLoading(true);

    try {
      const response = await axiosPrivate.post<{
        data: CitySearchResult[];
      }>("/cities/search", {
        term: value,
      });

      const data = response?.data;
      const cities = data?.data || [];

      // Remove duplicates based on city ID
      const uniqueCities = cities.reduce(
        (acc: CitySearchResult[], current: CitySearchResult) => {
          const x = acc.find((item) => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        },
        []
      );

      // Merge with initial city if it exists and not already in results
      if (initialCity) {
        const hasInitialCity = uniqueCities.some(
          (city) => city.id === initialCity.id
        );
        if (!hasInitialCity) {
          setSearchCityResult([initialCity, ...uniqueCities]);
        } else {
          setSearchCityResult(uniqueCities);
        }
      } else {
        setSearchCityResult(uniqueCities);
      }
    } catch (err) {
      console.error("Error searching cities:", err);
      // Preserve initial city if it exists
      if (initialCity) {
        setSearchCityResult([initialCity]);
      } else {
        setSearchCityResult([]);
      }
    } finally {
      setSearchCityLoading(false);
    }
  };

  function insertNewAddress(data: FormData) {
    const selectedCity = searchCityResult?.find(
      (city) =>
        city?.[`name_${locale}` as keyof CitySearchResult] === data?.city
    );

    insertAddress(
      {
        ...data,
        shipment_direction,
        for_type: addressInsertionType,
        city_id: selectedCity?.id,
      },
      () =>
        dispatch(
          _toggleGeoloactionLoaders({ key: "insertingAddress", value: true })
        ),
      (responseData) => {
        const address =
          (responseData?.data as Address) ||
          (responseData as unknown as { address: Address })?.address;
        if (returnWizardOpened) {
          if (addressInsertionType === "shipper") {
            dispatch(_insertReturnAddress([{ ...address, selected: true }]));
          } else if (addressInsertionType === "consignee") {
            dispatch(_insertReturnConsigneeAddress([address]));
            dispatch(_setDefConsigneeOpt("consigneeAddress"));
          }
          toast(<SuccessToast msg={"Address inserted successfully"} />);
          router?.back();
        } else {
          if (addressInsertionType === "shipper") {
            dispatch(_insertNewAddress([address]));
            toast(<SuccessToast msg={"Address inserted successfully"} />);
            router?.back();
          } else if (addressInsertionType === "consignee") {
            dispatch(_insertNewConsigneeAddress([address]));
            toast(<SuccessToast msg={"Address inserted successfully"} />);
            router?.back();
          }
        }
      },
      undefined,
      () =>
        dispatch(
          _toggleGeoloactionLoaders({ key: "insertingAddress", value: false })
        )
    );
  }

  const shortAddressValue = watch("sa_short_address");

  useEffect(() => {
    const controller = new AbortController();
    if (shortAddressValue?.length !== 8) {
      setInitialCity(null);
      setValue("city", "");
      setValue("label", "");
      setValue("address_line_1", "");
      setSearchCityResult([]);
    }
    if (!shortAddressValue) return;
    if (shortAddressValue.length !== 8) return;
    if (!/^[A-Za-z]{4}\d{4}$/.test(shortAddressValue)) return;
    if (shortAddressValue?.length === 8) {
      getShortAddress(controller.signal);
    }

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortAddressValue]);

  // Reset search query when popover opens
  useEffect(() => {
    if (cityPopoverOpen) {
      const currentCity = watch("city");
      if (currentCity) {
        setSearchCityQuery(currentCity as string);
      } else {
        setSearchCityQuery("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityPopoverOpen]);

  return (
    <div className="relative">
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(insertNewAddress)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Short Address*/}
          <div className="flex flex-col lg:col-span-2 gap-2">
            <Label htmlFor="sa_short_address">
              {t("nationalAddressLabel")}
            </Label>
            <div className="relative">
              <TbTextCaption
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="sa_short_address"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("nationalAddressPlaceholder")}
                maxLength={8}
                value={watch("sa_short_address") ?? ""}
                {...register("sa_short_address", {
                  minLength: {
                    value: 8,
                    message: t("nationalAddressLength"),
                  },
                  maxLength: {
                    value: 8,
                    message: t("nationalAddressLength"),
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: t("nationalAddressPattern"),
                  },
                  validate: (value) => {
                    if (!value || value.trim() === "") {
                      return true;
                    }
                    if (value.length !== 8) return t("nationalAddressLength");
                    if (!/^[A-Za-z]{4}\d{4}$/.test(value))
                      return t("nationalAddressPattern");
                    return true;
                  },
                })}
              />
            </div>
            {errors?.sa_short_address && (
              <InvalidFeedback
                error={errors?.sa_short_address?.message as string}
              />
            )}
          </div>

          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col lg:col-span-2 gap-2"
            )}
          >
            <Label htmlFor="label">{t("addressLabel")}</Label>
            <div className="relative">
              <TbTextCaption
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="label"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("addressLabelPlaceholder")}
                value={watch("label") ?? ""}
                {...register("label", {
                  required: {
                    value: true,
                    message: t("addressLabelRequired"),
                  },
                })}
                onChange={(e) => {
                  setValue("label", e.target.value);
                }}
              />
            </div>
            {errors?.label && (
              <InvalidFeedback error={errors?.label?.message as string} />
            )}
          </div>

          {/* Full Name */}
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-2"
            )}
          >
            <Label htmlFor="name">{t("fullName")}</Label>
            <div className="relative">
              <RiUser6Fill
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="name"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("fullNamePlaceholder")}
                {...register("name", {
                  required: {
                    value: true,
                    message: t("fullNameRequired"),
                  },
                })}
              />
            </div>
            {errors?.name && (
              <InvalidFeedback error={errors?.name?.message as string} />
            )}
          </div>

          {/* Company Name */}
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-2"
            )}
          >
            <Label htmlFor="company_name">{t("companyName")}</Label>
            <div className="relative">
              <RiBuildingFill
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="company_name"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("companyNamePlaceholder")}
                {...register("company_name", {
                  required: {
                    value: true,
                    message: t("companyNameRequired"),
                  },
                })}
              />
            </div>
            {errors?.company_name && (
              <InvalidFeedback
                error={errors?.company_name?.message as string}
              />
            )}
          </div>

          {/* Phone Number */}
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-2"
            )}
          >
            <Label htmlFor="mobile_number">{t("phoneNumber")}</Label>
            <div className="relative">
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 rounded-md bg-neutral-200/20 dark:bg-neutral-700/20 py-1 px-4 w-[80px]",
                  locale === "ar" ? "right-1" : "left-1"
                )}
              >
                <Image
                  src="https://flagcdn.com/w20/sa.png"
                  alt="Saudi Arabia flag"
                  width={20}
                  height={20}
                  className="size-5"
                />
                <span className="text-[13px] opacity-65">+996</span>
              </div>
              <Input
                id="mobile_number"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-[90px]" : "pl-[90px]")}
                placeholder={t("phoneNumberPlaceholder")}
                type="tel"
                dir={locale === "ar" ? "rtl" : "ltr"}
                {...register("mobile_number", {
                  ...validatePhoneNumber(
                    t("phoneNumberRequired"),
                    t("phoneNumberInvalidStart"),
                    t("phoneNumberInvalidLength")
                  ),
                })}
              />
            </div>
            {errors?.mobile_number && (
              <InvalidFeedback
                error={errors?.mobile_number?.message as string}
              />
            )}
          </div>

          {/* Email Address */}
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-2"
            )}
          >
            <Label htmlFor="email">{t("emailAddress")}</Label>
            <div className="relative">
              <HiMiniEnvelope
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="email"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("emailAddressPlaceholder")}
                type="email"
                {...register("email", {
                  ...validateEmail(
                    t("emailAddressRequired"),
                    t("emailAddressInvalid")
                  ),
                })}
              />
            </div>
            {errors?.email && (
              <InvalidFeedback error={errors?.email?.message as string} />
            )}
          </div>

          <div className="flex flex-col gap-2 lg:col-span-2">
            <Label>{t("city")}</Label>

            <Controller
              name="city"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("cityRequired"),
                },
              }}
              render={({ field }) => (
                <Popover
                  open={cityPopoverOpen}
                  onOpenChange={setCityPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <span
                        className={cn(
                          "truncate flex-1",
                          locale === "ar" ? "text-right" : "text-left"
                        )}
                      >
                        {watch("city") || (
                          <span className="text-muted-foreground">
                            {t("typeThreeLettersPlaceholder")}
                          </span>
                        )}
                      </span>
                      <RiArrowDownSLine
                        className={cn(
                          "h-4 w-4 shrink-0",
                          locale === "ar" ? "mr-2" : "ml-2"
                        )}
                      />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="min-w-[var(--radix-popover-trigger-width)] p-0 z-[10000]"
                    align={locale === "ar" ? "end" : "start"}
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder=""
                        value={searchCityQuery}
                        onValueChange={(value) => {
                          setSearchCityQuery(value);
                          handleCitySearch(value);
                        }}
                      />

                      <CommandList>
                        {searchCityLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Spinner />
                          </div>
                        ) : searchCityResult.length === 0 ? (
                          <CommandEmpty>
                            {t("typeThreeLettersPlaceholder")}
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {searchCityResult.map((city) => {
                              const cityName = String(
                                city[
                                  `name_${locale}` as keyof CitySearchResult
                                ] || ""
                              );

                              return (
                                <CommandItem
                                  key={city.id}
                                  value={cityName}
                                  onSelect={() => {
                                    field.onChange(cityName);
                                    setSearchCityQuery(cityName);
                                    setCityPopoverOpen(false);
                                  }}
                                >
                                  {cityName}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors?.city && (
              <InvalidFeedback error={errors.city.message as string} />
            )}
          </div>
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col lg:col-span-2 gap-2"
            )}
          >
            <Label htmlFor="address_line_1">{t("addressLabel1")}</Label>
            <div className="relative">
              <FaMapMarkerAlt
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground",
                  locale === "ar" ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                id="address_line_1"
                autoComplete="no-complete"
                className={cn(locale === "ar" ? "pr-10" : "pl-10")}
                placeholder={t("addressPlaceholder")}
                value={watch("address_line_1") ?? ""}
                {...register("address_line_1", {
                  required: {
                    value: true,
                    message: t("addressRequired"),
                  },
                })}
                onChange={(e) => {
                  setValue("address_line_1", e.target.value);
                }}
              />
            </div>
            {errors?.address_line_1 && (
              <InvalidFeedback
                error={errors?.address_line_1?.message as string}
              />
            )}
          </div>

          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-2 lg:col-span-2"
            )}
          >
            <div className="flex items-center gap-2">
              <Checkbox id="is_default" {...register("is_default")} />
              <Label
                htmlFor="is_default"
                className="text-sm font-normal cursor-pointer"
              >
                {t("setAsDefault")}
              </Label>
            </div>
          </div>

          {/* Submit Form */}
          <div
            className={cn(
              !shortAddress && "pointer-events-none opacity-50",
              "flex flex-col gap-1 lg:col-span-2"
            )}
          >
            <Button
              type="submit"
              size="md"
              className="w-full"
              variant="modal"
              disabled={loaders?.insertingAddress}
            >
              {loaders?.insertingAddress ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  {t("insertAddress")}
                </>
              ) : (
                <>
                  <MdAssignmentAdd size={18} className="mr-2" />
                  {t("insertAddress")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {getShortAddressLoading && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-[200]">
          <div className="text-center">
            <Spinner className="size-8" />
            <p className="text-muted-foreground text-[14px] mt-2">
              {t("searchingNationalAddress")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
