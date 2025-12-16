"use client";

import { useCallback, useEffect, useState, type ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { nanoid } from "@reduxjs/toolkit";
import { BsClipboardCheckFill } from "react-icons/bs";

import type { RootState } from "@/store/store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import axiosPrivate from "@/axios/axios";
import { setHomeOrders } from "@/store/slices/homeSlice";

type HomeOrder = {
  node: {
    id: string | number;
    order_number: string;
    order_date: string;
  };
};

export default function TableWeek(): ReactElement {
  const t = useTranslations("Homepage");
  const t2 = useTranslations("TableProduct");

  const homeOrders = useSelector(
    (state: RootState) => state.home.homeOrders
  ) as HomeOrder[];
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchHomeOrders = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/home");
      if (response?.data?.success) {
        dispatch(setHomeOrders(response.data.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchHomeOrders();
  }, [fetchHomeOrders]);

  return (
    <Card className="p-5 lg:p-6 dark:bg-neutral-900/80 ">
      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#fdf1ea] text-[#a3480f] flex items-center justify-center">
          <BsClipboardCheckFill size={18} className="mt-0.5 " />
        </div>

        <div>
          <h2 className="text-xl font-bold">{t("WeeksOrders")}</h2>
          <p className="text-muted-foreground text-sm">
            {homeOrders?.length ?? 0} Orders
          </p>
        </div>
      </div>

      {/* Table */}
      <Card className="p-5 lg:p-6 dark:bg-neutral-900/80 ">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="w-full bg-neutral-100 dark:bg-neutral-800">
              <TableRow>
                <TableHead>{t("orderNumber")}</TableHead>
                <TableHead>{t("orderDate")}</TableHead>
                <TableHead>{t("action")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t2("loading")}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                homeOrders?.map((order: HomeOrder) => (
                  <TableRow key={order.node.id ?? nanoid()}>
                    <TableCell>{order.node.order_number}</TableCell>
                    <TableCell>{order.node.order_date}</TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/orders/show/${order.node.id}`}>
                          {t("viewOrder")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </Card>
  );
}
