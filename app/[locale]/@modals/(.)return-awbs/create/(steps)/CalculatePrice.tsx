"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _setCurrentStep } from "@/store/slices/awbsSlice";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { RootState } from "@/store/store";
import axiosPrivate from "@/axios/axios";
import { cn } from "@/lib/utils";

/* ================= Types ================= */

interface CalculatePriceResponse {
  success: boolean;
  errors?: string | Record<string, unknown>;
  data?: unknown;
}

/* ================= Component ================= */

export default function CalculatePrice() {
  const { wizardCurrentStep, shippmentStepValues } = useSelector(
    (state: RootState) => state.awbs
  );
  const [calculatePriceLoading, setCalculatePriceLoading] = useState(false);
  const [awbCalulationError, setAwbCalulationError] = useState<string | null>(
    null
  );
  const dispatch = useDispatch();

  async function calculateShippingAwbPrice() {
    setCalculatePriceLoading(true);
    try {
      const response = await axiosPrivate.post<CalculatePriceResponse>(
        "/shipping-awbs/calc-awb-price",
        {
          carrier: shippmentStepValues?.shipping_company,
          payment_type: shippmentStepValues?.payment_type,
          weight: shippmentStepValues?.weight,
        }
      );

      if (!response?.data?.success) {
        setAwbCalulationError(
          typeof response?.data?.errors === "string"
            ? response.data.errors
            : "Failed to calculate AWB price"
        );
      } else {
        setAwbCalulationError(null);
      }
    } catch (err) {
      console.error("Error calculating AWB price:", err);
      setAwbCalulationError("Failed to calculate AWB price");
    } finally {
      setCalculatePriceLoading(false);
    }
  }

  useEffect(() => {
    calculateShippingAwbPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full flex items-center justify-center",
        wizardCurrentStep === 4 ? "" : "hidden"
      )}
    >
      <div className="flex flex-col w-full gap-2 items-center justify-center text-center">
        <h2 className="text-xl font-bold">Calculate Shipping AWB Price</h2>
        <p className="text-muted-foreground">
          Quickly estimate the shipping price for your AWB based on location,
          weight, and service level.
        </p>

        <div className="py-5 flex flex-col gap-2 justify-center items-center">
          {calculatePriceLoading && (
            <div className="flex flex-col items-center gap-2">
              <Spinner className="size-8" />
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-bold">Calculating</h3>
                <p className="text-muted-foreground text-[14px]">
                  Please Wait...
                </p>
              </div>
            </div>
          )}

          {awbCalulationError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertTitle>{awbCalulationError}</AlertTitle>
            </Alert>
          )}
        </div>

        <div className="w-full pt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <Button
            className="w-full"
            variant="outline"
            disabled={calculatePriceLoading}
            onClick={() => dispatch(_setCurrentStep(3))}
          >
            Previous
          </Button>
          <Button
            className="w-full"
            variant="primary"
            disabled={calculatePriceLoading}
            onClick={() => {}}
          >
            Create Shipping AWB
          </Button>
        </div>
      </div>
    </div>
  );
}
