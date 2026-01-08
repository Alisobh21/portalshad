"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/store/store";

/* ================= Types ================= */

interface AddressWithDetails {
  id?: string | number;
  full_address?: string;
  name?: string;
  mobile_number?: string | number;
  phone?: string | number;
  email?: string;
  [key: string]: unknown;
}

/* ================= Component ================= */

export default function ShippingAwbSummary() {
  const { addresses, consigneeAddresses } = useSelector(
    (state: RootState) => state.geolocation
  );
  const { shipperStepValues, consigneeStepValues, wizardCurrentStep } =
    useSelector((state: RootState) => state.awbs);
  const t = useTranslations("shippingAWBs");
  
  // Get form context to watch live form values
  const formMethods = useFormContext();
  const { watch } = formMethods || { watch: () => "" };

  // Watch form values in real-time
  const shipperAddressId = watch("shipper_address_id");
  const shipperName = watch("shipper_name");
  const shipperCompany = watch("shipper_company");
  const shipperPhone = watch("shipper_phone");
  
  const consigneeAddressId = watch("consignee_address_id");
  const consigneeName = watch("consignee_name");
  const consigneeCompany = watch("consignee_company");
  const consigneePhone = watch("consignee_phone");
  const consigneeEmail = watch("consignee_email");

  const shipperAddress = useMemo(() => {
    const addressId = shipperAddressId || shipperStepValues?.shipper_address_id;
    const foundAddress = addresses?.find(
      (address) => address?.id === addressId
    ) as AddressWithDetails | undefined;
    
    // Return address with live form values if available
    if (foundAddress) {
      return {
        ...foundAddress,
        name: shipperName || foundAddress?.name || shipperStepValues?.shipper_name || "",
        company_name: shipperCompany || foundAddress?.company_name || shipperStepValues?.shipper_company || "",
        mobile_number: shipperPhone || foundAddress?.mobile_number || shipperStepValues?.shipper_phone || "",
      };
    }
    // If address not found but we have form values, return a minimal address object
    if (addressId && (shipperName || shipperCompany || shipperPhone)) {
      return {
        id: addressId,
        full_address: shipperStepValues?.shipper_full_address?.full_address || "",
        name: shipperName || shipperStepValues?.shipper_name || "",
        company_name: shipperCompany || shipperStepValues?.shipper_company || "",
        mobile_number: shipperPhone || shipperStepValues?.shipper_phone || "",
      } as AddressWithDetails;
    }
    return undefined;
  }, [shipperAddressId, shipperStepValues?.shipper_address_id, addresses, shipperName, shipperCompany, shipperPhone, shipperStepValues]);

  const consigneeAddress = useMemo(() => {
    const addressId = consigneeAddressId || consigneeStepValues?.consignee_address_id;
    const foundAddress = consigneeAddresses?.find(
      (address) => address?.id === addressId
    ) as AddressWithDetails | undefined;
    
    // Return address with live form values if available
    if (foundAddress) {
      return {
        ...foundAddress,
        name: consigneeName || foundAddress?.name || consigneeStepValues?.consignee_name || "",
        company_name: consigneeCompany || foundAddress?.company_name || consigneeStepValues?.consignee_company || "",
        mobile_number: consigneePhone || foundAddress?.mobile_number || consigneeStepValues?.consignee_phone || "",
        phone: consigneePhone || foundAddress?.phone || consigneeStepValues?.consignee_phone || "",
        email: consigneeEmail || foundAddress?.email || consigneeStepValues?.consignee_email || "",
      };
    }
    // If address not found but we have form values, return a minimal address object
    if (addressId && (consigneeName || consigneeCompany || consigneePhone || consigneeEmail)) {
      return {
        id: addressId,
        full_address: consigneeStepValues?.consignee_full_address?.full_address || "",
        name: consigneeName || consigneeStepValues?.consignee_name || "",
        company_name: consigneeCompany || consigneeStepValues?.consignee_company || "",
        mobile_number: consigneePhone || consigneeStepValues?.consignee_phone || "",
        phone: consigneePhone || consigneeStepValues?.consignee_phone || "",
        email: consigneeEmail || consigneeStepValues?.consignee_email || "",
      } as AddressWithDetails;
    }
    return undefined;
  }, [consigneeAddressId, consigneeStepValues?.consignee_address_id, consigneeAddresses, consigneeName, consigneeCompany, consigneePhone, consigneeEmail, consigneeStepValues]);

  return (
    <Card className="dark:bg-default-50/70 h-full p-5 lg:p-7 hidden xl:flex flex-col gap-3">
      <CardContent className="p-0 flex flex-col gap-3">
        <div className="space-y-1 pb-3">
          <h2 className="text-xl font-bold">{t("summary")}</h2>
          <p className="text-muted-foreground">{t("summaryDescription")}</p>
        </div>

        <div className="flex flex-col">
          {!shipperAddressId && Object.keys(shipperStepValues)?.length === 0 && (
            <Image
              width={350}
              height={350}
              className="max-w-[400px] h-auto object-fit block mx-auto"
              src="/3d-bill-label.png"
              alt="Shipping AWB Illustration"
            />
          )}

          {(shipperAddressId || Object.keys(shipperStepValues)?.length > 0) &&
            wizardCurrentStep >= 1 && (
              <div className="relative">
                <div className="absolute top-0 start-[-6px]">
                  <div className="rounded-full border-background border-4 bg-foreground w-[30px] h-[30px] flex items-center justify-center">
                    <span className="text-background font-bold text-[12px]">
                      1
                    </span>
                  </div>
                </div>

                <div className="border-s pb-5 space-y-3 border-dashed dark:border-white/50 border-foreground ps-6 ms-2">
                  <h3 className="font-medium text-[17px] leading-none pt-1">
                    {t("shippingFrom")}
                  </h3>
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-[14px] list-inside ps-3">
                    <li className="px-3 py-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20 lg:col-span-2">
                      <span className="font-medium">{t("address")}: </span>
                      <span className="text-muted-foreground">
                        {String(
                          shipperAddress?.full_address || "No address provided"
                        )}
                      </span>
                    </li>
                    <li className="px-3 py-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">{t("shipperName")}: </span>
                      <span className="text-muted-foreground">
                        {String(shipperAddress?.name || "")}
                      </span>
                    </li>
                    <li className="px-3 py-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">{t("shipperPhone")}: </span>
                      <span className="text-muted-foreground">
                        +966{String(shipperAddress?.mobile_number || "")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          {/* Consignee Information */}
          {(consigneeAddressId || Object.keys(consigneeStepValues)?.length > 0) &&
            wizardCurrentStep >= 2 && (
              <div className="relative">
                <div className="absolute top-0 start-[-6px]">
                  <div className="rounded-full border-background border-4 bg-foreground w-[30px] h-[30px] flex items-center justify-center">
                    <span className="text-background font-bold text-[12px]">
                      2
                    </span>
                  </div>
                </div>

                <div className="border-s pb-5 space-y-3 border-dashed dark:border-white/50 border-foreground ps-6 ms-2">
                  <h3 className="font-medium text-[17px] leading-none pt-1">
                    {t("shippingTo")}
                  </h3>
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-[14px] list-inside ps-3">
                    <li className="px-3 py-2 lg:col-span-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">{t("address")}: </span>
                      <span className="text-muted-foreground">
                        {String(consigneeAddress?.full_address || "")}
                      </span>
                    </li>
                    <li className="px-3 py-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">
                        {t("consigneeName")}:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {String(consigneeAddress?.name || "")}
                      </span>
                    </li>
                    <li className="px-3 py-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">
                        {t("consigneePhone")}:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        +966{String(consigneeAddress?.phone || "")}
                      </span>
                    </li>
                    <li className="px-3 py-2 lg:col-span-2 rounded-lg bg-neutral-200/20 dark:bg-neutral-700/20">
                      <span className="font-medium">
                        {t("consigneeEmail")}:
                      </span>
                      <span className="text-muted-foreground">
                        {String(
                          consigneeAddress?.email ||
                            consigneeStepValues?.consignee_email ||
                            ""
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          {/* Shipment Info */}
          {/* {Object.keys(shipperStepValues)?.length > 0 &&
                    Object.keys(consigneeStepValues)?.length > 0 &&
                    wizardCurrentStep >= 3 && (
                        <div className='relative'>
                            <div className='absolute top-0 start-[-6px]'>
                                <div className='rounded-full border-background border-[4px] bg-foreground w-[30px] h-[30px] flex items-center justify-center'>
                                    <span className='text-background font-bold text-[12px]'>3</span>
                                </div>
                            </div>

                            <div className='border-s-1 pb-5 space-y-3 border-dashed dark:border-white/50 border-foreground ps-6 ms-2'>
                                <h3 className='font-[500] text-[17px] leading-none pt-1'>{t('ShipmentInformation')}</h3>
                                <ul className='grid grid-cols-1 lg:grid-cols-2 gap-1 text-[14px] list-inside ps-3'>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('shippingCompany')}: </span>
                                        <span className='text-muted'>{selectedCarrier || '-'}</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('shippingType')}: </span>
                                        <span className='text-muted'>{shipperStepValues?.pickup || '-'}</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('cashOnDelivery')}: </span>
                                        <span className='text-muted'>
                                            {shipperStepValues?.payment_type === 'cc' ? t('disabled') : t('enabled')}
                                        </span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('storeName')} </span>
                                        <span className='text-muted'>{shipperStepValues?.store_name || '-'}</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('orderNumber')} </span>
                                        <span className='text-muted'>{shipperStepValues?.order_number || '-'}</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('description')} </span>
                                        <span className='text-muted'>{shipperStepValues?.description || '-'}</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('shipmentWeight')} </span>
                                        <span className='text-muted'>{shipperStepValues?.description || '-'} KG</span>
                                    </li>
                                    <li className='px-3 py-2 rounded-lg bg-content2/70'>
                                        <span className='font-[500]'>{t('numberOfPieces')} </span>
                                        <span className='text-muted'>{shipperStepValues?.description || '-'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )} */}
        </div>
      </CardContent>
    </Card>
  );
}
