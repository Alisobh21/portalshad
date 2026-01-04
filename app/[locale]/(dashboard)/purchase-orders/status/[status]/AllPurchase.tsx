"use client";

import RegularTablesProvider from "@/app/regular-tables/RegularTablesProvider";
import PurchaseOrdersTable from "./PurchaseOrdersTable";
import { useDispatch, useSelector } from "react-redux";
import axiosPrivate from "@/axios/axios";
import { useEffect, useState, useCallback } from "react";
import {
  getPurchaseOrders,
  _setPurchaseCursor,
} from "@/store/slices/purchaseSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useRouter } from "@/i18n/navigation";
import { MdCancel, MdCreateNewFolder, MdPendingActions } from "react-icons/md";
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
import type { PurchaseOrder } from "@/store/slices/purchaseSlice";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import { IoLockClosedSharp } from "react-icons/io5";

interface PurchaseOrderEdge {
  node: PurchaseOrder & {
    [key: string]: unknown;
  };
}

interface PurchaseOrdersData {
  edges?: PurchaseOrderEdge[];
  pageInfo?: TablePagination;
}

interface PurchaseOrdersResponse {
  data?: PurchaseOrdersData;
}

interface AllPurchaseProps {
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

export default function AllPurchase({ status }: AllPurchaseProps) {
  const { purchaseOrders, purchaseCursor } = useSelector(
    (state: RootState) => state.purchase
  );
  const { warehouses } = useSelector((state: RootState) => state.app);

  const router = useRouter();

  const [loadingTbdata, setLoadingTbdata] = useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("PurchaseOrders");

  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const locale = useLocale();

  function CardHeader({ heading, subHeading, icon }: CardHeaderProps) {
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
            <Link href="/purchase-orders/create-purchase-order">
              <MdCreateNewFolder size={17} />
              <span className="d-inline-block text-sm">{t("titlecreate")}</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cursor = searchParams.get("cursor");
    const sku = searchParams.get("sku");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const per_page = searchParams.get("per_page");
    setQueryParams({ cursor, sku, from, to, per_page });
  }, []);

  const managePurchaseCursor = useCallback(
    (cursor: string | null) => {
      dispatch(_setPurchaseCursor(cursor));
    },
    [dispatch]
  );

  const fetchPurchaseOrders = useCallback(
    async (signal: AbortSignal) => {
      setLoadingTbdata(true);

      const params = new URLSearchParams();

      if (purchaseCursor) params.append("cursor", String(purchaseCursor));
      if (queryParams?.sku) params.append("sku", queryParams.sku);
      if (queryParams?.from) params.append("from", queryParams.from);
      if (queryParams?.to) params.append("to", queryParams.to);
      if (queryParams?.per_page)
        params.append("per_page", queryParams.per_page);

      const endpoint = `/purchase-orders${
        status === "all-po" ? "" : `/filtered/${status}`
      }`;
      const url = `${endpoint}?${params.toString()}`;
      try {
        const response = await axiosPrivate(url, { signal });
        if (response?.data?.success) {
          dispatch(getPurchaseOrders(response?.data?.purchase_orders?.data));

          setLoadingTbdata(false);
        }
      } catch (err) {
        console.log(err);
        setLoadingTbdata(false);
      }
    },
    [purchaseCursor, queryParams, dispatch]
  );
  useEffect(() => {
    if (queryParams.cursor) {
      managePurchaseCursor(queryParams.cursor);
    }
  }, [queryParams, managePurchaseCursor]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPurchaseOrders(controller.signal);
    return () => controller.abort();
  }, [fetchPurchaseOrders]);

  function checkPageHeader() {
    if (status === "pending") {
      return (
        <CardHeader
          heading={t("pendingHeading")}
          subHeading={t("pendingSub")}
          icon={<MdPendingActions size={18} className="mt-1" />}
        />
      );
    } else if (status === "canceled") {
      return (
        <CardHeader
          heading={t("canceledHeading")}
          subHeading={t("canceledSub")}
          icon={<MdCancel size={18} className="mt-1" />}
        />
      );
    } else if (status === "closed") {
      return (
        <CardHeader
          heading={t("closedHeading")}
          subHeading={t("closedSub")}
          icon={<IoLockClosedSharp size={18} className="mt-1" />}
        />
      );
    } else if (status === "all-po" || status === "filtered") {
      return (
        <CardHeader
          heading={t("title")}
          subHeading={t("subtitle")}
          icon={<RiBarChartBoxAiFill size={18} className="mt-1" />}
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
            onValueChange={(value) =>
              router.push(`/purchase-orders/status/${value}`)
            }
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <TabsList className="flex-col py-1 xl:flex-row w-full h-auto!">
              <TabsTrigger
                value="all-po"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {t("tabAll")}
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {t("tabPending")}
              </TabsTrigger>
              <TabsTrigger
                value="canceled"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {t("tabCanceled")}
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="w-full xl:max-w-fit px-4 data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {t("tabClosed")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <RegularTablesProvider>
        <PurchaseOrdersTable
          manageCursor={managePurchaseCursor}
          purchaseOrders={purchaseOrders as any}
          tbLoading={loadingTbdata}
          warehouses={warehouses as any}
        />
      </RegularTablesProvider>
    </>
  );
}
