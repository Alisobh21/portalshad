"use client";

import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { FaUser, FaBuilding, FaCity } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axiosPrivate from "@/axios/axios";
import { useTranslations } from "next-intl";
import InvalidFeedback from "@/components/InvalidFeedback";
import { validatePhoneByCountry, countryData } from "@/helpers/utils";

/* ShadCN components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface AddressingProps {
  fetchOrder: () => void;
  id: string;
  status?: boolean;
}

interface RootState {
  app: {
    countries: Record<string, string>;
    loadingCountries: boolean;
  };
  orders: {
    oneOrder: Order | null;
  };
}

interface Order {
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    country?: string;
    city?: string;
    email?: string;
    phone?: string;
  };
}

interface FormValues {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  sa_short_address?: string;
}

const Addressing: FC<AddressingProps> = ({ fetchOrder, id, status }) => {
  const t = useTranslations("ShowOrder");
  const t2 = useTranslations("CreateOrder");

  const { countries } = useSelector((state: RootState) => state.app);
  const { oneOrder } = useSelector((state: RootState) => state.orders);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingShortAddress, setLoadingShortAddress] = useState(false);
  const [cityDisabled, setCityDisabled] = useState(false);
  const [touchedShortAddress, setTouchedShortAddress] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<FormValues>();

  const country = watch("country");
  const shortAddress = watch("sa_short_address");
  const phone = watch("phone") || "";

  const order_id = id;

  // Map country code to country name for phone validation and display
  const countryName = countries?.[country] || "";
  const flag = countryData[countryName]?.flag || "";
  const prefix = countryData[countryName]?.code || "";

  const countryValue = oneOrder?.shipping_address?.country;
  const matchedName =
    (countries &&
      Object.entries(countries || {}).find(
        ([code]) => code === countryValue
      )?.[1]) ||
    countryValue;

  // Handle form submit
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const payload = {
      order_id,
      first_name: data.first_name,
      last_name: data.last_name,
      address1: data.address1,
      address2: data.sa_short_address,
      country: data.country,
      city: data.city,
      email: data.email,
      phone: data.phone,
    };
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        "orders/updateShippingAddress",
        payload
      );
      if (response?.data?.success) {
        setEditMode(false);
        toast.success(t("shippingAddressUpdated"));
        fetchOrder();
      }
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize form values when entering edit mode
  useEffect(() => {
    if (editMode) {
      setValue("phone", oneOrder?.shipping_address?.phone || "");
      setValue("first_name", oneOrder?.shipping_address?.first_name || "");
      setValue("last_name", oneOrder?.shipping_address?.last_name || "");
      setValue("city", oneOrder?.shipping_address?.city || "");
      setValue("address1", oneOrder?.shipping_address?.address1 || "");
      setValue("email", oneOrder?.shipping_address?.email || "");

      // Properly match and set country
      const countryValue = oneOrder?.shipping_address?.country;
      if (countryValue && countries) {
        const isCode = Object.keys(countries).includes(countryValue);
        if (isCode) {
          setValue("country", countryValue);
        } else {
          const matchedCode = Object.entries(countries).find(
            ([, name]) => name === countryValue
          )?.[0];
          setValue("country", matchedCode || countryValue);
        }
      }

      // Always reset short address to original value when opening edit mode
      const originalShort =
        oneOrder?.shipping_address?.address2 ||
        getShortAddress(oneOrder?.shipping_address?.address1);
      setValue("sa_short_address", originalShort || "");
      // Reset touched state when opening edit mode
      setTouchedShortAddress(false);
    } else {
      // Reset touched state when exiting edit mode
      setTouchedShortAddress(false);
    }
  }, [editMode, oneOrder, countries, setValue]);

  // Set country from order data
  useEffect(() => {
    const countryValue = oneOrder?.shipping_address?.country;
    if (countryValue && countries) {
      const isCode = Object.keys(countries).includes(countryValue);
      if (isCode) {
        setValue("country", countryValue);
      } else {
        const matchedCode = Object.entries(countries).find(
          ([, name]) => name === countryValue
        )?.[0];
        setValue("country", matchedCode || countryValue);
      }
    }
  }, [oneOrder?.shipping_address?.country, countries, setValue]);

  // Reset fields when country changes
  useEffect(() => {
    if (country && editMode) {
      setValue("phone", "");
      setValue("city", "");
      setValue("address1", "");
      clearErrors("phone");
      clearErrors("city");
      clearErrors("address1");
    }
    if (country === oneOrder?.shipping_address?.country) {
      setValue("phone", oneOrder?.shipping_address?.phone || "");
      setValue("city", oneOrder?.shipping_address?.city || "");
      setValue("address1", oneOrder?.shipping_address?.address1 || "");
      setValue("address2", oneOrder?.shipping_address?.address2 || "");
      clearErrors("phone");
      clearErrors("city");
      clearErrors("address1");
      clearErrors("address2");
    }
  }, [country, editMode, setValue, clearErrors, oneOrder?.shipping_address]);

  // Re-validate phone when it changes
  useEffect(() => {
    if (country && phone && phone.length > 0) {
      clearErrors("phone");
      trigger("phone");
    }
  }, [phone, country, trigger, clearErrors]);

  // Handle phone input change to remove spaces
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "");
    setValue("phone", value);
  };

  // Fetch short address details
  useEffect(() => {
    const fetchShortAddressDetails = async () => {
      if (!editMode) return;
      if (!touchedShortAddress) return;
      if (!shortAddress || shortAddress?.length !== 8) return;
      if (!/^[A-Za-z]{4}\d{4}$/.test(shortAddress)) return;

      setLoadingShortAddress(true);
      setFirstLoad(true);
      try {
        const res = await axiosPrivate.get(
          `/addresses/short-address-details?sa_short_address=${shortAddress}`
        );
        if (res?.data?.success) {
          const data = res?.data?.data;
          setValue("city", data?.city || "");
          clearErrors("city");
          setValue("address1", data?.address_line_1 || "");
          clearErrors("address1");
          setCityDisabled(true);
          setFirstLoad(true);
        } else {
          setValue("sa_short_address", "");
          clearErrors("sa_short_address");
          setValue("city", "");
          clearErrors("city");
          setValue("address1", "");
          clearErrors("address1");
          setCityDisabled(false);
          setFirstLoad(true);
        }
      } catch {
        setValue("sa_short_address", "");
        clearErrors("sa_short_address");
        setValue("city", "");
        clearErrors("city");
        setValue("address1", "");
        clearErrors("address1");
        setCityDisabled(false);
        setFirstLoad(true);
      } finally {
        setLoadingShortAddress(false);
      }
    };

    fetchShortAddressDetails();
  }, [shortAddress, touchedShortAddress, editMode, setValue, clearErrors]);

  // Re-check short address when it changes
  useEffect(() => {
    if (country === "SA" && shortAddress !== undefined) {
      clearErrors("sa_short_address");
      trigger("sa_short_address");
    }
    if (
      (country === "SA" || country === "المملكة العربية السعودية") &&
      shortAddress?.length !== 8 &&
      firstLoad
    ) {
      setCityDisabled(false);
      setValue("city", "");
      clearErrors("city");
      setValue("address1", "");
      clearErrors("address1");
    }
  }, [shortAddress, country, firstLoad, trigger, clearErrors, setValue]);

  function getShortAddress(address?: string) {
    if (!address) return undefined;
    if (!address.includes("،")) return undefined;
    const firstPart = address.split(/،|,/)[0].trim();
    const regex = /^[A-Za-z]{4}\d{4}$/;
    if (!regex.test(firstPart)) return undefined;
    return firstPart;
  }

  return (
    <div className="w-full relative">
      {loadingShortAddress && (
        <div className="absolute inset-0 z-50 bg-white/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <Spinner className="text-primary" />
        </div>
      )}

      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <FaBuilding size={20} />
          </div>
          <h1 className="text-2xl font-semibold">{t("shippingAddress")}</h1>
        </div>

        {status && (
          <div>
            {editMode ? (
              <Button
                variant="normal"
                className="absolute top-[-20px] end-[4px]"
                size="icon"
                onClick={() => setEditMode(false)}
              >
                <IoClose size={20} />
              </Button>
            ) : (
              <Button
                variant="normal"
                className="absolute top-[-20px] end-[4px]"
                size="icon"
                onClick={() => setEditMode(true)}
              >
                <BiEditAlt size={17} />
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-3 px-2 lg:px-4">
        {editMode ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="first_name">{t("firstName")}</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder=" "
                  defaultValue={oneOrder?.shipping_address?.first_name}
                  {...register("first_name", {
                    required: t("firstNameRequired"),
                    minLength: { value: 2, message: t2("firstNameMin") },
                    maxLength: { value: 30, message: t2("firstNameMax") },
                    pattern: {
                      value: /^[\p{L}\s'-]+$/u,
                      message: t2("firstNamePattern"),
                    },
                  })}
                />
                {errors.first_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="last_name">{t("lastName")}</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder=" "
                  defaultValue={oneOrder?.shipping_address?.last_name}
                  {...register("last_name", {
                    required: t2("lastNameRequired"),
                    minLength: {
                      value: 2,
                      message: t2("lastNameMin"),
                    },
                    maxLength: {
                      value: 30,
                      message: t2("lastNameMax"),
                    },
                    pattern: {
                      value: /^[\p{L}\s'-]+$/u,
                      message: t2("lastNamePattern"),
                    },
                  })}
                />
                {errors.last_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country & City */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <Label>{t("country")}</Label>
                <Select
                  onValueChange={(val) => {
                    setValue("country", val);
                    trigger("country");
                  }}
                  value={watch("country")}
                >
                  <SelectTrigger className="w-full border">
                    <SelectValue placeholder={t("country")} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries &&
                      Object.entries(countries).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="city">{t("city")}</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=" "
                  disabled={!country || cityDisabled}
                  value={watch("city") || ""}
                  {...register("city", {
                    required: t("cityRequired"),
                    minLength: {
                      value: 2,
                      message: t("cityMin"),
                    },
                    maxLength: {
                      value: 50,
                      message: t("cityMax"),
                    },
                    pattern: {
                      value: /^[\p{L}\s'-]+$/u,
                      message: t("cityPattern"),
                    },
                  })}
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Short Address (Saudi Arabia Only) */}
            {country === "SA" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="sa_short_address">{t2("shortAddress")}</Label>
                <Input
                  id="sa_short_address"
                  type="text"
                  placeholder={t2("shortAddressPlaceholder")}
                  maxLength={8}
                  value={watch("sa_short_address") || ""}
                  {...register("sa_short_address", {
                    onChange: () => {
                      setTouchedShortAddress(true);
                    },
                    minLength: {
                      value: 8,
                      message: t2("shortAddressMin"),
                    },
                    maxLength: {
                      value: 8,
                      message: t2("shortAddressMax"),
                    },
                    validate: (value) => {
                      if (!value || value.trim() === "") {
                        return true;
                      }
                      const regex = /^[A-Za-z]{4}\d{4}$/;
                      if (value.length < 8) return t2("shortAddressMin");
                      if (!regex.test(value)) return t2("shortAddressPattern");
                      return true;
                    },
                  })}
                />
                {errors?.sa_short_address && (
                  <InvalidFeedback
                    error={errors?.sa_short_address?.message ?? ""}
                  />
                )}
                <p className="text-[12px] bg-muted/50 px-3 py-2 flex flex-wrap items-center gap-1 rounded-lg">
                  {t2("shortAddressNote")}
                </p>
              </div>
            )}

            {/* Address Line 1 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="address1">{t("address")}</Label>
              <Input
                id="address1"
                type="text"
                placeholder=" "
                value={watch("address1") || ""}
                {...register("address1", {
                  required: t("addressRequired"),
                  minLength: {
                    value: 5,
                    message: t("addressMin"),
                  },
                  maxLength: {
                    value: 100,
                    message: t("addressMax"),
                  },
                  pattern: {
                    value: /^[\p{L}0-9\s,.\-/'،]+$/u,
                    message: t("addressPattern"),
                  },
                })}
              />
              {errors.address1 && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address1.message}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=" "
                  defaultValue={oneOrder?.shipping_address?.email}
                  {...register("email", {
                    required: t("emailRequired"),
                    maxLength: {
                      value: 100,
                      message: t("emailMax"),
                    },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t2("emailPattern"),
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <div className="relative">
                  {country && flag && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 min-w-[60px] justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={flag}
                        alt={countryName}
                        className="w-5 h-4 rounded-sm object-cover"
                      />
                      {prefix && (
                        <span className="text-sm text-muted-foreground">
                          {prefix}
                        </span>
                      )}
                    </div>
                  )}
                  <Input
                    id="phone"
                    type="tel"
                    placeholder=" "
                    className={country && flag ? "pl-24" : ""}
                    value={phone}
                    {...register("phone", {
                      required: t("phoneRequired"),
                      pattern: {
                        value: /^[0-9]+$/,
                        message: t("phonePattern"),
                      },
                      validate: (value) => {
                        if (!country) return t("countryRequired");
                        if (!countryName) return t2("phonePattern");
                        const plainValue = value
                          .replace(/^(\+?2|0020)?/, "")
                          .trim();
                        if (!plainValue) return t("phoneRequired");
                        return validatePhoneByCountry(
                          countryName,
                          plainValue,
                          t2
                        );
                      },
                      onChange: handlePhoneChange,
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="lightOragne"
              disabled={loading}
            >
              {loading ? t("updating") : t("update")}
            </Button>
          </form>
        ) : (
          <>
            {/* Display Mode */}
            <div className="flex flex-col gap-2">
              <span>{t("fullName")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <FaUser />
                <span className="text-sm">
                  {oneOrder?.shipping_address?.first_name}{" "}
                  {oneOrder?.shipping_address?.last_name}
                </span>
              </div>
            </div>

            {/* Short Address Display (Saudi Arabia Only) */}
            {(oneOrder?.shipping_address?.country === "SA" ||
              oneOrder?.shipping_address?.country ===
                "المملكة العربية السعودية") &&
              (() => {
                const addrLine1 = oneOrder?.shipping_address?.address1 || "";
                const addrLine2 = oneOrder?.shipping_address?.address2 || "";

                if (addrLine2) {
                  return (
                    <div className="flex flex-col gap-2">
                      <span>{t2("shortAddress")}</span>
                      <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                        <span className="text-sm">{addrLine2}</span>
                      </div>
                    </div>
                  );
                }

                if (!addrLine1.includes("،") && !addrLine1.includes(","))
                  return null;

                const firstPart = addrLine1.split(/،|,/)[0].trim();
                const regex = /^[A-Za-z]{4}\d{4}$/;

                if (!regex.test(firstPart)) return null;

                return (
                  <div className="flex flex-col gap-2">
                    <span>{t2("shortAddress")}</span>
                    <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                      <span className="text-sm">{firstPart}</span>
                    </div>
                  </div>
                );
              })()}

            <div className="flex flex-col gap-2">
              <span>{t("address")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <FaCity />
                <span className="text-sm">
                  {oneOrder?.shipping_address?.address1 ||
                    oneOrder?.shipping_address?.address2}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>
                {t("country")} - {t("city")}
              </span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <FaLocationDot />
                <span className="text-sm">
                  {oneOrder?.shipping_address?.city} - {matchedName}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>{t("email")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <MdEmail />
                <span className="text-sm">
                  {oneOrder?.shipping_address?.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>{t("phone")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <MdEmail />
                <span className="text-sm">
                  {oneOrder?.shipping_address?.phone}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Addressing;
