"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { BiSolidUserAccount } from "react-icons/bi";
import { _setAddressInsertionType } from "@/store/slices/geolocationSlice";
import {
  _setConsigneeStepValue,
  _setCurrentStep,
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
// import UpdateAddressModal from "@/components/UpdateAddressModal";

/* ================= Types ================= */

interface AddressWithDetails extends Address {
  name?: string;
  company_name?: string;
  mobile_number?: string | number;
  email?: string;
  label?: string;
  city?: string;
  full_address?: string;
  sa_short_address?: string;
  pairable_addresses?: Address[];
  [key: string]: unknown;
}

/* ================= Validation Helpers ================= */

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

/* ================= Component ================= */

export default function ConsigneeStep() {
  const { consigneeAddresses, loaders } = useSelector(
    (state: RootState) => state.geolocation
  );
  const { wizardCurrentStep } = useSelector((state: RootState) => state.awbs);
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [selectedAddress, setSelectedAddress] =
    useState<AddressWithDetails | null>(null);
  // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [addressPopoverOpen, setAddressPopoverOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState("");

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

  async function submitConsigneeStep() {
    const isValid = await trigger([
      "consignee_address_id",
      "consignee_name",
      "consignee_company",
      "consignee_phone",
      "consignee_email",
    ]);
    if (isValid) {
      dispatch(
        _setConsigneeStepValue({
          consignee_full_address: selectedAddress,
          consignee_address_id: selectedAddress?.id,
          consignee_name: watch("consignee_name"),
          consignee_company: watch("consignee_company"),
          consignee_phone: watch("consignee_phone"),
          consignee_email: watch("consignee_email"),
        })
      );
      dispatch(_setCurrentStep(3));
    }
  }

  useEffect(() => {
    if (consigneeAddresses?.length > 0) {
      const firstAddress = consigneeAddresses[0] as AddressWithDetails;
      setSelectedAddress(firstAddress);
      setValue("consignee_address_id", firstAddress?.id);
      setValue("consignee_name", firstAddress?.name || "");
      setValue("consignee_company", firstAddress?.company_name || "");
      setValue("consignee_phone", firstAddress?.mobile_number || "");
      setValue("consignee_email", firstAddress?.email || "");
    }
  }, [consigneeAddresses, setValue]);

  const filteredAddresses = consigneeAddresses?.filter((address) => {
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
      <div className={cn("w-full", wizardCurrentStep === 2 ? "" : "hidden")}>
        <div className="flex items-center gap-3 mb-5">
          <BiSolidUserAccount size={22} className="shrink-0" />
          <h2 className="text-xl font-bold">{t("consigneeInfo")}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Address Select Box */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <div className="flex gap-2 w-full">
                  <div className="flex-1">
                    <Label htmlFor="consignee_address_id">
                      {t("consigneeAddress")}
                    </Label>
                    <Popover
                      open={addressPopoverOpen}
                      onOpenChange={setAddressPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          id="consignee_address_id"
                          variant="outline"
                          role="combobox"
                          aria-expanded={addressPopoverOpen}
                          disabled={loaders?.getConsigneeAddresses}
                          className="w-full justify-between mt-2"
                        >
                          {selectedAddress
                            ? `${selectedAddress?.label || ""} - ${
                                selectedAddress?.city || ""
                              } ${selectedAddress?.full_address || ""}`
                            : t("consigneeAdddress")}
                          <span className="ml-2">▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder={t("consigneeAdddress")}
                            value={addressSearchQuery}
                            onValueChange={setAddressSearchQuery}
                          />
                          <CommandList>
                            {loaders?.getConsigneeAddresses ? (
                              <div className="flex items-center justify-center p-4">
                                <span className="text-sm text-muted-foreground">
                                  Loading...
                                </span>
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>No addresses found.</CommandEmpty>
                                <CommandGroup>
                                  {filteredAddresses?.map((address) => {
                                    const addressText = `${
                                      address?.label || ""
                                    } - ${address?.city || ""} ${
                                      address?.full_address || ""
                                    }`;
                                    return (
                                      <CommandItem
                                        key={address?.id}
                                        value={addressText}
                                        onSelect={() => {
                                          setValue(
                                            "consignee_address_id",
                                            address?.id
                                          );
                                          setSelectedAddress(address);
                                          setValue(
                                            "consignee_name",
                                            address?.name || ""
                                          );
                                          setValue(
                                            "consignee_company",
                                            address?.company_name || ""
                                          );
                                          setValue(
                                            "consignee_email",
                                            address?.email || ""
                                          );
                                          setValue(
                                            "consignee_phone",
                                            address?.mobile_number || ""
                                          );
                                          clearErrors("consignee_address_id");
                                          clearErrors("consignee_company");
                                          clearErrors("consignee_email");
                                          clearErrors("consignee_phone");
                                          setAddressPopoverOpen(false);
                                        }}
                                      >
                                        {addressText}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <input
                      type="hidden"
                      {...register("consignee_address_id", {
                        required: {
                          value: true,
                          message: `${t("pleaseEnter")} ${t(
                            "consigneeAddress"
                          )}`,
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
                        className="mt-8"
                      >
                        <Link
                          href="/search-addresses"
                          onClick={() => {
                            dispatch(_setAddressInsertionType("consignee"));
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
                        variant="outline"
                        className="mt-8 w-full lg:w-auto min-w-full lg:min-w-10 px-0"
                      >
                        <Link
                          href="/addresses"
                          onClick={() => {
                            dispatch(_setAddressInsertionType("consignee"));
                          }}
                        >
                          <FaMapMarkerAlt className="size-4 lg:mr-0 mr-2" />
                          <span className="inline-block lg:hidden">
                            {t("addNewAddress")}
                          </span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden lg:block">
                      <p>{t("addNewAddress")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {errors?.consignee_address_id && (
                  <InvalidFeedback
                    error={errors?.consignee_address_id?.message as string}
                  />
                )}

                {!selectedAddress?.sa_short_address && (
                  <Alert variant="warning" className="mt-2">
                    <AlertTitle>{t("nationalAddressNotFound")}</AlertTitle>
                    <AlertDescription>
                      <div className="flex flex-col gap-3">
                        <span>{t("SelectedNew")}</span>
                        <Button
                          className="max-w-[120px] self-start"
                          variant="primary"
                          size="md"
                          onClick={() => {
                            dispatch(_setAddressInsertionType("consignee"));
                            // setIsUpdateModalOpen(true);
                          }}
                        >
                          {t("updateAddress")}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <p className="text-[13px] bg-neutral-200/20 dark:bg-neutral-700/20 px-3 py-2 flex flex-wrap items-center gap-1 text-muted-foreground rounded-lg">
                  {tGeneral("addressTipPrefix")}
                  <LuSearch className="w-4 h-4" />
                  {tGeneral("addressTipSearch") + " "}
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {tGeneral("addressTipAdd")}
                </p>
              </div>
            </div>
          </div>

          {/* Consignee Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="consignee_name">{t("consigneeName")}</Label>
            <Input
              id="consignee_name"
              {...register("consignee_name", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("consigneeName")}`,
                },
              })}
              value={watch("consignee_name") || ""}
              placeholder={t("consigneeName")}
              onChange={() => trigger("consignee_name")}
            />
            {errors?.consignee_name && (
              <InvalidFeedback
                error={errors?.consignee_name?.message as string}
              />
            )}
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="consignee_company">{t("companyName")}</Label>
            <Input
              id="consignee_company"
              {...register("consignee_company", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("companyName")}`,
                },
              })}
              value={watch("consignee_company") || ""}
              placeholder={t("companyName")}
              onChange={() => trigger("consignee_company")}
            />
            {errors?.consignee_company && (
              <InvalidFeedback
                error={errors?.consignee_company?.message as string}
              />
            )}
          </div>

          {/* Consignee Phone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="consignee_phone">{t("consigneePhone")}</Label>
            <div className="relative">
              <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 rounded-md bg-neutral-200/20 dark:bg-neutral-700/20 py-1 px-4 w-[80px]">
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
                id="consignee_phone"
                className="pl-[90px]"
                {...register("consignee_phone", {
                  ...validatePhoneNumber(
                    `${t("pleaseEnter")} ${t("consigneePhone")}`,
                    t("phoneStartNotValidation"),
                    t("phoneLengthValidation")
                  ),
                })}
                value={watch("consignee_phone") || ""}
                placeholder={t("consigneePhone")}
                type="tel"
                onChange={() => trigger("consignee_phone")}
              />
            </div>
            {errors?.consignee_phone && (
              <InvalidFeedback
                error={errors?.consignee_phone?.message as string}
              />
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="consignee_email">{t("emailAddress")}</Label>
            <Input
              id="consignee_email"
              {...register("consignee_email", {
                ...validateEmail(
                  `${t("pleaseEnter")} ${t("emailAddress")}`,
                  t("emailAddressPatternValidation")
                ),
              })}
              value={watch("consignee_email") || ""}
              placeholder={t("emailAddress")}
              type="email"
              onChange={() => trigger("consignee_email")}
            />
            {errors?.consignee_email && (
              <InvalidFeedback
                error={errors?.consignee_email?.message as string}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => dispatch(_setCurrentStep(1))}
            >
              {t("prev")}
            </Button>
            <Button
              disabled={loaders?.getConsigneeAddresses}
              className="w-full"
              variant="primary"
              onClick={submitConsigneeStep}
            >
              {t("next")}
            </Button>
          </div>
        </div>
        {/* <UpdateAddressModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          address={selectedAddress}
        /> */}
      </div>
    </>
  );
}
