"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import axiosPrivate from "@/axios/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { updateOneOrder } from "@/store/slices/orderSlice";

interface CtaButtonsProps {
  id: string;
  fetchOrder: () => Promise<void>;
  status: boolean;
  holdStates: Record<string, boolean>;
  setHoldStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

interface RootState {
  orders: {
    oneOrder: {
      line_items?: {
        edges?: Array<{ node?: { id?: string } }>;
      };
      holds?: Record<string, boolean>;
      hold_reason?: string;
      tags?: string[];
      [key: string]: unknown;
    };
  };
  auth: {
    user: {
      maskLogin?: boolean;
      [key: string]: unknown;
    };
  };
}

export default function CtaButtons({
  id,
  fetchOrder,
  status,
  holdStates,
  setHoldStates,
}: CtaButtonsProps) {
  const dispatch = useDispatch();
  const t = useTranslations("ShowOrder");

  const { oneOrder } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [loadingReprocess, setLoadingReprocess] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [showHoldControls, setShowHoldControls] = useState(false);
  const [open, setOpen] = useState(false);

  const showClientHold = user?.maskLogin;

  const holdTypes = [
    { key: "payment_hold", label: t("paymentStatus") },
    { key: "operator_hold", label: t("operatorHold") },
    { key: "fraud_hold", label: t("fraudHold") },
    { key: "address_hold", label: t("addressHold") },
    ...(showClientHold ? [{ key: "client_hold", label: t("clientHold") }] : []),
  ];

  const handleButtons = async (type: "cancel" | "reprocess") => {
    if (type === "reprocess") {
      setLoadingReprocess(true);
    } else {
      setLoadingCancel(true);
    }

    try {
      if (type === "cancel") {
        const line_item_id =
          oneOrder?.line_items?.edges
            ?.map((edge: { node?: { id?: string } }) => edge?.node?.id)
            .filter((id: string | undefined) => id && !id?.includes("temp")) ||
          [];

        const response = await axiosPrivate.post("/orders/cancelOrder", {
          order_id: id,
          line_item_id,
        });

        if (response?.data?.success) {
          toast.success(t("cancelSuccess"));
          await fetchOrder();
          setOpen(false);
        }
      }

      if (type === "reprocess") {
        const response = await axiosPrivate.get(`/orders/reprocess/${id}`);
        if (response?.data?.success) {
          toast.success(t("reprocessSuccess"));
          await fetchOrder();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (type === "reprocess") {
        setLoadingReprocess(false);
      } else {
        setLoadingCancel(false);
      }
    }
  };

  const handleSwitchChange = async (checked: boolean, holdKey: string) => {
    setLoadingSwitch(true);

    setHoldStates((prev) => ({
      ...prev,
      [holdKey]: checked,
    }));

    try {
      const response = await axiosPrivate.post(
        `/orders/toggle-hold-order/${id}`,
        {
          hold_type: holdKey,
          hold_status: checked,
        }
      );

      if (response?.data?.success) {
        dispatch(
          updateOneOrder({
            holds: response?.data?.data?.order?.holds,
            hold_reason: response?.data?.data?.order?.hold_reason,
          })
        );

        setHoldStates(response?.data?.data?.order?.holds);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("somethingWentWrong"));
      setHoldStates((prev) => ({
        ...prev,
        [holdKey]: !checked,
      }));
    } finally {
      setLoadingSwitch(false);
    }
  };

  useEffect(() => {
    if (oneOrder?.holds) {
      setHoldStates(oneOrder.holds);
    }
  }, [oneOrder?.holds, setHoldStates]);

  if (!status) return null;

  return (
    <>
      <Card className="md:col-span-2 lg:col-span-3 dark:bg-default-50/70">
        <CardContent className="flex flex-col gap-4">
          {oneOrder?.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="green"
              onClick={() => handleButtons("reprocess")}
              disabled={loadingReprocess || loadingCancel}
            >
              {loadingReprocess && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("reprocess")}
            </Button>

            <Button
              variant="red"
              onClick={() => setOpen(true)}
              disabled={loadingReprocess || loadingCancel}
            >
              {t("cancelOrder")}
            </Button>

            <Button
              variant="normal"
              onClick={() => setShowHoldControls((prev) => !prev)}
            >
              {showHoldControls ? t("hideHoldControl") : t("showHoldControl")}
            </Button>
          </div>

          {showHoldControls && (
            <div className="flex flex-wrap gap-2 mt-4">
              {holdTypes.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 border rounded-md px-3 py-2"
                >
                  <Switch
                    checked={!!holdStates?.[key]}
                    disabled={loadingSwitch}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(checked, key)
                    }
                  />
                  <span className="text-sm font-normal">
                    {label}: {holdStates?.[key] ? t("on") : t("off")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl ">
          <DialogHeader>
            <DialogTitle className="text-center">{t("noteDelete")}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              variant="red"
              disabled={loadingCancel}
              onClick={() => handleButtons("cancel")}
            >
              {loadingCancel && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("cancel")}
            </Button>
            <Button
              variant="normal"
              onClick={() => setOpen(false)}
              disabled={loadingCancel}
            >
              {t("dismiss")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
