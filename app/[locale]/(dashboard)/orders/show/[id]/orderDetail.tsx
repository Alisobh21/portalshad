"use client";

import { FC } from "react";
import { useSelector } from "react-redux";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface RootState {
  orders: {
    oneOrder: Order | null;
  };
}

interface Shipment {
  shipping_labels?: { tracking_number?: string }[];
}

interface Order {
  order_number: string;
  order_date: string;
  ready_to_ship: boolean;
  required_ship_date: string;
  fulfillment_status: string;
  shipments?: Shipment[];
}

const OrderDetail: FC = () => {
  const { oneOrder } = useSelector((state: RootState) => state.orders);
  const tOrders = useTranslations("Orders");
  const tdetail = useTranslations("CreateOrder");
  const t = useTranslations("OrderColumns");

  const checkSatusVariant = (status?: string) => {
    switch (status) {
      case "canceled":
        return t("statusCanceled");
      case "fulfilled":
        return t("statusFulfilled");
      case "outstanding":
        return t("statusOutstanding");
      case "inPreparation":
        return t("inPreparation");
      case "pending":
        return t("statusPending");
      default:
        return status ?? "";
    }
  };

  return (
    <div className="w-full">
      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f] ">
            <RiBarChartBoxAiFill size={20} />
          </div>
          <h1 className="text-2xl font-semibold">{tOrders("details")}</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 px-2 lg:px-4">
        <div className="flex flex-col gap-2">
          <span className="">{tdetail("order_number")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">{oneOrder?.order_number}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="">{tdetail("orderDate")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">{oneOrder?.order_date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="">{tdetail("readyToShip")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">
              {oneOrder?.ready_to_ship ? tdetail("yes") : tdetail("no")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="">{tdetail("shippingDate")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">{oneOrder?.required_ship_date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="">{tdetail("orderStatus")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">
              {/* {oneOrder?.fulfillment_status} */}
              {checkSatusVariant(oneOrder?.fulfillment_status)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="">{tdetail("trackingNumber")}</span>
          <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
            <RiBarChartBoxAiFill />
            <span className="text-sm">
              {/* {oneOrder?.tracking_number} */}
              <Link
                href={
                  oneOrder?.shipments?.[0]?.shipping_labels?.[0]
                    ?.tracking_number
                    ? `/sawb-tracking/${oneOrder.shipments[0].shipping_labels[0].tracking_number}`
                    : "#"
                }
              >
                {oneOrder?.shipments?.[0]?.shipping_labels?.[0]
                  ?.tracking_number ?? tdetail("notruckingNmber")}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
