"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _addOrder } from "@/store/slices/orderSlice";
import axiosPrivate from "@/axios/axios";
// import Packaging from './Packaging';
// import OrderHistory from './OrderHistory';
import { PiShieldWarningFill } from "react-icons/pi";

import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import ReturnAwbsBtn from "./ReturnAwbsBtn";
import CtaButtons from "./CtaButtons";
import TableProducts from "./TableProducts";
import OrderDetail from "./orderDetail";
import Shipping from "./Shipping";
import Addressing from "./Addressing";

interface OrderPageProps {
  params: {
    id: string;
  };
}

// Commented out until CtaButtons component is uncommented
interface HoldStates {
  [key: string]: boolean;
}

interface OneOrder {
  fulfillment_status?: string;
  holds?: Record<string, boolean | string>;
  hold_reason?: string;
  [key: string]: unknown;
}

interface RootState {
  orders: {
    oneOrder: OneOrder;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  const t = useTranslations("General");
  const dispatch = useDispatch();
  const { oneOrder } = useSelector((state: RootState) => state.orders);

  const [loading, setLoading] = useState<boolean>(true);
  // Commented out until CtaButtons component is uncommented
  const [holdStates, setHoldStates] = useState<HoldStates>({});

  // Fetch order from API
  const fetchOrder = async () => {
    setLoading(true);
    try {
      console.log("Fetching order with ID:", params?.id);
      const response = await axiosPrivate(`/orders/show/${params?.id}`);

      if (response?.data?.success && response?.data?.data?.order) {
        dispatch(_addOrder(response.data.data.order));
      } else if (response?.data?.data?.order) {
        dispatch(_addOrder(response.data.data.order));
      } else {
        console.warn("Order data not found in API response");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Determine status flags (commented out until components are uncommented)
  const status = oneOrder?.fulfillment_status === "pending";
  const delivered = oneOrder?.fulfillment_status === "fulfilled";

  // Show banner if holds exist
  const showBanner = useMemo(() => {
    if (oneOrder?.holds) {
      const holdsArray = Object.values(oneOrder.holds)
        .map(String)
        .filter((v) => v === "true");
      return holdsArray.length > 0;
    }
    return false;
  }, [oneOrder?.holds]);

  useEffect(() => {
    if (params?.id) {
      fetchOrder();
    } else {
      console.warn("No order ID provided");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  if (loading) {
    return (
      <Card className="min-h-[70vh] flex items-center justify-center dark:bg-default-50/70">
        <CardContent className="flex flex-col items-center justify-center">
          <Spinner className="text-warning" />
          <p className="mt-2">{t("loadingDetails")}</p>
        </CardContent>
      </Card>
    );
  }

  if (!oneOrder || Object.keys(oneOrder).length === 0) {
    return (
      <Card className="min-h-[70vh] flex items-center justify-center dark:bg-default-50/70">
        <CardContent className="text-center">
          <p>{t("orderNotFound")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {showBanner && (
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <Alert variant="default" className="flex gap-2">
            <PiShieldWarningFill />

            <AlertDescription className="text-amber-900 dark:text-amber-200">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{t("alert")}</p>

                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-semibold">{t("holdReason")}:</span>
                  <span className="underline">{oneOrder?.hold_reason}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {delivered && (
        <ReturnAwbsBtn
          id={params?.id}
          fetchOrder={fetchOrder}
          status={status}
        />
      )}
      <CtaButtons
        setHoldStates={setHoldStates}
        holdStates={holdStates}
        fetchOrder={fetchOrder}
        id={params?.id}
        status={status}
      />

      <Card className="md:col-span-2 xl:col-span-3 dark:bg-default-50/70">
        <TableProducts
          fetchOrder={fetchOrder}
          id={params?.id}
          status={status}
        />
      </Card>

      <Card className="dark:bg-default-50/70">
        <OrderDetail />
      </Card>

      <Card className="dark:bg-default-50/70">
        <Shipping fetchOrder={fetchOrder} id={params?.id} status={status} />
      </Card>

      <Card className="dark:bg-default-50/70">
        <Addressing fetchOrder={fetchOrder} id={params?.id} status={status} />
      </Card>

      <Card className="md:col-span-2 xl:col-span-3 dark:bg-default-50/70">
        {/* <OrderHistory /> */}
      </Card>

      <Card className="md:col-span-2 xl:col-span-3 dark:bg-default-50/70">
        {/* <Packaging fetchOrder={fetchOrder} id={params?.id} status={status} /> */}
      </Card>
    </div>
  );
}
