"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { BiEditAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import axiosPrivate from "@/axios/axios";
import { toast } from "sonner";

/* ShadCN UI components */
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ================= Types ================= */

interface PackagingPurchaseProps {
  fetchPurchaseOrder: () => void;
}

interface PurchaseOrderData {
  id?: string | number;
  packing_note?: string;
}

interface PurchaseOrderResponse {
  data?: PurchaseOrderData;
}

interface RootState {
  purchase: {
    onePurchaseOrder: PurchaseOrderResponse | null;
  };
}

interface FormValues {
  packing_note: string;
}

/* ================= Component ================= */

const PackagingPurchase: FC<PackagingPurchaseProps> = ({
  fetchPurchaseOrder,
}) => {
  const t = useTranslations("PurchaseOrders");
  const { onePurchaseOrder } = useSelector(
    (state: RootState) => state.purchase
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      packing_note: onePurchaseOrder?.data?.packing_note || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      po_id: onePurchaseOrder?.data?.id,
      packing_note: data.packing_note,
    };

    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/purchase-orders/update",
        payload
      );
      if (response?.data?.success) {
        toast.success(t("noteAddedSuccess") || "تم اضافة الملاحظة بنجاح");
        fetchPurchaseOrder();
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error(t("updateFailed") || "فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <GrNotes size={20} />
          </div>
          <h1 className="text-2xl font-semibold">{t("packingNoteTitle")}</h1>
        </div>
        <div>
          {editMode ? (
            <Button
              variant="normal"
              className="absolute top-[-20px] end-[4px]"
              size="icon"
              onClick={() => setEditMode(false)}
            >
              <IoClose size={20} />
            </Button>
          ) : (
            <Button
              variant="normal"
              className="absolute top-[-20px] end-[4px]"
              size="icon"
              onClick={() => setEditMode(true)}
            >
              <BiEditAlt size={17} />
            </Button>
          )}
        </div>
      </header>

      <div className="px-2 lg:px-4">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Textarea
              id="packing_note"
              {...register("packing_note", {
                required: t("packingNoteRequired"),
              })}
              defaultValue={onePurchaseOrder?.data?.packing_note}
              disabled={!editMode}
              className="min-h-[200px]"
              placeholder={editMode ? t("packingNoteHelper") : ""}
            />
            {errors.packing_note && (
              <p className="text-red-600 text-sm mt-1">
                {errors.packing_note.message}
              </p>
            )}
            {!editMode && (
              <p className="text-sm text-muted-foreground">
                {t("packingNoteHelper")}
              </p>
            )}
          </div>
          {editMode && (
            <Button
              type="submit"
              variant="lightOragne"
              className="w-full"
              disabled={loading}
            >
              {loading ? t("updating") : t("update")}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PackagingPurchase;
