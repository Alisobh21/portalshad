"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { TbClockFilled, TbInfoHexagonFilled } from "react-icons/tb";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import axiosPrivate, { axiosInternal } from "@/axios/axios";
import { _getAuthUser } from "@/store/slices/authSlice";
import type { RootState, AppDispatch } from "@/store/store";

/* ================= Types ================= */

interface UserRole {
  name?: string;
  [key: string]: unknown;
}

interface User {
  roles?: UserRole[];
  last_shipments_update_time?: string | null;
  last_shipments_update_status?: boolean | null;
  mask_import_completed?: boolean;
  import_completed?: boolean;
  [key: string]: unknown;
}

interface AccountResponse {
  success?: boolean;
  data?: User;
}

/* ================= Component ================= */

export default function PullShipments() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pullShipmentLoading, setPullShipmentLoading] =
    useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("Shipments");

  const isAdmin = useMemo(() => {
    if (!user || !Array.isArray(user.roles)) return false;
    return user.roles.some((role: UserRole) => role?.name === "admin");
  }, [user]);

  useEffect(() => {
    updateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateUser() {
    try {
      const response = await axiosPrivate.get<AccountResponse>("/account");
      if (response?.data?.success && response?.data?.data) {
        dispatch(_getAuthUser(response.data.data));
        await axiosInternal.post("/api/set-auth", {
          user: response.data.data,
        });
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }

  async function pullShipments() {
    setPullShipmentLoading(true);
    try {
      const response = await axiosPrivate.post("/shipments/pull");
      if (response?.data?.success) {
        updateUser();
      }
    } catch (err) {
      console.error("Error pulling shipments:", err);
    } finally {
      setPullShipmentLoading(false);
    }
  }

  const userTyped = user as User | null;
  const isUpdating =
    (isAdmin
      ? userTyped?.mask_import_completed === false
      : userTyped?.import_completed === false) || pullShipmentLoading;

  return (
    <Card className="p-5 dark:bg-default-50/70">
      <CardContent className="p-0">
        <div className="w-full lg:w-auto mx-auto flex flex-col justify-center lg:max-w-sm">
          {userTyped?.last_shipments_update_time !== null &&
            userTyped?.last_shipments_update_time !== undefined && (
              <div className="flex gap-2 lg:gap-4 flex-col lg:flex-row items-center justify-between px-2 py-3 lg:py-1 rounded-lg bg-neutral-300/20 dark:bg-neutral-800 mb-1">
                <span className="font-semibold text-[15px] flex items-center gap-2">
                  <TbClockFilled className="ms-2" size={18} />
                  {t("lastSuccessfulUpdate")}
                </span>
                <span className="text-[15px]">
                  {userTyped?.last_shipments_update_time || "-"}
                </span>
              </div>
            )}

          {userTyped?.last_shipments_update_status !== null &&
            userTyped?.last_shipments_update_status !== undefined && (
              <div className="flex items-center flex-col lg:flex-row justify-between gap-2 lg:gap-4 px-2 py-3 lg:py-1 rounded-lg bg-neutral-300/20 dark:bg-neutral-800 mb-2">
                <span className="font-semibold text-[15px] flex items-center gap-2">
                  <TbInfoHexagonFilled className="ms-2" size={18} />
                  {t("lastUpdateStatus")}
                </span>
                {userTyped?.last_shipments_update_status ? (
                  <Badge variant="greeShip">{t("updateSuccessful")}</Badge>
                ) : (
                  <Badge variant="redShip">{t("updateFailed")}</Badge>
                )}
              </div>
            )}

          {isUpdating ? (
            <Button disabled={true} variant="secondary" className="px-5">
              {t("updatingShipments")}
            </Button>
          ) : (
            <Button
              onClick={pullShipments}
              variant="primary"
              disabled={pullShipmentLoading}
              className="px-5 btn-primary"
            >
              {pullShipmentLoading
                ? t("updatingShipments")
                : t("updateShipments")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
