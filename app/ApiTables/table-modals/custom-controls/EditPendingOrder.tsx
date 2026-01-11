"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FaBuilding, FaEnvelope, FaMobileButton } from "react-icons/fa6";
import { FaGlobeAsia, FaMapMarkerAlt } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShippingAddress {
  address1?: string;
  address2?: string;
  company?: string;
  country?: string;
  country_code?: string;
  state?: string;
  state_code?: string;
  city?: string;
  zip?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

interface EditPendingOrderAction {
  method: string;
  url: string;
  payload: {
    id?: string | number;
    name?: string;
    shipping_address?: ShippingAddress;
  };
}

interface EditPendingOrderProps {
  action: EditPendingOrderAction;
  closeModal?: () => void;
}

interface RowActionsState {
  rowActionPostLoading: boolean;
}

export default function EditPendingOrder({ action }: EditPendingOrderProps) {
  const { rowActionPostLoading } = useSelector(
    (state: { rowActions: RowActionsState }) => state?.rowActions
  );
  const t = useTranslations("Orders");
  const tPending = useTranslations("Pending");
  const { rowActionsPostHandler } = useUtilsProvider();

  const shippingAddress = useMemo(
    () => action?.payload?.shipping_address || {},
    [action?.payload?.shipping_address]
  );

  // Build dynamic schema based on available fields
  const formSchema = useMemo(() => {
    const schemaFields: Record<string, z.ZodString> = {};

    if (shippingAddress.address1) {
      schemaFields.address1 = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.address2) {
      schemaFields.address2 = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.company) {
      schemaFields.company = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.country) {
      schemaFields.country = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.country_code) {
      schemaFields.country_code = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.state) {
      schemaFields.state = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.state_code) {
      schemaFields.state_code = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.city) {
      schemaFields.city = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.zip) {
      schemaFields.zip = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.email) {
      schemaFields.email = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.first_name) {
      schemaFields.first_name = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.last_name) {
      schemaFields.last_name = z.string().min(1, tPending("fieldRequired"));
    }
    if (shippingAddress.phone) {
      schemaFields.phone = z.string().min(1, "This field is required");
    }

    return z.object(schemaFields);
  }, [shippingAddress, tPending]);

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = useMemo(() => {
    const values: Record<string, string> = {};
    if (shippingAddress.address1) values.address1 = shippingAddress.address1;
    if (shippingAddress.address2) values.address2 = shippingAddress.address2;
    if (shippingAddress.company) values.company = shippingAddress.company;
    if (shippingAddress.country) values.country = shippingAddress.country;
    if (shippingAddress.country_code)
      values.country_code = shippingAddress.country_code;
    if (shippingAddress.state) values.state = shippingAddress.state;
    if (shippingAddress.state_code)
      values.state_code = shippingAddress.state_code;
    if (shippingAddress.city) values.city = shippingAddress.city;
    if (shippingAddress.zip) values.zip = shippingAddress.zip;
    if (shippingAddress.email) values.email = shippingAddress.email;
    if (shippingAddress.first_name)
      values.first_name = shippingAddress.first_name;
    if (shippingAddress.last_name) values.last_name = shippingAddress.last_name;
    if (shippingAddress.phone) values.phone = shippingAddress.phone;
    return values;
  }, [shippingAddress]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    Object.entries(defaultValues).forEach(([key, value]) => {
      form.setValue(key as keyof FormValues, value);
    });
  }, [defaultValues, form]);

  function submitCustomControlForm(data: FormValues) {
    rowActionsPostHandler(
      action?.method,
      action?.url?.replace("/api", ""),
      { id: action?.payload?.id, shipping_address: { ...data } },
      action as EditPendingOrderAction & {
        onSuccess?: string;
        isBulk?: boolean;
      }
    );
  }

  const renderField = (
    fieldName: keyof ShippingAddress,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    spanFull?: boolean
  ) => {
    if (!shippingAddress[fieldName]) return null;

    return (
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName as keyof FormValues}
        render={({ field }) => (
          <FormItem className={spanFull ? "lg:col-span-2" : ""}>
            <FormLabel>
              {label}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <div className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {icon}
                </div>
                <Input
                  type="text"
                  placeholder={placeholder}
                  className="ltr:pl-10 rtl:pr-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <>
      <DialogHeader className="pb-5">
        <DialogTitle className="text-center text-lg font-semibold">
          {t("editOrder")}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitCustomControlForm)}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {renderField(
            "address1",
            tPending("address1Label"),
            `${tPending("enter")} ${tPending("address1Label")}`,
            <FaMapMarkerAlt size={15} />
          )}

          {renderField(
            "address2",
            tPending("address2Label"),
            `${tPending("enter")} ${tPending("address2Label")}`,
            <FaMapMarkerAlt size={15} />
          )}

          {renderField(
            "company",
            tPending("companyLabel"),
            `${tPending("enter")} ${tPending("companyLabel")}`,
            <FaBuilding size={15} />
          )}

          {renderField(
            "country",
            tPending("countryLabel"),
            `${tPending("enter")} ${tPending("countryLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "country_code",
            tPending("countryCodeLabel"),
            `${tPending("enter")} ${tPending("countryCodeLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "state",
            tPending("stateLabel"),
            `${tPending("enter")} ${tPending("stateLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "state_code",
            tPending("stateCodeLabel"),
            `${tPending("enter")} ${tPending("stateCodeLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "city",
            tPending("cityLabel"),
            `${tPending("enter")} ${tPending("cityLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "zip",
            tPending("postalCodeLabel"),
            `${tPending("enter")} ${tPending("postalCodeLabel")}`,
            <FaGlobeAsia size={15} />
          )}

          {renderField(
            "email",
            tPending("emailAddressLabel"),
            `${tPending("enter")} ${tPending("emailAddressLabel")}`,
            <FaEnvelope size={15} />
          )}

          {renderField(
            "first_name",
            tPending("firstNameLabel"),
            `${tPending("enter")} ${tPending("firstNameLabel")}`,
            <RiUserFill size={15} />
          )}

          {shippingAddress.first_name &&
            renderField(
              "last_name",
              tPending("lastNameLabel"),
              `${tPending("enter")} ${tPending("lastNameLabel")}`,
              <RiUserFill size={15} />
            )}

          {renderField(
            "phone",
            tPending("phoneLabel"),
            `${tPending("enter")} ${tPending("phoneLabel")}`,
            <FaMobileButton size={15} />,
            true
          )}

          <div className="lg:col-span-2 pt-2">
            <Button
              variant="modal"
              size="md"
              className="w-full"
              type="submit"
              disabled={rowActionPostLoading}
            >
              {rowActionPostLoading ? "Loading..." : t("editOrder")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
