"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { BiSolidUserBadge } from "react-icons/bi";
import { X } from "lucide-react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import {
  _setAddressInsertionType,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";
import {
  _setCurrentStep,
  _setShipperStepValue,
} from "@/store/slices/awbsSlice";
import InvalidFeedback from "@/components/InvalidFeedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import type { Address } from "@/store/slices/geolocationSlice";
import { cn } from "@/lib/utils";
import UpdateAddressModal from "@/components/UpdateAddressModal";
// import UpdateAddressModal from "@/components/UpdateAddressModal";

/* ================= Types ================= */

interface AddressWithDetails extends Address {
  name?: string;
  company_name?: string;
  mobile_number?: string | number;
  label?: string;
  city?: string;
  full_address?: string;
  sa_short_address?: string;
  pairable_addresses?: Address[];
  [key: string]: unknown;
}

/* ================= Validation Helpers ================= */

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

/* ================= Component ================= */

export default function ShipperStep() {
  const { addresses, loaders } = useSelector(
    (state: RootState) => state.geolocation
  );
  const { wizardCurrentStep } = useSelector((state: RootState) => state.awbs);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [addressPopoverOpen, setAddressPopoverOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState("");

  const dispatch = useDispatch();
  const methods = useFormContext();
  const locale = useLocale();
  const [selectedAddress, setSelectedAddress] =
    useState<AddressWithDetails | null>(null);
  const hasInitialized = useRef(false);
  const t = useTranslations("shippingAWBs");
  const tGeneral = useTranslations("General");

  const {
    register,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = methods;

  async function submitShipperStep() {
    const isValid = await trigger([
      "shipper_address_id",
      "shipper_name",
      "shipper_company",
      "shipper_phone",
    ]);
    if (isValid) {
      dispatch(_setCurrentStep(2));
      dispatch(
        _setShipperStepValue({
          shipper_full_address: selectedAddress,
          shipper_address_id: selectedAddress?.id,
          shipper_name: watch("shipper_name"),
          shipper_company: watch("shipper_company"),
          shipper_phone: watch("shipper_phone"),
        })
      );
    }
  }

  useEffect(() => {
    if (addresses?.length > 0 && !hasInitialized.current && !selectedAddress) {
      const firstAddress = addresses[0] as AddressWithDetails;
      setSelectedAddress(firstAddress);
      setValue("shipper_address_id", firstAddress?.id);
      setValue("shipper_name", firstAddress?.name || "");
      setValue("shipper_company", firstAddress?.company_name || "");
      setValue("shipper_phone", firstAddress?.mobile_number || "");
      hasInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  // Remove duplicates and filter addresses
  const filteredAddresses = addresses
    ?.filter((address, index, self) => {
      // Remove duplicates by ID
      return (
        index ===
        self.findIndex(
          (a) =>
            (a as AddressWithDetails)?.id ===
            (address as AddressWithDetails)?.id
        )
      );
    })
    .filter((address) => {
      if (!addressSearchQuery) return true;
      const searchLower = addressSearchQuery.toLowerCase();
      const addressLabel = (address as AddressWithDetails)?.label || "";
      const addressCity = (address as AddressWithDetails)?.city || "";
      const fullAddress = (address as AddressWithDetails)?.full_address || "";
      return (
        addressLabel.toLowerCase().includes(searchLower) ||
        addressCity.toLowerCase().includes(searchLower) ||
        fullAddress.toLowerCase().includes(searchLower)
      );
    }) as AddressWithDetails[];

  return (
    <>
      <div className={cn("w-full", wizardCurrentStep === 1 ? "" : "hidden")}>
        <div className="flex items-center gap-3 mb-5">
          <BiSolidUserBadge size={22} className="shrink-0" />
          <h2 className="text-xl font-bold">{t("shipperInfo")}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Address Select Box */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            {/* First Row: Label + Command + Two Icons */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="shipper_address_id">{t("shipperAddress")}</Label>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <Popover
                    open={addressPopoverOpen}
                    onOpenChange={setAddressPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        id="shipper_address_id"
                        variant="outline"
                        role="combobox"
                        aria-expanded={addressPopoverOpen}
                        disabled={loaders?.getAddresses}
                        className="w-full justify-between pr-2 min-w-0"
                      >
                        <span
                          className={cn(
                            "truncate flex-1 min-w-0 overflow-hidden",
                            locale === "ar" ? "text-right" : "text-left"
                          )}
                        >
                          {selectedAddress
                            ? `${selectedAddress?.label || ""} - ${
                                selectedAddress?.city || ""
                              } ${selectedAddress?.full_address || ""}`
                            : t("shipperAddress")}
                        </span>
                        <div
                          className={cn(
                            "flex items-center gap-1 shrink-0",
                            locale === "ar" ? "mr-2" : "ml-2"
                          )}
                        >
                          {selectedAddress && (
                            <div
                              role="button"
                              tabIndex={0}
                              className="h-4 w-4 opacity-50 hover:opacity-100 flex items-center justify-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                // Only clear the selected address and form values
                                // Keep all addresses in the list
                                setSelectedAddress(null);
                                setValue("shipper_address_id", "");
                                setValue("shipper_name", "");
                                setValue("shipper_company", "");
                                setValue("shipper_phone", "");
                                setAddressSearchQuery(""); // Clear search query to show all addresses
                                clearErrors("shipper_address_id");
                                clearErrors("shipper_name");
                                clearErrors("shipper_company");
                                clearErrors("shipper_phone");
                                // Don't reset hasInitialized - we want to keep the list
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedAddress(null);
                                  setValue("shipper_address_id", "");
                                  setValue("shipper_name", "");
                                  setValue("shipper_company", "");
                                  setValue("shipper_phone", "");
                                  setAddressSearchQuery("");
                                  clearErrors("shipper_address_id");
                                  clearErrors("shipper_name");
                                  clearErrors("shipper_company");
                                  clearErrors("shipper_phone");
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </div>
                          )}
                          {addressPopoverOpen ? (
                            <RiArrowUpSLine className="h-4 w-4" />
                          ) : (
                            <RiArrowDownSLine className="h-4 w-4" />
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      align={locale === "ar" ? "end" : "start"}
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder={t("shipperAddress")}
                          value={addressSearchQuery}
                          onValueChange={setAddressSearchQuery}
                        />
                        <CommandList>
                          {loaders?.getAddresses ? (
                            <div className="flex items-center justify-center p-4">
                              <span className="text-sm text-muted-foreground">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            <>
                              {filteredAddresses?.length === 0 ? (
                                <CommandEmpty>No addresses found.</CommandEmpty>
                              ) : (
                                <CommandGroup>
                                  {filteredAddresses?.map((address) => {
                                    const addressText = `${
                                      address?.label || ""
                                    } - ${address?.city || ""} ${
                                      address?.full_address || ""
                                    }`;
                                    // Use unique value combining ID and text to prevent duplicates
                                    const uniqueValue = `${address?.id}-${addressText}`;
                                    return (
                                      <CommandItem
                                        key={address?.id}
                                        value={uniqueValue}
                                        onSelect={() => {
                                          setValue(
                                            "shipper_address_id",
                                            address?.id
                                          );
                                          setSelectedAddress(address);
                                          setValue(
                                            "shipper_name",
                                            address?.name || ""
                                          );
                                          setValue(
                                            "shipper_company",
                                            address?.company_name || ""
                                          );
                                          setValue(
                                            "shipper_phone",
                                            address?.mobile_number || ""
                                          );
                                          dispatch(
                                            _toggleGeoloactionLoaders({
                                              key: "getConsigneeAddresses",
                                              value: false,
                                            })
                                          );
                                          clearErrors("shipper_address_id");
                                          clearErrors("shipper_name");
                                          clearErrors("shipper_company");
                                          clearErrors("shipper_phone");
                                          setAddressPopoverOpen(false);
                                        }}
                                      >
                                        {addressText}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    {...register("shipper_address_id", {
                      required: {
                        value: true,
                        message: `${t("pleaseChoose")} ${t("shipperAddress")}`,
                      },
                    })}
                  />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Link
                        href="/search-addresses"
                        onClick={() => {
                          dispatch(_setAddressInsertionType("shipper"));
                        }}
                      >
                        <LuSearch className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search your addresses</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="normal"
                      size="icon"
                      className="shrink-0"
                    >
                      <Link
                        href="/addresses"
                        onClick={() => {
                          dispatch(_setAddressInsertionType("shipper"));
                        }}
                      >
                        <FaMapMarkerAlt className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("addNewAddress")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {errors?.shipper_address_id && (
                <InvalidFeedback
                  error={errors?.shipper_address_id?.message as string}
                />
              )}

              {/* Second Row: Note/Tip */}
              <p className="text-[13px] bg-neutral-200/20 dark:bg-neutral-700/20 px-3 py-2 flex flex-wrap items-center gap-1 text-muted-foreground rounded-lg">
                {tGeneral("addressTipPrefix")}
                <LuSearch className="w-4 h-4" />
                {tGeneral("addressTipSearch") + " "}
                <FaMapMarkerAlt className="w-4 h-4" />
                {tGeneral("addressTipAdd")}
              </p>
            </div>

            {/* Third Row: Alert if no shortAddress (full width) */}
            {!selectedAddress?.sa_short_address && (
              <Alert variant="warning" className="lg:col-span-2">
                <AlertTitle className="dark:text-black">
                  {t("nationalAddressNotFound")}
                </AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col gap-3">
                    <span className="dark:text-black">{t("SelectedNew")}</span>
                    <Button
                      className="max-w-[120px] self-start"
                      variant="wizard"
                      size="md"
                      onClick={() => {
                        dispatch(_setAddressInsertionType("shipper"));
                        setIsUpdateModalOpen(true);
                      }}
                    >
                      {t("updateAddress")}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Shipper Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipper_name">{t("shipperName")}</Label>
            <Input
              id="shipper_name"
              {...register("shipper_name", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("shipperName")}`,
                },
              })}
              value={watch("shipper_name") || ""}
              placeholder={t("shipperName")}
              onChange={(e) => {
                setValue("shipper_name", e.target.value);
                trigger("shipper_name");
              }}
            />
            {errors?.shipper_name && (
              <InvalidFeedback
                error={errors?.shipper_name?.message as string}
              />
            )}
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipper_company">{t("companyName")}</Label>
            <Input
              id="shipper_company"
              {...register("shipper_company", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("companyName")}`,
                },
              })}
              value={watch("shipper_company") || ""}
              placeholder={t("companyName")}
              onChange={(e) => {
                setValue("shipper_company", e.target.value);
                trigger("shipper_company");
              }}
            />
            {errors?.shipper_company && (
              <InvalidFeedback
                error={errors?.shipper_company?.message as string}
              />
            )}
          </div>

          {/* Shipper Phone */}
          <div className="flex flex-col lg:col-span-2 gap-2">
            <Label htmlFor="shipper_phone">{t("shipperPhone")}</Label>
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
                id="shipper_phone"
                className={cn(locale === "ar" ? "pr-[90px]" : "pl-[90px]")}
                {...register("shipper_phone", {
                  ...validatePhoneNumber(
                    `${t("pleaseEnter")} ${t("shipperPhone")}`,
                    t("phoneStartNotValidation"),
                    t("phoneLengthValidation")
                  ),
                })}
                value={watch("shipper_phone") || ""}
                placeholder={t("shipperPhone")}
                type="tel"
                dir={locale === "ar" ? "rtl" : "ltr"}
                onChange={(e) => {
                  setValue("shipper_phone", e.target.value);
                  trigger("shipper_phone");
                }}
              />
            </div>
            {errors?.shipper_phone && (
              <InvalidFeedback
                error={errors?.shipper_phone?.message as string}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <Button
              disabled={loaders?.getAddresses}
              className="w-full"
              variant="modal"
              onClick={submitShipperStep}
            >
              {t("next")}
            </Button>
          </div>
        </div>
        <UpdateAddressModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          address={selectedAddress || undefined}
        />
      </div>
    </>
  );
}
