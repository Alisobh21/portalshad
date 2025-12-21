"use client";

import { Loader2, Search, Eraser } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { ProductsQueryEdge, Warehouse as UIWarehouse } from "./types";
import type { StoreOrderProduct } from "@/store/slices/orderSlice";
import { useTranslations } from "next-intl";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmedSku: string;
  setConfirmedSku: (val: string) => void;
  sku: string;
  setSku: (val: string) => void;
  warehouseId: string | null;
  setWarehouseId: (val: string) => void;
  warehouses: UIWarehouse[];
  loading: boolean;
  productEdges: ProductsQueryEdge[];
  orderProducts: StoreOrderProduct[];
  handleAdd: (node: ProductsQueryEdge["node"]) => void;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string };
  setCursor: (cursor: string | null) => void;
}

export default function AddProductDialog({
  open,
  onOpenChange,
  confirmedSku,
  setConfirmedSku,
  sku,
  setSku,
  warehouseId,
  setWarehouseId,
  warehouses,
  loading,
  productEdges,
  orderProducts,
  handleAdd,
  pageInfo,
  setCursor,
}: AddProductDialogProps) {
  const t = useTranslations("TableOrderCreate");

  const handleSearchClick = () => setSku(confirmedSku);
  const handleClearClick = () => {
    setSku("");
    setConfirmedSku("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(80vw-2rem)] max-w-[calc(80vw-2rem)] sm:max-w-[calc(90vw-2rem)] md:max-w-[calc(90vw-4rem)]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {t("addProduct")}
          </DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="grid w-full grid-cols-8 gap-2 items-center">
          <div className="relative col-span-8 sm:col-span-5">
            <Input
              className="pe-10"
              placeholder={t("searchBySku")}
              value={confirmedSku}
              onChange={(e) => setConfirmedSku(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            />
            <button
              type="button"
              aria-label={t("searchBySku")}
              className="absolute inset-y-0 end-2 flex items-center text-muted-foreground"
              onClick={handleSearchClick}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="col-span-8 sm:col-span-3 flex items-center gap-2">
            <Select value={warehouseId ?? ""} onValueChange={setWarehouseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المستودع" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.identifier} value={w.identifier}>
                    {w.name ?? w.identifier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {sku && (
              <Eraser
                className="h-4 w-4 cursor-pointer"
                onClick={handleClearClick}
              />
            )}
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("productName")}</TableHead>
                <TableHead>{t("sku")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("warehouse")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productEdges.map(({ node }, i) => {
                const added = orderProducts.some(
                  (p) => p.sku === node.product.sku
                );
                const price = Number(node.price ?? 0);

                return (
                  <TableRow key={i}>
                    <TableCell>{node.product.name}</TableCell>
                    <TableCell>{node.product.sku}</TableCell>
                    <TableCell>{price.toFixed(2)}</TableCell>
                    <TableCell>{node.warehouse.identifier}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="modal"
                        disabled={added}
                        onClick={() => handleAdd(node)}
                      >
                        {added ? t("added") : t("addProduct")}
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
          {pageInfo?.hasNextPage && (
            <Button
              variant="normal"
              onClick={() => setCursor(pageInfo?.endCursor ?? null)}
            >
              {t("next")}
            </Button>
          )}
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            {t("end")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
