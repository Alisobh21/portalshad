"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { Loader } from "lucide-react";
import {
  _setCurrentStep,
  _setShipmentStepValue,
} from "@/store/slices/awbsSlice";
import InvalidFeedback from "@/components/InvalidFeedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RootState } from "@/store/store";
import axiosPrivate from "@/axios/axios";
import { cn } from "@/lib/utils";

/* ================= Types ================= */

interface Carrier {
  slug: string;
  logo: string;
  label_ar?: string;
  label_en?: string;
  cod_available?: boolean;
  [key: string]: unknown;
}

interface CarriersResponse {
  success: boolean;
  data?: Carrier[];
  errors?: string | Record<string, unknown>;
}

/* ================= Component ================= */

export default function ShipmentStep() {
  const [shippingType, setShippingType] = useState<"branch" | "home">("branch");
  const {
    wizardCurrentStep,
    shippmentStepValues,
    shipperStepValues,
    consigneeStepValues,
    orderToBeReturned,
  } = useSelector((state: RootState) => state.awbs);
  const dispatch = useDispatch();
  const locale = useLocale();
  const t = useTranslations("shippingAWBs");
  const [carriersList, setCarriersList] = useState<Carrier[]>([]);
  const [getCarriersLoading, setGetCarriersLoading] = useState(true);

  function navigateWizard() {
    dispatch(_setCurrentStep(2));
  }

  const methods = useFormContext();
  const {
    register,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = methods;

  async function submitShipmentStep() {
    const isValid = await trigger([
      "shipping_company",
      "store_name",
      "order_number",
      "description",
      "weight",
      "number_of_pieces",
    ]);
    if (isValid) {
      dispatch(
        _setShipmentStepValue({
          pickup:
            consigneeStepValues?.return_dest_type === "ss-repository"
              ? "branch"
              : shippingType,
          payment_type: "cc",
          shipping_company: watch("shipping_company"),
          store_name: watch("store_name"),
          order_number: watch("order_number"),
          weight: watch("weight"),
          description: watch("description"),
          number_of_pieces: watch("number_of_pieces"),
        })
      );
      dispatch(_setCurrentStep(4));
    }
  }

  async function getCarriersList() {
    setGetCarriersLoading(true);

    const consigneeParam =
      consigneeStepValues?.return_dest_type === "ss-repository"
        ? `warehouse_id=${consigneeStepValues?.warehouse_id}`
        : `to=${
            (consigneeStepValues?.consignee_full_address as { city?: string })
              ?.city
          }`;

    try {
      const response = await axiosPrivate.get<CarriersResponse>(
        `/carrier-services/filtered-by-city?from=${
          (shipperStepValues?.shipper_full_address as { city?: string })?.city
        }&${consigneeParam}&shipment_direction=return`
      );
      if (response?.data?.success) {
        setCarriersList(response?.data?.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setGetCarriersLoading(false);
    }
  }

  useEffect(() => {
    dispatch(
      _setShipmentStepValue({
        ...shippmentStepValues,
        pickup:
          consigneeStepValues?.return_dest_type === "ss-repository"
            ? "branch"
            : shippingType,
      })
    );
    getCarriersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={cn("w-full", wizardCurrentStep === 3 ? "" : "hidden")}>
        <div className="flex items-center gap-2 mb-5">
          <BsFillBoxSeamFill size={18} className="shrink-0" />
          <h2 className="text-xl font-bold">{t("ShipmentInformation")}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {consigneeStepValues?.return_dest_type !== "ss-repository" && (
            <div className="lg:col-span-2">
              <Tabs
                value={shippingType}
                onValueChange={(value) =>
                  setShippingType(value as "branch" | "home")
                }
              >
                <TabsList className="w-full">
                  <TabsTrigger value="branch" className="flex-1">
                    {t("deliverToBranch")}
                  </TabsTrigger>
                  <TabsTrigger value="home" className="flex-1">
                    {t("homePickup")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {getCarriersLoading && (
            <div className="flex py-3 px-4 rounded-lg items-center lg:col-span-2 gap-3 bg-neutral-200/20 dark:bg-neutral-700/20">
              <Loader size={20} className="animate-spin" />
              <p className="text-sm text-muted-foreground">
                {t("loadingCarriers")}
              </p>
            </div>
          )}

          {!getCarriersLoading && carriersList?.length === 0 ? (
            <div className="px-4 py-3 lg:col-span-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
              <p className="text-sm">{t("noCarriersFound")}</p>
            </div>
          ) : (
            !getCarriersLoading &&
            carriersList?.length > 0 && (
              <div className="lg:col-span-2 flex flex-col gap-2">
                <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 p-1">
                  {carriersList?.map((carrier) => {
                    const isSelected =
                      watch("shipping_company") === carrier?.slug;
                    return (
                      <label
                        key={carrier?.slug}
                        className={cn(
                          "inline-flex m-0 bg-background hover:bg-accent items-center justify-start",
                          "flex-row w-full max-w-full cursor-pointer rounded-lg gap-4 p-4 border border-transparent",
                          "transition-colors",
                          isSelected && "border-primary bg-accent"
                        )}
                      >
                        <input
                          type="radio"
                          {...register("shipping_company", {
                            required: {
                              value: true,
                              message: `${t("pleaseEnter")} ${t(
                                "shippingCompany"
                              )}`,
                            },
                          })}
                          value={carrier?.slug}
                          checked={isSelected}
                          onChange={(e) => {
                            setValue("shipping_company", e.target.value, {
                              shouldValidate: true,
                            });
                            clearErrors("shipping_company");
                          }}
                          className="sr-only"
                        />
                        <div className="flex flex-col gap-2">
                          <Image
                            src={carrier?.logo || ""}
                            width={70}
                            height={70}
                            alt={carrier?.label_en || carrier?.label_ar || ""}
                            className="object-fit h-auto"
                          />
                          <span className="text-[14px]">
                            {locale === "ar"
                              ? carrier?.label_ar
                              : carrier?.label_en}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.shipping_company && (
                  <InvalidFeedback
                    error={errors?.shipping_company?.message as string}
                  />
                )}
              </div>
            )
          )}

          {/* Store Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="store_name">{t("storeName")}</Label>
            <Input
              id="store_name"
              placeholder={t("storeName")}
              {...register("store_name", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("storeName")}`,
                },
                minLength: {
                  value: 3,
                  message: `${t("storeName")} ${t("mustBeAtLeast")} 3 ${t(
                    "characters"
                  )}`,
                },
              })}
              value={watch("store_name") || ""}
              onChange={(e) => {
                setValue("store_name", e.target.value);
                trigger("store_name");
              }}
            />
            {errors?.store_name && (
              <InvalidFeedback error={errors?.store_name?.message as string} />
            )}
          </div>

          {/* Order Number */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="order_number">{t("orderNumber")}</Label>
            <Input
              id="order_number"
              placeholder={t("orderNumber")}
              disabled={!!orderToBeReturned}
              defaultValue={orderToBeReturned as string}
              {...register("order_number", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("orderNumber")}`,
                },
                minLength: {
                  value: 3,
                  message: `${t("orderNumber")} ${t("mustBeAtLeast")} 3 ${t(
                    "characters"
                  )}`,
                },
              })}
              value={watch("order_number") || ""}
              onChange={(e) => {
                setValue("order_number", e.target.value);
                trigger("order_number");
              }}
            />
            {errors?.order_number && (
              <InvalidFeedback
                error={errors?.order_number?.message as string}
              />
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              {...register("description", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("descriptionPlaceholder")}`,
                },
              })}
              value={watch("description") || ""}
              onChange={(e) => {
                setValue("description", e.target.value);
                trigger("description");
              }}
            />
            {errors?.description && (
              <InvalidFeedback error={errors?.description?.message as string} />
            )}
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="weight">{t("shipmentWeight")}</Label>
            <Input
              id="weight"
              type="number"
              placeholder={t("weightPlaceholder")}
              defaultValue={orderToBeReturned ? "1" : ""}
              {...register("weight", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("weightPlaceholder")}`,
                },
                min: {
                  value: 0.01,
                  message: t("shipmentMaxWeightValidation"),
                },
                max: {
                  value: 25,
                  message: t("shipmentMaxWeightValidation"),
                },
              })}
              value={watch("weight") || ""}
              onChange={(e) => {
                setValue("weight", e.target.value);
                trigger("weight");
              }}
            />
            {errors?.weight && (
              <InvalidFeedback error={errors?.weight?.message as string} />
            )}
          </div>

          {/* Number of parcels */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="number_of_pieces">{t("numberOfPieces")}</Label>
            <Input
              id="number_of_pieces"
              type="number"
              placeholder={t("numberOfPieces")}
              defaultValue={orderToBeReturned ? "1" : ""}
              {...register("number_of_pieces", {
                required: {
                  value: true,
                  message: `${t("pleaseEnter")} ${t("numberOfPieces")}`,
                },
                min: {
                  value: 1,
                  message: t("numberOfPiecesValidation"),
                },
                max: {
                  value: 5,
                  message: t("numberOfPiecesValidation"),
                },
              })}
              value={watch("number_of_pieces") || ""}
              onChange={(e) => {
                setValue("number_of_pieces", e.target.value);
                trigger("number_of_pieces");
              }}
            />
            {errors?.number_of_pieces && (
              <InvalidFeedback
                error={errors?.number_of_pieces?.message as string}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigateWizard()}
            >
              {t("prev")}
            </Button>
            <Button
              className="w-full"
              variant="modal"
              disabled={
                !watch("shipping_company") || watch("shipping_company") === ""
              }
              onClick={submitShipmentStep}
            >
              {t("createAWB")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
