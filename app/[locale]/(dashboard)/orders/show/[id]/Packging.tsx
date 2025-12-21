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
import { Label } from "@/components/ui/label";

interface PackagingProps {
  id: string;
  fetchOrder: () => void;
  status?: boolean;
}

interface RootState {
  orders: {
    oneOrder: {
      packing_note?: string;
    } | null;
  };
}

interface FormValues {
  packing_note: string;
}

const Packaging: FC<PackagingProps> = ({ id, fetchOrder, status }) => {
  const t = useTranslations("ShowOrder");
  const { oneOrder } = useSelector((state: RootState) => state.orders);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      packing_note: oneOrder?.packing_note || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      order_id: id,
      packing_note: data.packing_note,
    };
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        "orders/updatePackingNote",
        payload
      );
      if (response?.data?.success) {
        toast.success(t("noteAddedSuccess"));
        fetchOrder();
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t("updateFailed"));
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
          <h1 className="text-2xl font-semibold">{t("noteOrder")}</h1>
        </div>
        {status && (
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
        )}
      </header>

      <div className="px-2 lg:px-4">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <textarea
              id="packing_note"
              {...register("packing_note", {
                required: t("packingNoteRequired"),
              })}
              defaultValue={oneOrder?.packing_note}
              disabled={!editMode}
              className="min-h-[80px] border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder={editMode ? t("packingNoteDescription") : ""}
            />
            {errors.packing_note && (
              <p className="text-red-600 text-sm mt-1">
                {errors.packing_note.message}
              </p>
            )}
            {status && !editMode && (
              <p className="text-sm text-muted-foreground">
                {t("packingNoteDescription")}
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

export default Packaging;
