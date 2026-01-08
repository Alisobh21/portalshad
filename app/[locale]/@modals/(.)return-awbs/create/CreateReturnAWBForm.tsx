"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { GoCheckCircleFill } from "react-icons/go";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { PiUserCircleDashedFill } from "react-icons/pi";
import ShipperStep from "./(steps)/ShipperStep";
import ConsigneeStep from "./(steps)/ConsigneeStep";
import ShipmentStep from "./(steps)/ShipmentStep";
import CreateScreen from "./(steps)/CreateScreen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  _getConsigneeAddresses,
  _getUserAddresses,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";
import {
  _getOrderToBeReturned,
  _getReturnAdditionalInfo,
  _resetWizardSteps,
  _toggleReturnWizardOpening,
} from "@/store/slices/awbsSlice";
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

export default function CreateReturnAWBForm() {
  const { wizardCurrentStep, returnWizardOpened } = useSelector(
    (state: RootState) => state.awbs
  );
  const [open, setOpen] = useState(true);
  const methods = useForm<FormData>({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const t = useTranslations("shippingAWBs");
  const router = useRouter();

  function createAWBHandler(data: FormData) {
    console.log("Form submitted with data:", data);
  }

  const wizardSteps: WizardStep[] = [
    {
      stepNo: 1,
      key: "shipper",
      label: t("shipperInfo"),
      icon: <PiUserCircleDashedFill size={18} />,
    },
    {
      stepNo: 2,
      key: "consignee",
      label: t("consigneeInfo"),
      icon: <PiUserCircleDashedFill size={18} />,
    },
    {
      stepNo: 3,
      key: "shipment",
      label: t("ShipmentInformation"),
      icon: <BsFillBoxSeamFill size={18} />,
    },
  ];

  // Sync Redux state with local state
  useEffect(() => {
    if (returnWizardOpened) {
      setOpen(true);
    }
  }, [returnWizardOpened]);

  useEffect(() => {
    return () => {
      dispatch(_getReturnAdditionalInfo(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setOpen(false);
    router.back();
    dispatch(_resetWizardSteps());
    dispatch(_getUserAddresses([]));
    dispatch(_getConsigneeAddresses([]));
    dispatch(_toggleReturnWizardOpening(false));
    dispatch(_toggleGeoloactionLoaders({ key: "getAddresses", value: true }));
    dispatch(_getOrderToBeReturned(null));
    methods.reset();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="z-[9999] lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4"
          showCloseButton={true}
        >
          <DialogHeader className="flex text-[24px] flex-col items-center gap-1">
            <DialogTitle>{t("returnAWBS.createShippingAwb")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border dark:border-neutral-700 p-1 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
                {wizardSteps?.map((step) => (
                  <div
                    key={step?.key}
                    className={cn(
                      "bg-neutral-200/20 dark:bg-neutral-700/20 pointer-events-none p-3 rounded-md transition-colors",
                      step?.stepNo > wizardCurrentStep
                        ? "opacity-50"
                        : step?.stepNo < wizardCurrentStep
                        ? "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400"
                        : "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {step?.icon}
                      <span className="text-[14px]">{step?.label}</span>
                      <GoCheckCircleFill
                        size={18}
                        className={cn(
                          step?.stepNo < wizardCurrentStep
                            ? "text-orange-800 dark:text-orange-400 opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <FormProvider {...methods}>
              <form
                noValidate
                onSubmit={methods.handleSubmit(createAWBHandler)}
              >
                {wizardCurrentStep === 1 && <ShipperStep />}
                {wizardCurrentStep === 2 && <ConsigneeStep />}
                {wizardCurrentStep === 3 && <ShipmentStep />}
                {wizardCurrentStep === 4 && <CreateScreen />}
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
