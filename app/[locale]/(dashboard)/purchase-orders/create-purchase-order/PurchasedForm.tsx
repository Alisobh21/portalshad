"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useForm,
  FormProvider,
  Controller,
  FieldValues,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eraser, Search } from "lucide-react";

import HeaderForm from "@/components/HeaderForm";
import { SuccessToast } from "@/components/Toasts";
import axiosPrivate from "@/axios/axios";
import { getProductsQry } from "@/helpers/queryFunctions";
import {
  addToOrder,
  removeFromOrder,
  updateOrderQuantity,
  getProducts,
  clearTargetArray,
} from "@/store/slices/orderSlice";
import type { RootState } from "@/store/store";
import type { ProductsQueryEdge } from "../../orders/create-order/types";
import { toast } from "sonner";
import { FaCartArrowDown } from "react-icons/fa";
import { Card } from "@/components/ui/card";

export default function PurchasedForm() {
  const t = useTranslations("PurchaseOrders");
  const TModel = useTranslations("addProductsModal");
  const tTable = useTranslations("TableProduct");

  const dispatch = useDispatch();
  const router = useRouter();
  const { shippingProducts, productsQuery } = useSelector(
    (state: RootState) => state.orders
  );
  const { suppliers, warehousesList, loadingSuppliers, loadingWarehousesList } =
    useSelector((state: RootState) => state.app);

  const [sku, setSku] = useState("");
  const [confirmedSku, setConfirmedSku] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchProductsLoading, setFetchProductsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null
  );

  const methods = useForm<FieldValues>();
  const { handleSubmit, control } = methods;

  // Add product to order
  const handleAddProduct = (product: ProductsQueryEdge["node"]) => {
    dispatch(addToOrder({ product, targetArray: "shippingProducts" }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    dispatch(
      updateOrderQuantity({ index, quantity, targetArray: "shippingProducts" })
    );
  };

  const fetchProductsQuery = async () => {
    setFetchProductsLoading(true);
    try {
      const query = getProductsQry(cursor, sku);
      const response = await axiosPrivate.post("/gql-ajax", { query });
      if (response.data.success)
        dispatch(getProducts(response.data.products.data));
    } catch (e) {
      console.error(e);
    } finally {
      setFetchProductsLoading(false);
    }
  };

  function getList<T, K extends keyof T>(array: T[], key: K): T[K][] {
    return array.map((item) => item[key]);
  }

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    const li_product_name = getList(shippingProducts, "name");
    const li_sku = getList(shippingProducts, "sku");
    const li_quantity = getList(shippingProducts, "quantity");
    const li_warehouse_id = getList(
      shippingProducts,
      "warehouse_products"
    )?.flatMap((item: any) => item.map((p: any) => p.warehouse_id));

    const now = new Date();
    const po_number = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}-${now.getHours()}`;

    const payload = {
      warehouse: data.warehouse,
      vendor: data.vendor,
      po_number,
      li_sku,
      li_quantity,
      li_product_name,
      li_warehouse_id,
    };

    try {
      const response = await axiosPrivate.post(
        "/purchase-orders/store",
        payload
      );
      if (response.data.success) {
        console.log(response.data, "response.data");
        dispatch(clearTargetArray("shippingProducts"));
        toast.success(t("msg"));
        router.push(
          `/purchase-orders/show/${response?.data?.purchase_order_create?.purchase_order?.id}`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsQuery();
    dispatch(clearTargetArray("shippingProducts"));
  }, []);

  useEffect(() => {
    fetchProductsQuery();
  }, [sku, cursor]);

  return (
    <Card>
      <FormProvider {...methods}>
        <div className="w-full p-5 lg:p-7">
          <HeaderForm
            Icon={FaCartArrowDown}
            title={t("subtitlecreate")}
            desc={t("subcreate")}
            link="/purchase-orders/status/all-po"
            linkDes={t("backcreate")}
          />

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Vendor & Warehouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Controller
                name="vendor"
                control={control}
                rules={{ required: t("vendorRequired") }}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={loadingSuppliers}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("vendor")} />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers?.map((s) => (
                        <SelectItem key={s?.node?.id} value={s?.node?.id}>
                          {s?.node?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="warehouse"
                control={control}
                rules={{ required: t("warehouseRequired") }}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={loadingWarehousesList}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("warehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehousesList?.map((w) => (
                        <SelectItem key={w?.identifier} value={w?.identifier}>
                          {w?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Add Product Button */}
            <Button
              size="md"
              type="button"
              variant="normal"
              onClick={() => setModalOpen(true)}
            >
              + {TModel("add")}
            </Button>

            {/* Products Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{TModel("productName")}</TableHead>
                  <TableHead>{TModel("sku")}</TableHead>
                  <TableHead>{TModel("quantity")}</TableHead>
                  <TableHead>{TModel("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingProducts?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromOrder({
                              index,
                              targetArray: "shippingProducts",
                            })
                          )
                        }
                      >
                        {TModel("delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              size="md"
              type="submit"
              disabled={loading || shippingProducts.length === 0}
            >
              {loading ? TModel("saving") : TModel("addingPurchaseOrder")}
            </Button>
          </form>
        </div>
      </FormProvider>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(80vw-2rem)] max-w-[calc(80vw-2rem)] sm:max-w-[calc(90vw-2rem)] md:max-w-[calc(90vw-4rem)]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              {TModel("title")}
            </DialogTitle>
          </DialogHeader>

          {/* Search Bar */}
          <div className="grid w-full grid-cols-8 gap-2 items-center mb-4">
            <div className="relative col-span-8 sm:col-span-5">
              <Input
                placeholder={TModel("searchPlaceholder")}
                value={confirmedSku}
                onChange={(e) => setConfirmedSku(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSku(confirmedSku)}
                className="pe-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 end-2 flex items-center text-muted-foreground"
                onClick={() => setSku(confirmedSku)}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <div className="col-span-8 sm:col-span-3 flex items-center gap-2">
              <Select
                value={selectedWarehouse ?? ""}
                onValueChange={setSelectedWarehouse}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المستودع" />
                </SelectTrigger>
                <SelectContent>
                  {warehousesList.map((w) => (
                    <SelectItem key={w.identifier} value={w.identifier}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {sku && (
                <Eraser
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => {
                    setSku("");
                    setConfirmedSku("");
                  }}
                />
              )}
            </div>
          </div>

          {/* Products Table */}
          {fetchProductsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{TModel("productName")}</TableHead>
                  <TableHead>{TModel("sku")}</TableHead>
                  <TableHead>{TModel("price")}</TableHead>
                  <TableHead>{TModel("warehouse")}</TableHead>
                  <TableHead>{TModel("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsQuery.edges?.map((p: ProductsQueryEdge, i: number) => {
                  const added = shippingProducts.some(
                    (prod) => prod.sku === p.node.sku
                  );
                  const price = Number(
                    p.node.warehouse_products?.[0]?.price ?? 0
                  );
                  return (
                    <TableRow key={i}>
                      <TableCell>{p.node.name}</TableCell>
                      <TableCell>{p.node.sku}</TableCell>
                      <TableCell>{price.toFixed(2)}</TableCell>
                      <TableCell>
                        {p.node.warehouse_products?.[0]?.warehouse_identifier}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          type="button"
                          variant="modal"
                          disabled={added}
                          onClick={() => handleAddProduct(p.node)}
                        >
                          {added
                            ? TModel("addedButton")
                            : TModel("addProductButton")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Footer */}
          <div className="flex gap-2 justify-center items-center m-4">
            {productsQuery.pageInfo?.hasNextPage && (
              <Button
                type="button"
                variant="normal"
                onClick={() =>
                  setCursor(productsQuery.pageInfo?.endCursor ?? null)
                }
              >
                {TModel("next")}
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setModalOpen(false)}
              variant="closeModal"
            >
              {tTable("end")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
