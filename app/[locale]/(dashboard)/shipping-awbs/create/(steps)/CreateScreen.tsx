"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import {
  _getOrderToBeReturned,
  _resetWizardSteps,
  _setCurrentStep,
  _toggleReturnWizardOpening,
} from "@/store/slices/awbsSlice";
import {
  _getUserAddresses,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Popup from "@/components/Popup";
import type { RootState } from "@/store/store";
import axiosPrivate from "@/axios/axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

/* ================= Types ================= */

interface CreateResponse {
  success: boolean;
  errors?: string | Record<string, unknown>;
  data?: unknown;
}

/* ================= Component ================= */

export default function CreateScreen() {
  const {
    shipperStepValues,
    consigneeStepValues,
    shippmentStepValues,
    wizardCurrentStep,
  } = useSelector((state: RootState) => state.awbs);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("shippingAWBs");
  const router = useRouter();
  const { reset } = useFormContext();

  async function createShippingAirwaybill() {
    setCreateLoading(true);
    try {
      const response = await axiosPrivate.post<CreateResponse>(
        `/awb-processing/shipping/store`,
        {
          shipper_name: shipperStepValues?.shipper_name,
          shipper_phone: shipperStepValues?.shipper_phone,
          shipper_address_id: shipperStepValues?.shipper_address_id,
          sender_address: shipperStepValues?.shipper_address_id,
          shipper_company_name: shipperStepValues?.shipper_company,
          consignee_name: consigneeStepValues?.consignee_name,
          consignee_phone: consigneeStepValues?.consignee_phone,
          consignee_email: consigneeStepValues?.consignee_email,
          consignee_address_id: consigneeStepValues?.consignee_address_id,
          receiving_addr: consigneeStepValues?.consignee_address_id,
          consignee_company_name: consigneeStepValues?.consignee_company,
          pickup: shippmentStepValues?.pickup,
          payment_type: shippmentStepValues?.payment_type,
          ...(shippmentStepValues?.payment_type === "cod" && {
            price: shippmentStepValues?.price,
          }),
          store_name: shippmentStepValues?.store_name,
          order_number: shippmentStepValues?.order_number,
          description: shippmentStepValues?.description,
          weight: shippmentStepValues?.weight,
          number_of_pieces: shippmentStepValues?.number_of_pieces,
          carrier_service_slug: shippmentStepValues?.shipping_company,
        }
      );

      if (response?.data?.success) {
        toast.success(t("createAWBSuccess"));
        setCreateSuccess(true);
        reset();
        dispatch(_resetWizardSteps());
        dispatch(_getUserAddresses([]));
        dispatch(_toggleReturnWizardOpening(false));
        dispatch(
          _toggleGeoloactionLoaders({ key: "getAddresses", value: true })
        );
        dispatch(_getOrderToBeReturned(null));
        setTimeout(() => {
          router.push("/shipping-awbs/report");
        }, 3000);
      }

      if (!response?.data?.success) {
        setCreateError(
          typeof response?.data?.errors === "string"
            ? response.data.errors
            : "Failed to create shipping Awb"
        );
        setCreateSuccess(false);
      } else {
        setCreateError(null);
      }
    } catch (err) {
      console.error("Error creating shipping AWB:", err);
      setCreateError("Failed to create shipping Awb");
    } finally {
      setCreateLoading(false);
    }
  }

  useEffect(() => {
    createShippingAirwaybill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={cn(
          "h-full w-full flex items-center justify-center",
          wizardCurrentStep === 4 ? "" : "hidden"
        )}
      >
        <div className="flex flex-col w-full gap-2 items-center justify-center text-center">
          {!createSuccess && (
            <h2 className="text-xl font-bold">{t("createAWB")}</h2>
          )}

          <div className="py-5 flex flex-col gap-2 justify-center items-center">
            {createLoading && (
              <div className="flex flex-col items-center gap-2">
                <Spinner className="size-8" />
                <div className="flex flex-col items-center gap-1">
                  <h3 className="text-lg font-bold">{t("processing")}</h3>
                  <p className="text-muted-foreground text-[14px]">
                    {t("pleaseWait")}
                  </p>
                </div>
              </div>
            )}

            {createError && (
              <Alert variant="destructive" className="w-full max-w-md">
                <AlertTitle>{createError}</AlertTitle>
              </Alert>
            )}

            {createSuccess && (
              <div className="flex flex-col items-center gap-2">
                <Player
                  autoplay
                  loop={false}
                  src="/OrderPlaced.json"
                  style={{
                    width: "5rem",
                    height: "5rem",
                    margin: "1rem auto",
                  }}
                />
                <p className="font-bold text-3xl">{t("createAWBSuccess")}</p>
                <span className="text-muted-foreground">
                  You&apos;ll be redirect to report page....
                </span>
              </div>
            )}
          </div>

          <div className="w-full pt-5 grid grid-cols-1 gap-2">
            <Button
              className="w-full"
              variant="outline"
              disabled={createLoading}
              onClick={() => dispatch(_setCurrentStep(3))}
            >
              {t("prev")}
            </Button>
          </div>
        </div>
      </div>

      <Popup
        status={createSuccess}
        containerClass="max-w-xl"
        closeModal={() => {
          setCreateSuccess(false);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Player
            autoplay
            loop={false}
            src="/OrderPlaced.json"
            style={{
              width: "5rem",
              height: "5rem",
              margin: "1rem auto",
            }}
          />
          <p className="font-bold text-3xl">{t("createAWBSuccess")}</p>
          <span className="text-muted-foreground">
            You&apos;ll be redirect to report page....
          </span>
        </div>
      </Popup>
    </>
  );
}
