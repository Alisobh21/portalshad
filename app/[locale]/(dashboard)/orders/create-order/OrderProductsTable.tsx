"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axiosPrivate from "@/axios/axios";
import { getWarehouseProductsQry } from "@/helpers/queryFunctions";
import {
  addToOrder2,
  updateOrderQuantity,
  updateOrderPrice,
  removeFromOrder,
  getProducts,
} from "@/store/slices/orderSlice";
import type { OrderProduct as StoreOrderProduct } from "@/store/slices/orderSlice";
import { RootState } from "@/store/store";
import type { ProductsQueryEdge, Warehouse as UIWarehouse } from "./types";
import { useTranslations } from "next-intl";
import AddProductDialog from "./AddProductDialog";

/* ================= TYPES ================= */

type ProductNode = ProductsQueryEdge["node"] & { price: number | string };

/* ================= COMPONENT ================= */

export default function NewTableForm() {
  const dispatch = useDispatch();
  const { setValue, watch, register } = useFormContext();
  const t = useTranslations("TableOrderCreate");
  const { orderProducts, productsQuery } = useSelector(
    (state: RootState) => state.orders
  );
  const { warehousesList } = useSelector((state: RootState) => state.app);
  const warehouses = useMemo(
    () => (warehousesList as unknown as UIWarehouse[]) ?? [],
    [warehousesList]
  );

  const [open, setOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [sku, setSku] = useState("");
  const [confirmedSku, setConfirmedSku] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shipping = watch("shipping");
  const discount = watch("discount");
  const vat = watch("vat");

  /* ================= CALCULATIONS ================= */

  const subtotal = useMemo<number>(() => {
    return orderProducts.reduce((acc: number, item: StoreOrderProduct) => {
      const price = Number(
        item?.warehouse_products?.[0]?.price ?? item?.price ?? 0
      );
      const quantity = Number(item?.quantity ?? 0);
      return acc + price * quantity;
    }, 0);
  }, [orderProducts]);

  const total = useMemo<number>(
    () => subtotal + Number(shipping) - Number(discount) + Number(vat),
    [discount, shipping, subtotal, vat]
  );

  const productEdges: ProductsQueryEdge[] = useMemo(() => {
    const edgesCandidate = (
      productsQuery as unknown as { edges?: ProductsQueryEdge[] }
    )?.edges;

    if (Array.isArray(edgesCandidate)) return edgesCandidate;
    if (Array.isArray(productsQuery)) {
      return productsQuery as unknown as ProductsQueryEdge[];
    }
    return [];
  }, [productsQuery]);

  const pageInfo = useMemo(
    () =>
      (
        productsQuery as unknown as {
          pageInfo?: { hasNextPage?: boolean; endCursor?: string };
        }
      )?.pageInfo,
    [productsQuery]
  );

  /* ================= FETCH ================= */

  const fetchProducts = useCallback(async () => {
    if (!warehouseId) return;

    setLoading(true);
    try {
      const query = getWarehouseProductsQry(warehouseId, cursor, sku);
      const res = await axiosPrivate.post("/gql-ajax", { query });
      if (res.data?.success) {
        dispatch(getProducts(res.data.warehouse_products.data));
      }
    } finally {
      setLoading(false);
    }
  }, [cursor, dispatch, sku, warehouseId]);

  useEffect(() => {
    if (warehouseId) fetchProducts();
  }, [fetchProducts, warehouseId]);

  useEffect(() => {
    if (warehouses?.length && !warehouseId) {
      setWarehouseId(warehouses[0]?.identifier ?? null);
    }
  }, [warehouseId, warehouses]);

  /* ================= ACTIONS ================= */

  function handleAdd(node: ProductNode) {
    const price = Number(node.price ?? 0);

    dispatch(
      addToOrder2({
        product: {
          ...node.product,
          warehouse_products: [
            {
              price,
              warehouse_identifier: node.warehouse.identifier,
              warehouse_id: node.warehouse.id,
            },
          ],
        },
        targetArray: "orderProducts",
      })
    );
  }

  /* ================= RENDER ================= */

  return (
    <>
      <Button
        className="col-span-2 max-w-[200px] mb-2"
        variant="normal"
        onClick={() => setOpen(true)}
      >
        {t("addProduct")}
      </Button>

      {/* ================= MODAL ================= */}
      <AddProductDialog
        open={open}
        onOpenChange={setOpen}
        confirmedSku={confirmedSku}
        setConfirmedSku={setConfirmedSku}
        sku={sku}
        setSku={setSku}
        warehouseId={warehouseId}
        setWarehouseId={setWarehouseId}
        warehouses={warehouses}
        loading={loading}
        productEdges={productEdges}
        orderProducts={orderProducts}
        handleAdd={handleAdd}
        pageInfo={pageInfo}
        setCursor={setCursor}
      />

      {/* ================= ORDER TABLE ================= */}
      <div className="col-span-2 m-0 p-0 overflow-x-auto overflow-hidden rounded-md">
        <Table className="rounded-md">
          <TableHeader className="bg-neutral-100 rounded-md">
            <TableRow>
              <TableHead>{t("productName")}</TableHead>
              <TableHead>{t("sku")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{t("totalPrice")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderProducts.map((item: StoreOrderProduct, i: number) => (
              <TableRow key={i}>
                <TableCell>{item.name ?? ""}</TableCell>
                <TableCell>{item.sku ?? ""}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.warehouse_products?.[0]?.price ?? ""}
                    onChange={(e) =>
                      dispatch(
                        updateOrderPrice({
                          index: i,
                          price: Number(e.target.value),
                          targetArray: "orderProducts",
                        })
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity ?? ""}
                    onChange={(e) =>
                      dispatch(
                        updateOrderQuantity({
                          index: i,
                          quantity: Number(e.target.value),
                          targetArray: "orderProducts",
                        })
                      )
                    }
                  />
                </TableCell>
                <TableCell>{Number(item.total ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        removeFromOrder({
                          index: i,
                          targetArray: "orderProducts",
                        })
                      )
                    }
                  >
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="mt-4  flex flex-col gap-3 max-w-sm">
          <div className="flex justify-between">
            <span>{t("subtotal")}:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>{t("shippingPrice")}:</span>
            <Input
              type="number"
              className="w-24"
              {...register("shipping")}
              onChange={(e) => setValue("shipping", Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between">
            <span>{t("discount")}:</span>
            <Input
              type="number"
              className="w-24"
              {...register("discount")}
              onChange={(e) => setValue("discount", Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between">
            <span>{t("vat")}:</span>
            <Input
              type="number"
              className="w-24"
              {...register("vat")}
              onChange={(e) => setValue("vat", Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between font-bold text-primary">
            <span>{t("total")}</span>
            <span className="text-orange-500">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
