"use client";

import { FC } from "react";
import { useSelector } from "react-redux";
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
  fulfillment_status?: string;
  product_name?: string;
  sku?: string;
  quantity?: number;
  quantity_received?: number;
}

interface LineItemEdge {
  node: LineItemNode;
}

interface PurchaseOrderData {
  line_items?: {
    edges?: LineItemEdge[];
  };
}

interface PurchaseOrderResponse {
  data?: PurchaseOrderData;
}

interface RootState {
  purchase: {
    onePurchaseOrder: PurchaseOrderResponse | null;
  };
}

interface TableDetailsProps {
  params?: {
    id?: string;
  };
}

/* ================= Component ================= */

const TableDetails: FC<TableDetailsProps> = ({ params }) => {
  const { onePurchaseOrder } = useSelector(
    (state: RootState) => state.purchase
  );
  const t = useTranslations("PurchaseOrders");
  const t2 = useTranslations("TableOrderCreate");

  const lineItems = onePurchaseOrder?.data?.line_items?.edges ?? [];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t2("productName")}</TableHead>
            <TableHead>{t2("BySku")}</TableHead>
            <TableHead>{t("sentQuantity")}</TableHead>
            <TableHead>{t("receivedQuantity")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.length > 0 ? (
            lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.node?.fulfillment_status || "-"}</TableCell>
                <TableCell>{item?.node?.product_name || "-"}</TableCell>
                <TableCell>{item?.node?.sku || "-"}</TableCell>
                <TableCell>{item?.node?.quantity || 0}</TableCell>
                <TableCell>{item?.node?.quantity_received || 0}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                {t("noItems") || "No items found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDetails;
