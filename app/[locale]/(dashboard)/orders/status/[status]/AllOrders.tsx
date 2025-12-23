"use client";

import RegularTablesProvider from "@/app/regular-tables/RegularTablesProvider";
import OrdersTable from "./OrderTable";
import { useDispatch, useSelector } from "react-redux";
import axiosPrivate from "@/axios/axios";
import { useEffect, useState, useCallback } from "react";
import { _getOrders, _setOrdersCursor } from "@/store/slices/orderSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useRouter } from "@/i18n/navigation";
import { MdCreateNewFolder } from "react-icons/md";
import {
  BsClipboardCheckFill,
  BsClipboardMinusFill,
  BsClipboardXFill,
  BsFillClipboardPlusFill,
} from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { store, type RootState } from "@/store/store";
import type { TablePagination } from "@/app/regular-tables/RegularTable";
import type { OrderProduct } from "@/store/slices/orderSlice";

interface OrderEdge {
  node: OrderProduct & {
    shipping_address?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface OrdersData {
  edges?: OrderEdge[];
  pageInfo?: TablePagination;
}

interface OrdersResponse {
  data?: OrdersData;
}

interface AllOrdersProps {
  status: string;
}

interface QueryParams {
  cursor?: string | null;
  sku?: string | null;
  from?: string | null;
  to?: string | null;
  per_page?: string | null;
}

interface CardHeaderProps {
  heading: string;
  subHeading: string;
  icon: React.ReactNode;
}

function CardHeader({ heading, subHeading, icon }: CardHeaderProps) {
  const tOrders = useTranslations("Orders");

  return (
    <div className="flex items-start gap-3">
      <div className="w-[40px] h-[40px] rounded-lg bg-[#fbe4d6] text-[#a3480f] flex items-center justify-center">
        {icon}
      </div>
      <div className="me-2">
        <h2 className="text-2xl font-bold mb-0">{heading}</h2>
        <p className="text-neutral-700/80 dark:text-neutral-300/80 text-sm mb-2">
          {subHeading}
        </p>
        <Button variant="modal" asChild className="px-5">
          <Link href="/orders/create-order">
            <MdCreateNewFolder size={17} />
            <span className="d-inline-block text-sm">
              {tOrders("create_order")}
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function AllOrders({ status }: AllOrdersProps) {
  const { ordersCursor, orders } = useSelector(
    (state: RootState) => state.orders
  );
  // const { orders, ordersCursor } = store.getState().orders.orders as any;
  const [loadingTbdata, setLoadingTbdata] = useState(false);
  // const [ordersResponse, setOrdersResponse] = useState<OrdersResponse>({});
  const tOrders = useTranslations("Orders");
  const tHome = useTranslations("Homepage");
  const tTabs = useTranslations("Tabs");
  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const locale = useLocale();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cursor = searchParams.get("cursor");
    const sku = searchParams.get("sku");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const per_page = searchParams.get("per_page");
    setQueryParams({ cursor, sku, from, to, per_page });
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();

  const manageOrdersCursor = useCallback(
    (cursor: string | null) => {
      dispatch(_setOrdersCursor(cursor));
    },
    [dispatch]
  );

  const fetchOrders = useCallback(
    async (signal: AbortSignal) => {
      setLoadingTbdata(true);

      const params = new URLSearchParams();

      if (ordersCursor) params.append("cursor", String(ordersCursor));
      if (queryParams?.sku) params.append("sku", queryParams.sku);
      if (queryParams?.from) params.append("from", queryParams.from);
      if (queryParams?.to) params.append("to", queryParams.to);
      if (queryParams?.per_page)
        params.append("per_page", queryParams.per_page);

      const endpoint = `/orders${
        status === "all" ? "" : `/filtered/${status}`
      }`;
      const url = `${endpoint}?${params.toString()}`;
      try {
        const response = await axiosPrivate(url, { signal });
        if (response?.data?.success) {
          // Store the full response structure for OrderTable
          dispatch(_getOrders(response?.data?.orders));
          setLoadingTbdata(false);
        }
      } catch (err) {
        console.log(err);
        setLoadingTbdata(false);
      }
    },
    [status, ordersCursor, queryParams, dispatch]
  );

  useEffect(() => {
    if (queryParams.cursor) {
      manageOrdersCursor(queryParams.cursor);
    }
  }, [queryParams, manageOrdersCursor]);

  useEffect(() => {
    const controller = new AbortController();

    fetchOrders(controller.signal);

    return () => controller.abort();
  }, [fetchOrders]);

  function checkPageHeader() {
    if (status === "canceled") {
      return (
        <CardHeader
          heading={tHome("canceledOrdersHeading")}
          subHeading={tHome("canceledOrdersSubheading")}
          icon={<BsClipboardXFill size={18} className="mt-1" />}
        />
      );
    } else if (status === "fulfilled") {
      return (
        <CardHeader
          heading={tHome("fulfilledOrdersHeading")}
          subHeading={tHome("fulfilledOrdersSunheading")}
          icon={<BsClipboardCheckFill size={18} className="mt-1" />}
        />
      );
    } else if (status === "outstanding") {
      return (
        <CardHeader
          heading={tHome("outstandigOrdersHeading")}
          subHeading={tHome("outstandingOrdersSubheading")}
          icon={<BsClipboardMinusFill size={18} className="mt-1" />}
        />
      );
    } else if (status === "inPreparation") {
      return (
        <CardHeader
          heading={tHome("inPreparationOrdersHeading")}
          subHeading={tHome("inPreparationOrdersSubheading")}
          icon={<BsFillClipboardPlusFill size={18} className="mt-1" />}
        />
      );
    } else if (status === "all" || status === "filtered") {
      return (
        <CardHeader
          heading={tOrders("all_orders")}
          subHeading={tOrders("allOrdersSubheading")}
          icon={<BsClipboardCheckFill size={18} className="mt-1" />}
        />
      );
    }
    return null;
  }

  return (
    <>
      <div className="flex flex-col w-full gap-3 mb-[30px]">
        <div className="flex w-full flex-col xl:flex-row xl:justify-between gap-5">
          <div className="flex items-start gap-2">{checkPageHeader()}</div>
          <Tabs
            value={status || "all"}
            onValueChange={(value) => router.push(`/orders/status/${value}`)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <TabsList className="flex-col py-1 xl:flex-row w-full h-auto!">
              <TabsTrigger
                value="all"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tTabs("all")}
              </TabsTrigger>
              <TabsTrigger
                value="inPreparation"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tTabs("inPreparation")}
              </TabsTrigger>
              <TabsTrigger
                value="fulfilled"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tTabs("fulfilled")}
              </TabsTrigger>
              <TabsTrigger
                value="outstanding"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tTabs("outstanding")}
              </TabsTrigger>
              <TabsTrigger
                value="canceled"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tTabs("canceled")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <RegularTablesProvider>
        <OrdersTable
          manageCursor={manageOrdersCursor}
          orders={orders as any}
          tbLoading={loadingTbdata}
        />
      </RegularTablesProvider>
    </>
  );
}
