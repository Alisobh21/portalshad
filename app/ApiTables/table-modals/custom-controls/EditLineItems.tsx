"use client";

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { IoMdCloseCircle } from "react-icons/io";
import axiosPrivate from "@/axios/axios";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { getWarehouseProductsQry } from "@/helpers/queryFunctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface LineItem {
  product_name?: string;
  price?: string | number;
  sku?: string;
}

interface EditLineItemsAction {
  method: string;
  url: string;
  payload: {
    name?: string;
    user_id?: string;
    line_items?: LineItem[];
  };
}

interface EditLineItemsProps {
  action: EditLineItemsAction;
  closeModal?: () => void;
}

interface RowActionsState {
  rowActionPostLoading: boolean;
}

interface FormValues {
  name?: string;
}

export default function EditLineItems({ action }: EditLineItemsProps) {
  const { rowActionPostLoading } = useSelector(
    (state: { rowActions: RowActionsState }) => state?.rowActions
  );
  const t = useTranslations("Orders");
  const tModal = useTranslations("addProductsModal");
  const { rowActionsPostHandler } = useUtilsProvider();

  const form = useForm<FormValues>({
    defaultValues: {
      name: action?.payload?.name || "",
    },
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (action?.payload?.line_items) {
      setLineItems([...action.payload.line_items]);
    }
  }, [action?.payload?.line_items]);

  useEffect(() => {
    if (action?.payload?.name) {
      form.setValue("name", action?.payload?.name);
    }
  }, [action?.payload?.name, form]);

  const handleEditClick = (index: number, sku?: string) => {
    setEditRowIndex(index);
    setSearchValue(sku || "");
    setSearchResult(null);
  };

  const handleSelectSku = () => {
    if (!searchResult) return;
    const alreadyExists = lineItems.some(
      (item, idx) => item.sku === searchResult && idx !== editRowIndex
    );

    if (alreadyExists) {
      toast.error(tModal("productAlreadyExists"));
      return;
    }

    setLineItems((prev) => {
      const updated = [...prev];
      if (editRowIndex !== null && updated[editRowIndex]) {
        updated[editRowIndex] = {
          ...updated[editRowIndex],
          sku: searchResult,
        };
      }
      return updated;
    });

    setEditRowIndex(null);
    setSearchResult(null);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const cleanedValue = searchValue.replace(/\s+/g, "");
      const query = getWarehouseProductsQry(null, null, cleanedValue);

      const response = await axiosPrivate.post(
        "/gql-ajax",
        { query },
        {
          headers: {
            "X-Q7k": action?.payload?.user_id,
            "P-E8o": "true",
          },
        }
      );

      const edges = response?.data?.warehouse_products?.data?.edges;

      if (edges && edges.length > 0) {
        const foundSku = edges[0]?.node?.product?.sku;
        if (foundSku) {
          setSearchResult(foundSku);
        } else {
          toast.error(tModal("productNotFound"));
          setSearchResult(null);
        }
      } else {
        toast.error(tModal("productNotFound"));
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(tModal("productNotFound"));
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  function submitCustomControlForm() {
    rowActionsPostHandler(
      action?.method,
      action?.url?.replace("/api", ""),
      { ...action?.payload, line_items: lineItems },
      action as EditLineItemsAction & { onSuccess?: string; isBulk?: boolean },
      {
        "X-Q7k": action?.payload?.user_id || "",
        "P-E8o": "true",
      }
    );
  }

  return (
    <div className="relative">
      <header className="pb-5 text-center">
        <h5>{t("editOrder")}</h5>
      </header>
      <form
        onSubmit={form.handleSubmit(submitCustomControlForm)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{tModal("productName")}</TableHead>
              <TableHead>{tModal("price")}</TableHead>
              <TableHead>{tModal("sku")}</TableHead>
              <TableHead>{tModal("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length > 0 ? (
              lineItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.product_name || "-"}</TableCell>
                  <TableCell>{item?.price || "-"}</TableCell>
                  <TableCell>{item?.sku || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="normal"
                      size="sm"
                      type="button"
                      onClick={() => handleEditClick(index, item?.sku)}
                    >
                      {tModal("edite")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {tModal("noItems") || "No items found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {editRowIndex !== null && (
          <div className="absolute inset-0 flex items-center justify-center flex-col z-9999 bg-background rounded-xl p-5 border shadow-md">
            <IoMdCloseCircle
              size={22}
              className="absolute ltr:top-2 ltr:right-2 rtl:top-2 rtl:left-2 cursor-pointer"
              onClick={() => setEditRowIndex(null)}
            />
            <div className="flex w-full text-center mb-1">
              <h3 className="text-sm">{tModal("enterNewSku")}</h3>
            </div>
            <div className="flex items-center gap-3 w-full">
              <Input
                placeholder="Enter SKU..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="closeModal"
                size="sm"
                type="button"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Loading..." : tModal("searchTitle")}
              </Button>
            </div>
            {searchResult && (
              <div className="rounded-lg border bg-background shadow-md p-2 w-full mt-1">
                <div
                  className="cursor-pointer w-full px-3 py-1 rounded-lg hover:bg-accent duration-300 transition"
                  onClick={handleSelectSku}
                >
                  {searchResult}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="modal"
          size="md"
          className="w-full"
          type="submit"
          disabled={rowActionPostLoading}
        >
          {rowActionPostLoading ? "Loading..." : t("editOrder")}
        </Button>
      </form>
    </div>
  );
}
