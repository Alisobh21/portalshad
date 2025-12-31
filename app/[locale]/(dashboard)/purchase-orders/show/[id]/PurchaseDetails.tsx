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
          <FaClipboardList size={24} />
          <h1 className="text-2xl font-semibold">
            {t("purchaseOrderDetails")}
          </h1>
        </div>
      </header>

      <div className="flex lg:flex-row  flex-col w-full gap-2 lg:px-4 px-2">
        <div className="flex items-center gap-2  p-3 bg-gray-50 border border-gray-300 rounded-md dark:bg-neutral-700/40 dark:text-white dark:border-neutral-700">
          <span className="text-gray-900 font-medium dark:text-white">
            {t("receiptOrderNumber")}
          </span>
          <FaClipboardList className="text-gray-500 dark:text-white" />
          <span className="text-sm text-gray-700 dark:text-white">
            {onePurchaseOrder?.data?.legacy_id}{" "}
          </span>
        </div>
        <div className="flex items-center gap-2  p-3 bg-gray-50 border border-gray-300 rounded-md dark:bg-neutral-700/40 dark:text-white dark:border-neutral-700">
          <span className="text-gray-900 font-medium dark:text-white">
            {t("status")}{" "}
          </span>
          <FaClipboardList className="text-gray-500 dark:text-white" />
          <span className="text-sm text-gray-700 dark:text-white">
            {" "}
            {onePurchaseOrder?.data?.fulfillment_status}{" "}
          </span>
        </div>

        <div className="flex items-center gap-2  p-3 bg-gray-50 border border-gray-300 rounded-md dark:bg-neutral-700/40 dark:text-white dark:border-neutral-700">
          <span className="text-gray-900 font-medium dark:text-white">
            {t("trackingNumber")}
          </span>
          <FaClipboardList className="text-gray-500 dark:text-white" />
          <span className="text-sm text-gray-700 dark:text-white">
            {" "}
            {onePurchaseOrder?.data?.tracking_number}{" "}
          </span>
        </div>
        <div className="flex items-center gap-2  p-3  bg-gray-50 border border-gray-300 rounded-md dark:bg-neutral-700/40 dark:text-white dark:border-neutral-700">
          <span className="text-gray-900 font-medium dark:text-white">
            {" "}
            {t("warehouse")}
          </span>
          <FaClipboardList className="text-gray-500 dark:text-white" />
          <span className="text-sm text-gray-700 dark:text-white">
            {warehouse_name || onePurchaseOrder?.data?.warehouse_id}
          </span>
        </div>
        <div className="flex items-center gap-2  p-3  bg-gray-50 border border-gray-300 rounded-md dark:bg-neutral-700/40 dark:text-white dark:border-neutral-700">
          <span className="text-gray-900 font-medium dark:text-white">
            {" "}
            {t("date")}
          </span>
          <FaClipboardList className="text-gray-500 dark:text-white" />
          <span className="text-sm text-gray-700 dark:text-white">
            {" "}
            {onePurchaseOrder?.data?.po_date}{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
