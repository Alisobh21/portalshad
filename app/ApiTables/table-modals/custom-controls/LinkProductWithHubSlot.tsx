"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { MdWarehouse } from "react-icons/md";
import { TbPencilCheck } from "react-icons/tb";
import { HiBackspace } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineFlipToBack } from "react-icons/md";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AvailableSlot {
  id: number;
  location: string;
}

interface LinkProductWithHubSlotAction {
  method: string;
  url: {
    api: string;
  };
  payload: {
    availableSlots: AvailableSlot[];
    totalProductQuantity: number | null;
  };
}

interface LinkProductWithHubSlotProps {
  action: LinkProductWithHubSlotAction;
  closeModal: () => void;
}

interface RowActionsState {
  rowActionPostLoading: boolean;
}

export default function LinkProductWithHubSlot({
  action,
  closeModal,
}: LinkProductWithHubSlotProps) {
  const { rowActionPostLoading } = useSelector(
    (state: { rowActions: RowActionsState }) => state?.rowActions
  );
  const { rowActionsPostHandler } = useUtilsProvider();

  const formSchema = useMemo(
    () =>
      z.object({
        slotId: z.string().min(1, "Please choose slot"),
        product_quantity: z
          .string()
          .min(1, "Please enter product quantity")
          .refine(
            (val) => {
              const num = Number(val);
              return !isNaN(num) && num >= 1;
            },
            {
              message: "Please enter a valid quantity",
            }
          )
          .refine(
            (val) => {
              if (action?.payload?.totalProductQuantity !== null) {
                const num = Number(val);
                return num <= (action?.payload?.totalProductQuantity || 0);
              }
              return true;
            },
            {
              message: `Please enter a valid quantity. max ${action?.payload?.totalProductQuantity}`,
            }
          ),
      }),
    [action?.payload?.totalProductQuantity]
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotId: "",
      product_quantity: "",
    },
  });

  function onSubmit(data: FormValues) {
    rowActionsPostHandler(
      action?.method,
      action?.url?.api?.replace("/api", ""),
      {
        ...action?.payload,
        ...data,
        slotId: Number(data?.slotId),
        product_quantity: Number(data?.product_quantity),
      },
      action as LinkProductWithHubSlotAction & {
        onSuccess?: string;
        isBulk?: boolean;
      }
    );
  }

  return (
    <>
      <header className="pb-5 text-center">
        <h5>Link product to available slot</h5>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="slotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Slot
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <MdWarehouse
                      className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground"
                      size={18}
                    />
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full ltr:pl-10 rtl:pr-10">
                        <SelectValue placeholder="Choose slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {action?.payload?.availableSlots?.map((slot) => (
                          <SelectItem key={slot?.id} value={String(slot.id)}>
                            {slot?.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Quantity
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <AiOutlineProduct
                      className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="number"
                      placeholder={`Choose Quantity. ${
                        action?.payload?.totalProductQuantity
                          ? `max ${action?.payload?.totalProductQuantity}`
                          : ""
                      }`}
                      min={1}
                      max={
                        action?.payload?.totalProductQuantity || undefined
                      }
                      className="ltr:pl-10 rtl:pr-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={rowActionPostLoading}
            >
              <TbPencilCheck className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
              {rowActionPostLoading ? "Loading..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="w-full"
            >
              <HiBackspace className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
              Dismiss
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
