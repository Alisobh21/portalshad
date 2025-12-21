"use client";

import { useState, ReactElement } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import axiosPrivate from "@/axios/axios";
import { clearTargetArray } from "@/store/slices/CountrySlice";
import HeaderForm from "@/components/HeaderForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RiBarChartBoxAiFill } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";
import AddressForm from "./AddressForm";
import ShippingForm from "./ShippingForm";
import OrderProductsTable from "./OrderProductsTable";

interface OrderProduct {
  name: string;
  sku: string;
  quantity: number;
  total: number;
  warehouse_products: {
    price: string;
    warehouse_id: number;
  }[];
}

interface CreateOrderFormValues {
  order_number?: string;
  s_first_name?: string;
  s_last_name?: string;
  s_address1?: string;
  s_city?: string;
  s_country?: string;
  s_email?: string;
  s_phone?: string;
  sl_carrier?: string;
  sl_method?: string;
  sa_short_address?: string;

  products: unknown[];
  shipping: number;
  discount: number;
  vat: number;
}

export default function CreateForm(): ReactElement {
  const t = useTranslations("CreateOrder");
  const dispatch = useDispatch();
  const router = useRouter();

  const methods = useForm<CreateOrderFormValues>({
    defaultValues: {
      products: [],
      order_number: "",
      s_first_name: "",
      s_last_name: "",
      s_country: "",
      s_city: "",
      s_address1: "",
      s_email: "",
      s_phone: "",
      sa_short_address: "",
      shipping: 0,
      discount: 0,
      vat: 0,
    },
  });

  const { handleSubmit } = methods;

  const { orderProducts } = useSelector(
    (state: { orders: { orderProducts: OrderProduct[] } }) => state.orders
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [shortAddressValid, setShortAddressValid] = useState<boolean>(true);

  const getList = <T, K extends keyof T>(array: T[], key: K): T[K][] =>
    array.map((item) => item[key]);

  /* =====================
       Submit
    ===================== */

  const onSubmit: SubmitHandler<CreateOrderFormValues> = async (data) => {
    setLoading(true);

    try {
      if (orderProducts.length === 0) {
        toast.error(t("msgEnter"));
        return;
      }

      const subtotal = orderProducts.reduce((acc, item) => acc + item.total, 0);

      const total =
        subtotal +
        Number(data.shipping) -
        Number(data.discount) +
        Number(data.vat);

      const {
        order_number,
        s_first_name,
        s_last_name,
        s_address1,
        s_city,
        s_country,
        s_email,
        s_phone,
        sl_carrier,
        sl_method,
        sa_short_address,
      } = data;

      const countryData: Record<string, { code: string }> = {
        "المملكة العربية السعودية": { code: "966" },
        "الإمارات العربية المتحدة": { code: "971" },
        البحرين: { code: "973" },
        قطر: { code: "974" },
        الكويت: { code: "965" },
        عمان: { code: "968" },
        مصر: { code: "20" },
        الأردن: { code: "962" },
      };

      let phoneWithCountryCode = s_phone || "";
      const countryCode = countryData[s_country || ""]?.code;

      if (countryCode) {
        if (s_country === "مصر" && phoneWithCountryCode.startsWith("0")) {
          phoneWithCountryCode = `${countryCode}${phoneWithCountryCode.slice(
            1
          )}`;
        } else {
          phoneWithCountryCode = `${countryCode}${phoneWithCountryCode}`;
        }
      }

      const li_product_name = getList(orderProducts, "name");
      const li_sku = getList(orderProducts, "sku");
      const li_quantity = getList(orderProducts, "quantity");
      const li_price = orderProducts.map((item) =>
        parseFloat(item.warehouse_products[0].price)
      );
      const li_warehouse_id = orderProducts.map(
        (item) => item.warehouse_products[0].warehouse_id
      );

      const payload = {
        order_number,
        s_first_name,
        s_last_name,
        s_address1,
        s_address2: sa_short_address,
        s_city,
        s_country,
        s_email,
        s_phone: phoneWithCountryCode,
        sl_title: "default",
        sl_carrier,
        sl_method,
        li_product_name,
        li_sku,
        li_price,
        li_quantity,
        li_warehouse_id,
        subtotal,
        sl_price: data.shipping,
        total_discounts: data.discount,
        total_tax: data.vat,
        total_price: total,
      };

      const response = await axiosPrivate.post("/orders/store", payload);

      if (response.data.success) {
        dispatch(clearTargetArray("orderProducts"));
        router.push("/orders/status/all");
      } else {
        toast(toast.error(response?.data?.message || t("msgCreateOrderError")));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full">
      <div className="p-5 lg:p-7">
        <HeaderForm
          Icon={RiBarChartBoxAiFill}
          title={t("title")}
          desc={t("desc")}
          link="/orders/status/all"
          linkDes={t("linkDes")}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left */}
              <div className="xl:col-span-5 flex flex-col gap-2">
                <Card className="p-5">
                  <h2 className="text-lg font-semibold">
                    {t("shipping_address")}
                  </h2>
                  <AddressForm
                    shortAddressValid={shortAddressValid}
                    setShortAddressValid={setShortAddressValid}
                  />
                </Card>

                <Card className="p-5">
                  <h2 className="text-lg font-semibold pb-2">
                    {t("shipping_method")}
                  </h2>
                  <ShippingForm />
                </Card>
              </div>

              {/* Right */}
              <div className="xl:col-span-7">
                <Card className="p-5">
                  <h2 className="text-lg pb-2 font-semibold">
                    {t("products")}
                  </h2>

                  <OrderProductsTable />

                  <div className="mt-4">
                    <Button
                      type="submit"
                      disabled={loading || orderProducts.length === 0}
                      className="bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      <MdCreateNewFolder className="me-2" size={17} />
                      {loading ? t("saving_order") : t("save_order")}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
