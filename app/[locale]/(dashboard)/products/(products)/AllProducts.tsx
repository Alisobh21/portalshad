"use client";
import RegularTablesProvider from "@/app/regular-tables/RegularTablesProvider";
import ProductsTable from "./ProductTable";
import { useDispatch, useSelector } from "react-redux";
import axiosPrivate from "@/axios/axios";
import { useEffect, useState, useCallback } from "react";
import { _getProducts, _setProductsCursor } from "@/store/slices/productsSlice";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import { useTranslations } from "next-intl";
import { store, type RootState } from "@/store/store";

interface QueryParams {
  cursor?: string | null;
  sku?: string | null;
  from?: string | null;
  to?: string | null;
  per_page?: string;
}

export default function AllProducts() {
  const { products, productsCursor } = useSelector(
    (state: RootState) => state.products
  );
  const { warehouses } = useSelector((state: RootState) => state.app);
  const t = useTranslations("AllProducts");
  const dispatch = useDispatch();
  const [loadingTbdata, setLoadingTbdata] = useState(false);
  const [queryParams, setQueryParams] = useState<QueryParams>({});
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cursor = searchParams.get("cursor");
    const sku = searchParams.get("sku");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const per_page = searchParams.get("per_page");
    setQueryParams({ cursor, sku, from, to, per_page });
  }, []);

  const manageProductsCursor = useCallback(
    (cursor: string | null) => {
      dispatch(_setProductsCursor(cursor));
    },
    [dispatch]
  );

  useEffect(() => {
    if (queryParams.cursor) {
      manageProductsCursor(queryParams.cursor);
    }
  }, [queryParams, manageProductsCursor]);

  const fetchProducts = useCallback(
    async (signal: AbortSignal) => {
      setLoadingTbdata(true);

      const params = new URLSearchParams();

      if (productsCursor) params.append("cursor", String(productsCursor));
      if (queryParams?.sku) params.append("sku", queryParams.sku);
      if (queryParams?.from) params.append("from", queryParams.from);
      if (queryParams?.to) params.append("to", queryParams.to);
      if (queryParams?.per_page)
        params.append("per_page", queryParams.per_page);

      const endpoint = "/products";
      const url = `${endpoint}?${params.toString()}`;
      try {
        const response = await axiosPrivate(url, { signal });
        if (response?.data?.success) {
          dispatch(_getProducts(response?.data?.products?.data));
          setLoadingTbdata(false);
        }
      } catch (err) {
        console.log(err);
        setLoadingTbdata(false);
      }
    },
    [productsCursor, queryParams, dispatch]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
  }, [fetchProducts]);

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="w-[40px] h-[40px] rounded-lg bg-[#fbe4d6] text-[#a3480f] flex items-center justify-center">
          <RiBarChartBoxAiFill size={18} />
        </div>
        <div className="me-2">
          <h2 className="text-2xl font-bold mb-0">{t("title")}</h2>
          <p className="text-neutral-700/80 dark:text-neutral-300/80 text-sm mb-2">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <RegularTablesProvider>
        <ProductsTable
          manageCursor={manageProductsCursor}
          products={products as any}
          tbLoading={loadingTbdata}
        />
      </RegularTablesProvider>
    </>
  );
}
