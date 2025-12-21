"use client";

import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { FaShippingFast } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdLocalShipping, MdCheckCircle } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import axiosPrivate from "@/axios/axios";
import { fetchShipping } from "@/store/slices/CountrySlice";

/* ShadCN components */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingProps {
  fetchOrder: () => void;
  id: string;
  status?: boolean;
}

interface RootState {
  app: {
    shippingMethods: Record<string, Record<string, string>>;
  };
  orders: {
    oneOrder: Order | null;
  };
}

interface Order {
  total_price: number;
  shop_name: string;
  shipping_lines?: {
    carrier?: string;
    method?: string;
    price?: number;
  };
}

interface FormValues {
  carrier: string;
  method: string;
  total_price: number;
}

const Shipping: FC<ShippingProps> = ({ fetchOrder, id, status }) => {
  const t = useTranslations("ShowOrder");
  const tShipping = useTranslations("ShippingCompany");

  const dispatch = useDispatch();
  const { shippingMethods } = useSelector((state: RootState) => state.app);
  const { oneOrder } = useSelector((state: RootState) => state.orders);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchShipping() as any);
  }, [dispatch]);

  useEffect(() => {
    if (oneOrder?.shipping_lines?.carrier)
      setValue("carrier", oneOrder.shipping_lines.carrier);
    if (oneOrder?.shipping_lines?.method)
      setValue("method", oneOrder.shipping_lines.method);
    if (oneOrder?.total_price) setValue("total_price", oneOrder.total_price);
  }, [oneOrder, setValue]);

  const selectedCarrier = watch("carrier");
  const availableCompanies = shippingMethods?.[selectedCarrier] || {};

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    const payload = {
      carrier: data.carrier,
      method: data.method,
      total_price: parseFloat(data.total_price.toString()),
      order_id: id,
      sl_price: oneOrder?.shipping_lines?.price,
    };

    try {
      const response = await axiosPrivate.post(
        "orders/updateShippingInfo",
        payload
      );
      if (response?.data?.success) {
        setEditMode(false);
        toast.success(t("updated"));
        fetchOrder();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <FaShippingFast size={20} />
          </div>
          <h1 className="text-2xl font-semibold">{t("shippingInformation")}</h1>
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

      <div className="grid grid-cols-1 gap-3 px-2 lg:px-4">
        {editMode ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* Carrier Select */}
            <div>
              <Select
                onValueChange={(val) => setValue("carrier", val)}
                value={watch("carrier")}
              >
                <SelectTrigger className="w-full border">
                  <SelectValue placeholder={tShipping("placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(shippingMethods || {}).map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carrier && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.carrier.message}
                </p>
              )}
            </div>

            {/* Method Select */}
            <div>
              <Select
                onValueChange={(val) => setValue("method", val)}
                value={watch("method")}
              >
                <SelectTrigger className="w-full border">
                  <SelectValue placeholder={tShipping("company_name")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(availableCompanies).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.method && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.method.message}
                </p>
              )}
            </div>

            {/* Total Price Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="total_price">{t("orderTotal")}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <GiReceiveMoney />
                </div>
                <Input
                  id="total_price"
                  type="number"
                  className="pl-10"
                  defaultValue={oneOrder?.total_price}
                  {...register("total_price", { required: t("requiredTotal") })}
                />
              </div>
              {errors.total_price && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.total_price.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="lightOragne"
              disabled={loading}
            >
              {loading ? t("updating") : t("update")}
            </Button>
          </form>
        ) : (
          <>
            {/* Display Mode */}
            <div className="flex flex-col gap-2">
              <span>{tShipping("shipping_companies")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <MdLocalShipping />
                <span className="text-sm">
                  {oneOrder?.shipping_lines?.carrier}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>{tShipping("company_name")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <MdLocalShipping />
                <span className="text-sm">
                  {oneOrder?.shipping_lines?.method}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>{tShipping("storeName")}</span>
              <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                <span className="text-sm">{oneOrder?.shop_name}</span>
              </div>
            </div>

            {(oneOrder?.shipping_lines?.method?.toLowerCase().includes("cc") ||
              oneOrder?.shipping_lines?.method
                ?.toLowerCase()
                .includes("cod")) && (
              <div className="flex flex-col gap-2">
                <span>{tShipping("payment")}</span>
                <div className="rounded-md px-4 py-2 bg-neutral-100 dark:bg-neutral-700 flex items-center gap-2">
                  {oneOrder.shipping_lines?.method
                    .toLowerCase()
                    .includes("cc") && (
                    <>
                      <span className="text-sm">
                        {tShipping("PrepaidShipment")}
                      </span>
                      <MdCheckCircle className="text-green-800 dark:text-green-100" />
                    </>
                  )}
                  {oneOrder.shipping_lines?.method
                    .toLowerCase()
                    .includes("cod") && (
                    <span className="text-sm">
                      {tShipping("cashOnDeliveryAmount")}{" "}
                      {parseFloat(oneOrder?.total_price.toString())}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shipping;
