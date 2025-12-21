"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Link } from "@/i18n/navigation";

import {
  _getOrderToBeReturned,
  _toggleReturnWizardOpening,
  _getReturnAdditionalInfo,
} from "@/store/slices/awbsSlice";

import {
  _getReturnConsigneeAddresses,
  _getUserReturnAddresses,
  _toggleGeoloactionLoaders,
} from "@/store/slices/geolocationSlice";

import { getUserAddresses } from "@/helpers/asyncUtils";

interface ReturnAwbsBtnProps {
  id?: string;
  fetchOrder?: () => void;
  status?: boolean;
}

export default function ReturnAwbsBtn({
  id,
  fetchOrder,
  status,
}: ReturnAwbsBtnProps) {
  const dispatch = useDispatch();
  const tReturn = useTranslations("shippingAWBs");

  const { oneOrder } = useSelector((state: any) => state.orders);

  const fetchReturnData = () => {
    if (!oneOrder?.id) return;

    // Shipper addresses
    getUserAddresses(
      "shipper",
      "regular",
      (data: any) => {
        dispatch(_getUserReturnAddresses(data?.addresses));
        dispatch(
          _toggleGeoloactionLoaders({
            key: "getAddresses",
            value: false,
          })
        );

        if (data?.info) {
          dispatch(_getReturnAdditionalInfo(data.info));
        }
      },
      true,
      oneOrder.id
    );

    // Consignee addresses
    getUserAddresses(
      "consignee",
      "regular",
      (data: any) => {
        dispatch(_getReturnConsigneeAddresses(data?.addresses));
        dispatch(
          _toggleGeoloactionLoaders({
            key: "getAddresses",
            value: false,
          })
        );
      },
      true,
      oneOrder.id
    );
  };

  return (
    <Card className="md:col-span-2 lg:col-span-3 dark:bg-default-50/70">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Button
              asChild
              className="w-full"
              variant="primary"
              onClick={() => {
                dispatch(_getOrderToBeReturned(oneOrder?.order_number));
                dispatch(_toggleReturnWizardOpening(true));
                fetchReturnData();
              }}
            >
              <Link href="/return-awbs/create">
                {tReturn("returnAWBS.createShippingAwb")}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
