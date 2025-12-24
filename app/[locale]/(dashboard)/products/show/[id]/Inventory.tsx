"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaClipboardList } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState } from "@/store/store";

interface InventoryProps {
  params?: any;
}

interface InventoryNode {
  node: {
    created_at: string;
    warehouse_id: number;
    location?: {
      name: string;
    };
    previous_on_hand: number;
    change_in_on_hand: number;
    reason?: string;
  };
}

interface InventoryProduct {
  edges?: InventoryNode[];
}

interface Warehouse {
  id: number;
  identifier: string;
}

export const Inventory: React.FC<InventoryProps> = ({ params }) => {
  const { inventoryOneProduct } = useSelector(
    (state: RootState) => state.products
  ) as { inventoryOneProduct: InventoryProduct };

  const { warehouses } = useSelector((state: RootState) => state.app) as {
    warehouses: Warehouse[];
  };

  const t = useTranslations("AllProducts");

  if (!inventoryOneProduct?.edges || inventoryOneProduct.edges.length === 0)
    return null;

  return (
    <Card className="p-6 lg:p-10 w-full">
      <header className="mb-8 flex items-center gap-2">
        <FaClipboardList size={25} />
        <h1 className="text-2xl font-semibold">{t("inventoryLog")}</h1>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("warehouse")}</TableHead>
            <TableHead>{t("location")}</TableHead>
            <TableHead>{t("previousQty")}</TableHead>
            <TableHead>{t("newQty")}</TableHead>
            <TableHead>{t("notes")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {inventoryOneProduct.edges.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {new Date(item.node.created_at).toLocaleString("ar-EG")}
              </TableCell>
              <TableCell>
                {warehouses.find((w) => w.id === item.node.warehouse_id)
                  ?.identifier || "-"}
              </TableCell>
              <TableCell>{item.node.location?.name || "-"}</TableCell>
              <TableCell>{item.node.previous_on_hand}</TableCell>
              <TableCell>{item.node.change_in_on_hand}</TableCell>
              <TableCell>{item.node.reason || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
