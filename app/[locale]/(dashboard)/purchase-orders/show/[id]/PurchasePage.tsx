"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnePurchaseOrder } from "@/store/slices/purchaseSlice";
import type { PurchaseOrder } from "@/store/slices/purchaseSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import PurchaseDetails from "./PurchaseDetails";
import axiosPrivate from "@/axios/axios";
import TableDetails from "./TableDetails";
import PackagingPurchase from "./PackagingPurchase";
import { useTranslations } from "next-intl";

/* ================= Types ================= */

interface PurchasePageProps {
  params: {
    id: string;
  };
}

interface PurchaseOrderResponse {
  purchase_order?: PurchaseOrder & {
    data?: Record<string, unknown>;
    [key: string]: unknown;
  };
  success?: boolean;
}

interface RootState {
  purchase: {
    onePurchaseOrder: PurchaseOrder | null;
  };
}

/* ================= Component ================= */

export default function PurchasePage({ params }: PurchasePageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations("General");
  const dispatch = useDispatch();

  const { onePurchaseOrder } = useSelector(
    (state: RootState) => state.purchase
  );

  const fetchPurchaseOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get<PurchaseOrderResponse>(
        `/purchase-orders/show/${params?.id}`
      );
      if (response?.data?.success && response?.data?.purchase_order) {
        dispatch(
          setOnePurchaseOrder(
            response.data.purchase_order as PurchaseOrder | null
          )
        );
      }
    } catch (e) {
      console.error("Error fetching purchase order:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchPurchaseOrder();
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

  return (
    <div>
      <Card>
        <PurchaseDetails />
      </Card>

      <Card className="mt-5">
        <TableDetails />
      </Card>

      <Card className="mt-5 lg:max-w-[50%] justify-center">
        <PackagingPurchase fetchPurchaseOrder={fetchPurchaseOrder} />
      </Card>
    </div>
  );
}
