"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  getProducts,
  updateOneOrderQuantity2,
  updateOneOrderPrice2,
  addTempProductToOrder2,
  removeTempProductBySku2,
} from "@/store/slices/orderSlice";

import {
  getWarehouseProductsQry,
  addProductMutation1,
  orderUpdateLineItemsMutationQ1,
  updateTotalPriceMutation,
} from "@/helpers/queryFunctions";

import axiosPrivate from "@/axios/axios";

/* shadcn */
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

/* dialog */
import AddProductDialog from "@/app/[locale]/(dashboard)/orders/create-order/AddProductDialog";

/* ================= Types ================= */

interface TableSaveProps {
  id: string;
  fetchOrder: () => void;
  setEditMode: (v: boolean) => void;
}

interface RootState {
  orders: any;
  app: any;
}

/* ================= Component ================= */

export default function TableSave({
  id,
  fetchOrder,
  setEditMode,
}: TableSaveProps) {
  const t = useTranslations("TableProduct");

  const dispatch = useDispatch();
  const { oneOrder, productsQuery } = useSelector(
    (state: RootState) => state.orders
  );
  const { warehousesList, loadingWarehousesList } = useSelector(
    (state: RootState) => state.app
  );

  const [sku, setSku] = useState("");
  const [confirmedSku, setConfirmedSku] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const [editeQuantity, setEditeQuantity] = useState(false);
  const [originalLineItems, setOriginalLineItems] = useState<any[]>([]);

  /* ================= Totals ================= */

  const subtotal = useMemo(() => {
    return (
      oneOrder?.line_items?.edges?.reduce(
        (acc: number, item: any) =>
          acc + Number(item.node.price) * Number(item.node.quantity),
        0
      ) ?? 0
    );
  }, [oneOrder]);

  const total = useMemo(() => {
    const shipping = Number(oneOrder?.shipping_lines?.price) || 0;
    const discount = Number(oneOrder?.total_discounts) || 0;
    const tax = Number(oneOrder?.total_tax) || 0;
    return subtotal + shipping - discount + tax;
  }, [subtotal, oneOrder]);

  /* ================= Handlers ================= */

  const fetchProducts = async () => {
    if (!warehouseId) return;
    setFetchingProducts(true);
    try {
      const query = getWarehouseProductsQry(warehouseId, cursor, sku);
      const res = await axiosPrivate.post("/gql-ajax", { query });
      if (res.data.success) {
        dispatch(getProducts(res.data.warehouse_products.data));
      }
    } finally {
      setFetchingProducts(false);
    }
  };

  const handleStartEditing = () => {
    if (!oneOrder?.line_items?.edges) return;
    const backup = oneOrder.line_items.edges.map((edge: any) => ({
      id: edge.node.id,
      sku: edge.node.sku,
      quantity: edge.node.quantity,
      price: edge.node.price,
    }));
    setOriginalLineItems(backup);
    setEditeQuantity(true);
  };

  const handleCancelEdits = () => {
    if (!originalLineItems.length) return;

    // استرجاع القيم الأصلية
    originalLineItems.forEach((item) => {
      dispatch(
        updateOneOrderQuantity2({ id: item.id, quantity: item.quantity })
      );
      dispatch(updateOneOrderPrice2({ id: item.id, price: item.price }));
    });

    // إزالة أي منتج مؤقت جديد
    const originalSkus = originalLineItems.map((i) => i.sku);
    oneOrder.line_items.edges.forEach((edge: any) => {
      const sku = edge.node.sku;
      if (!originalSkus.includes(sku) && edge.node.id.startsWith("temp-")) {
        dispatch(
          removeTempProductBySku2({
            sku: edge.node.sku,
            warehouseId: edge.node.warehouse?.id,
          })
        );
      }
    });

    setEditeQuantity(false);
    setOriginalLineItems([]);
  };

  const ensureEditingStarted = () => {
    if (!editeQuantity) handleStartEditing();
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    ensureEditingStarted();
    dispatch(updateOneOrderQuantity2({ id, quantity }));
  };

  const handlePriceChange = (id: string, price: number) => {
    ensureEditingStarted();
    dispatch(updateOneOrderPrice2({ id, price }));
  };

  const handleAddProduct = (node: any) => {
    ensureEditingStarted(); // يبدأ التعديل تلقائيًا
    dispatch(
      addTempProductToOrder2({
        product: node.product,
        price: Number(node.price),
        warehouse: {
          id: node.warehouse.id,
          identifier: node.warehouse.identifier,
        },
      })
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Filter new temporary items
      const newItems = oneOrder.line_items.edges.filter((item: any) =>
        item.node.id.startsWith("temp-")
      );

      // Filter edited items (existing items with changed quantity or price)
      const editedItems = oneOrder.line_items.edges.filter((item: any) => {
        const original = originalLineItems.find(
          (orig) => orig.sku === item.node.sku
        );
        if (!original) return false;

        return (
          Number(original.quantity) !== Number(item.node.quantity) ||
          String(original.price) !== String(item.node.price)
        );
      });

      // Check if there are any changes
      if (newItems.length === 0 && editedItems.length === 0) {
        toast.success(t("noChanges"));
        setEditMode(false);
        return;
      }

      const date = new Date().getTime();

      // 1. Add new products first
      if (newItems.length > 0) {
        const formattedNew = newItems.map((item: any) => ({
          sku: item.node.sku,
          price: item.node.price,
          date: item.node.id.replace("temp-", date.toString()),
          quantity: item.node.quantity,
        }));

        const mutationAdd = addProductMutation1(id, formattedNew);

        await axiosPrivate.post("/gql-ajax", {
          query: mutationAdd,
          operationName: "AddLineItemsToOrder",
        });
      }

      // 2. Update edited products
      if (editedItems.length > 0) {
        const formattedEdited = editedItems.map((item: any) => ({
          id: item.node.id,
          quantity: item.node.quantity,
          price: item.node.price,
        }));

        const mutationUpdate = orderUpdateLineItemsMutationQ1(
          id,
          formattedEdited
        );
        await axiosPrivate.post("/gql-ajax", {
          query: mutationUpdate,
          operationName: "UpdateLineItems",
        });
      }

      // 3. Update total price if there are any changes
      if (newItems.length > 0 || editedItems.length > 0) {
        const mutationPrice = updateTotalPriceMutation(id, total, subtotal);
        await axiosPrivate.post("/gql-ajax", {
          query: mutationPrice,
        });
      }

      toast.success(t("saveSuccess"));
      setEditMode(false);
      setOriginalLineItems([]);
      fetchOrder();
    } catch (e: any) {
      console.error("Error Saving:", e?.response?.data || e.message || e);
      toast.error(t("saveFailed"));
      handleCancelEdits();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelItem = async (itemId: string) => {
    try {
      await axiosPrivate.post(`/orders/items/${id}/cancelitem/${itemId}`);
      fetchOrder();
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= Effects ================= */

  // Reset cursor when warehouse changes
  useEffect(() => {
    setCursor(null);
  }, [warehouseId]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku, cursor, warehouseId]);

  useEffect(() => {
    if (warehousesList?.length && !warehouseId) {
      setWarehouseId(warehousesList[0].identifier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehousesList]);

  /* ================= Render ================= */

  return (
    <>
      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <Button variant="darkred" onClick={handleCancelEdits}>
          {t("cancelEdits")}
        </Button>

        <Button variant="darkgreen" onClick={handleSave} disabled={isSaving}>
          {isSaving ? t("saving") : t("saveChanges")}
        </Button>

        <Button
          variant="secondary"
          className="max-w-[200px]"
          onClick={editeQuantity ? handleCancelEdits : handleStartEditing}
        >
          {editeQuantity ? t("cancelEdits") : t("editProducts")}
        </Button>

        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          {t("addProduct")}
        </Button>
      </div>

      {/* Table */}
      <div className="max-w-[98%] mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("product")}</TableHead>
              <TableHead>{t("sku")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              {editeQuantity && <TableHead>{t("action")}</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {oneOrder?.line_items?.edges?.map((item: any) => {
              const isTemp = item.node.id.startsWith("temp-");
              return (
                <TableRow key={item.node.id}>
                  <TableCell>{item.node.product_name}</TableCell>
                  <TableCell>{item.node.sku}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.node.price}
                      onChange={(e) =>
                        handlePriceChange(item.node.id, Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.node.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.node.id,
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {Number(item.node.price) * Number(item.node.quantity)}
                  </TableCell>
                  {editeQuantity && (
                    <TableCell>
                      {isTemp ? (
                        <Button
                          size="sm"
                          variant="darkred"
                          onClick={() =>
                            dispatch(
                              removeTempProductBySku2({
                                sku: item.node.sku,
                                warehouseId: item.node.warehouse?.identifier,
                              })
                            )
                          }
                        >
                          ✖
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="darkred"
                          onClick={() => handleCancelItem(item.node.id)}
                        >
                          {t("cancel")}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex flex-col gap-2 max-w-[500px]">
        <SummaryRow label={t("subtotal")} value={subtotal} />

        <SummaryRow
          label={t("shippingPrice")}
          value={Number(oneOrder?.shipping_lines?.price)}
        />

        <SummaryRow
          label={t("discount")}
          value={Number(oneOrder?.total_discounts)}
        />

        <SummaryRow label={t("vat")} value={Number(oneOrder?.total_tax)} />

        <div className="flex justify-between items-center">
          <label className="text-lg font-semibold">{t("totalPrice")}</label>
          <span
            className="text-xl font-bold text-orange-600"
            style={{ fontFamily: "consolas" }}
          >
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        confirmedSku={confirmedSku}
        setConfirmedSku={setConfirmedSku}
        sku={sku}
        setSku={setSku}
        warehouseId={warehouseId}
        setWarehouseId={setWarehouseId}
        warehouses={warehousesList ?? []}
        loading={fetchingProducts || loadingWarehousesList}
        productEdges={productsQuery?.edges ?? []}
        orderProducts={
          oneOrder?.line_items?.edges?.map((e: any) => ({
            sku: e.node.sku,
          })) ?? []
        }
        handleAdd={handleAddProduct}
        pageInfo={productsQuery?.pageInfo}
        setCursor={setCursor}
      />
    </>
  );
}

/* ================= Helper ================= */

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted/50">
      <label className="font-medium text-[14px]">{label}</label>
      <span className="font-bold" style={{ fontFamily: "consolas" }}>
        {value.toFixed(2)}
      </span>
    </div>
  );
}
