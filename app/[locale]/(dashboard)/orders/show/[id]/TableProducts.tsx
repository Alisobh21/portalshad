"use client";

import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { FaCartFlatbed } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

import TableShow from "./TableShow";
import TableSave from "./TableSave";

import { Button } from "@/components/ui/button";
import { addProductsListToEdit } from "@/store/slices/CountrySlice";

/* ================= Types ================= */

interface TableProductsProps {
  status: boolean;
  fetchOrder: () => Promise<void>;
  id: string;
}

interface LineItemNode {
  product_name: string;
  sku: string;
  quantity: number;
  price: string;
}

interface LineItemEdge {
  node: LineItemNode;
}

/* ================= Component ================= */

export default function TableProducts({
  status,
  fetchOrder,
  id,
}: TableProductsProps) {
  const t = useTranslations("AllProducts");
  const dispatch = useDispatch();

  const { oneOrder } = useSelector((state: any) => state.orders);

  const [editMode, setEditMode] = useState<boolean>(false);

  const lineItems: LineItemEdge[] = oneOrder?.line_items?.edges ?? [];

  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => {
      const price = Number(item.node.price);
      const quantity = item.node.quantity;
      return acc + price * quantity;
    }, 0);
  }, [lineItems]);

  const productsArrays = useMemo(
    () =>
      lineItems.map((item) => ({
        name: item.node.product_name,
        sku: item.node.sku,
        quantity: item.node.quantity,
        price: Number(item.node.price),
      })),
    [lineItems]
  );

  const addProductsToEdit = () => {
    dispatch(addProductsListToEdit(productsArrays));
  };

  const removeProductsFromEdit = () => {
    dispatch(addProductsListToEdit([]));
  };

  return (
    <div className="p-2 lg:p-4 relative">
      {/* ===== Header ===== */}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <FaCartFlatbed size={20} className="" />
          </div>
          <h1 className="text-xl font-semibold">{t("details")}</h1>
        </div>

        {status && (
          <div className="absolute top-[-20px] end-[4px]">
            <Button
              size="icon"
              variant="normal"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? <IoClose /> : <BiEditAlt size={17} />}
            </Button>
          </div>
        )}
      </header>

      {/* ===== Content ===== */}
      {editMode ? (
        <TableSave fetchOrder={fetchOrder} id={id} setEditMode={setEditMode} />
      ) : (
        <TableShow />
      )}
    </div>
  );
}
