"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { GoCheckCircleFill } from "react-icons/go";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { BiSolidUserAccount, BiSolidUserBadge } from "react-icons/bi";
import ShipperStep from "./(steps)/ShipperStep";
import ConsigneeStep from "./(steps)/ConsigneeStep";
import ShipmentStep from "./(steps)/ShipmentStep";
import CreateScreen from "./(steps)/CreateScreen";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  _getConsigneeAddresses,
  _getUserAddresses,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";
import { getUserAddresses } from "@/helpers/asyncUtils";
import type { RootState } from "@/store/store";
import { cn } from "@/lib/utils";

/* ================= Types ================= */

interface WizardStep {
  stepNo: number;
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface FormData {
  [key: string]: unknown;
}

/* ================= Component ================= */

export default function CreateShippingAWBForm() {
  const { wizardCurrentStep } = useSelector((state: RootState) => state.awbs);
  const methods = useForm<FormData>({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const t = useTranslations("shippingAWBs");

  useEffect(() => {
    getUserAddresses("shipper", "regular", (data: unknown) => {
      const addressData = data as { addresses?: unknown[] };
      dispatch(_getUserAddresses((addressData?.addresses || []) as never[]));
      dispatch(
        _toggleGeoloactionLoaders({ key: "getAddresses", value: false })
      );
    });
    getUserAddresses("consignee", "regular", (data: unknown) => {
      const addressData = data as { addresses?: unknown[] };
      dispatch(
        _getConsigneeAddresses((addressData?.addresses || []) as never[])
      );
      dispatch(
        _toggleGeoloactionLoaders({ key: "getAddresses", value: false })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createAWBHandler(data: FormData) {
    console.log("Form submitted with data:", data);
  }

  const wizardSteps: WizardStep[] = [
    {
      stepNo: 1,
      key: "shipper",
      label: t("shipperInfo"),
      icon: <BiSolidUserBadge size={21} />,
    },
    {
      stepNo: 2,
      key: "consignee",
      label: t("consigneeInfo"),
      icon: <BiSolidUserAccount size={21} />,
    },
    {
      stepNo: 3,
      key: "shipment",
      label: t("ShipmentInformation"),
      icon: <BsFillBoxSeamFill size={19} />,
    },
  ];

  return (
    <>
      <Card className="dark:bg-default-50/70 p-5 flex flex-col gap-5 lg:p-7">
        <CardContent className="p-0">
          <div className="rounded-lg lg:border dark:border-neutral-700 p-1 lg:mb-4">
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 overflow-hidden rounded-lg">
              {wizardSteps?.map((step) => (
                <div
                  key={step?.key}
                  className={cn(
                    "bg-neutral-200/20 dark:bg-neutral-700/20 pointer-events-none p-3",
                    step?.stepNo > wizardCurrentStep
                      ? "opacity-50"
                      : step?.stepNo <= wizardCurrentStep
                      ? "bg-primary/10 dark:bg-primary-100/10 text-primary-600"
                      : ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    {step?.icon}
                    <span className="text-[14px]">{step?.label}</span>
                    <GoCheckCircleFill
                      size={18}
                      className={cn(
                        "text-primary-600",
                        step?.stepNo < wizardCurrentStep
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 block lg:hidden">
              <ol className="relative pt-[30px] grid grid-cols-3 gap-8 before:absolute before:-mt-px before:h-[2px] before:start-[50%] before:translate-x-[50%] before:rounded-full before:border-b-2 before:border-dashed before:w-[66.66%] dark:before:opacity-10">
                {wizardSteps?.map((step, idx) => (
                  <li
                    key={idx}
                    className="relative -mt-[55px] flex flex-col items-center justify-center"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "z-1 opacity-100 w-[50px] flex shrink-0 h-[50px] rounded-full bg-background dark:bg-[#111113] items-center justify-center transition-transform hover:scale-105",
                            step?.stepNo > wizardCurrentStep
                              ? "text-foreground"
                              : step?.stepNo <= wizardCurrentStep
                              ? "text-primary-600 dark:text-primary-200"
                              : "text-foreground"
                          )}
                        >
                          {step?.icon}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-1"
                        side="bottom"
                        align="center"
                      >
                        {step?.label}
                      </PopoverContent>
                    </Popover>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <FormProvider {...methods}>
            <form noValidate onSubmit={methods.handleSubmit(createAWBHandler)}>
              <div className={cn(wizardCurrentStep === 1 ? "" : "hidden")}>
                <ShipperStep />
              </div>
              <div className={cn(wizardCurrentStep === 2 ? "" : "hidden")}>
                <ConsigneeStep />
              </div>
              {wizardCurrentStep === 3 && <ShipmentStep />}
              {wizardCurrentStep === 4 && <CreateScreen />}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
}
