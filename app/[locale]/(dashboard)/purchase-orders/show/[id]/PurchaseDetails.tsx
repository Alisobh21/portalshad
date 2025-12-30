"use client";

import { FC } from "react";
import { useSelector } from "react-redux";
import { FaClipboardList } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface PurchaseOrderData {
  warehouse_id?: string | number;
  legacy_id?: string;
  fulfillment_status?: string;
  tracking_number?: string;
  po_date?: string;
}

interface PurchaseOrderResponse {
  data?: PurchaseOrderData;
}

interface Warehouse {
  id: string | number;
  identifier?: string;
  name?: string;
}

interface RootState {
  purchase: {
    onePurchaseOrder: PurchaseOrderResponse | null;
  };
  app: {
    warehouses: Warehouse[];
  };
}

const PurchaseDetails: FC = () => {
  const { onePurchaseOrder } = useSelector(
    (state: RootState) => state.purchase
  );
  const { warehouses } = useSelector((state: RootState) => state.app);
  const t = useTranslations("PurchaseOrders");

  const warehouse_name = warehouses?.find(
    (w) => w?.id === onePurchaseOrder?.data?.warehouse_id
  )?.identifier;

  return (
    <div className="w-full">
      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <FaClipboardList size={20} />
          </div>
          <h1 className="text-2xl font-semibold">
            {t("purchaseOrderDetails")}
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 px-2 lg:px-4">
        <div className="flex flex-col gap-2">
          <span className="">{t("receiptOrderNumber")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <FaClipboardList />
            <span className="text-sm">
              {onePurchaseOrder?.data?.legacy_id || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="">{t("status")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <FaClipboardList />
            <span className="text-sm">
              {onePurchaseOrder?.data?.fulfillment_status || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="">{t("trackingNumber")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <FaClipboardList />
            <span className="text-sm">
              {onePurchaseOrder?.data?.tracking_number || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="">{t("warehouse")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <FaClipboardList />
            <span className="text-sm">
              {warehouse_name || onePurchaseOrder?.data?.warehouse_id || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="">{t("date")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <FaClipboardList />
            <span className="text-sm">
              {onePurchaseOrder?.data?.po_date || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
