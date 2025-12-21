"use client";

import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= Types ================= */

interface LineItemNode {
  product_name: string;
  sku: string;
  price: string;
  quantity: number;
  backorder_quantity?: number;
}

interface LineItemEdge {
  node: LineItemNode;
}

interface Order {
  line_items?: {
    edges: LineItemEdge[];
  };
  subtotal?: string;
  shipping_lines?: {
    price?: string;
  };
  total_discounts?: string;
  total_tax?: string;
  total_price?: string;
}

/* ================= Component ================= */

export default function TableShow() {
  const { oneOrder } = useSelector((state: any) => state.orders) as {
    oneOrder: Order;
  };

  const t = useTranslations("TableProduct");
  const tm = useTranslations("TableProductColumns");

  const lineItems = oneOrder?.line_items?.edges ?? [];

  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => {
      const price = Number(item.node.price) || 0;
      const quantity = item.node.quantity || 0;
      return acc + price * quantity;
    }, 0);
  }, [lineItems]);

  const total = useMemo(() => {
    const shipping = Number(oneOrder?.shipping_lines?.price) || 0;
    const discount = Number(oneOrder?.total_discounts) || 0;
    const tax = Number(oneOrder?.total_tax) || 0;

    return subtotal + shipping - discount + tax;
  }, [subtotal, oneOrder]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-4">
      {/* ================= Table ================= */}
      <div className="col-span-3 overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{t("product")}</TableHead>
              <TableHead>{t("sku")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{tm("backorder1")}</TableHead>
              <TableHead>{t("total")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lineItems.map((item, index) => {
              const price = Number(item.node.price) || 0;
              const quantity = item.node.quantity || 0;

              return (
                <TableRow key={index}>
                  <TableCell>{item.node.product_name}</TableCell>
                  <TableCell>{item.node.sku}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>{item.node.backorder_quantity ?? 0}</TableCell>
                  <TableCell>{price * quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ================= Summary ================= */}
      <div className="flex flex-col gap-2">
        <SummaryRow label={t("subtotal")} value={Number(oneOrder?.subtotal)} />

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
            {Number(oneOrder?.total_price)}
            {/* {total} */}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper ================= */

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted/50">
      <label className="font-medium text-[14px]">{label}</label>
      <span className="font-bold" style={{ fontFamily: "consolas" }}>
        {value}
      </span>
    </div>
  );
}
