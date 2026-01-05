"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa6";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditUserAction {
  method: string;
  url: string;
  payload: {
    name?: string;
    segment?: string;
    ecommerce_platform?: string;
    segment_options?: Record<string, string>;
    ecommerce_platform_options?: Record<string, string>;
  };
}

interface EditUserProps {
  action: EditUserAction;
  closeModal?: () => void;
}

interface RowActionsState {
  rowActionPostLoading: boolean;
}

export default function EditUser({ action }: EditUserProps) {
  const t = useTranslations("editeUser");
  const { rowActionPostLoading } = useSelector(
    (state: { rowActions: RowActionsState }) => state?.rowActions
  );
  const { rowActionsPostHandler } = useUtilsProvider();

  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t("userNameMessage")),
          segment: z.string().min(1, t("segmentMessage")),
          ecommerce_platform: z.string().min(1, t("ecommercePlatformMessage")),
          other_platform: z.string().optional(),
        })
        .refine(
          (data) => {
            if (data.ecommerce_platform?.toLowerCase() === "other") {
              return data.other_platform && data.other_platform.length > 0;
            }
            return true;
          },
          {
            message: t("otherEcommercePlatformMessage"),
            path: ["other_platform"],
          }
        ),
    [t]
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: action?.payload?.name || "",
      segment: action?.payload?.segment || "",
      ecommerce_platform: action?.payload?.ecommerce_platform || "",
      other_platform: "",
    },
  });

  const { watch, setValue } = form;
  const ecommercePlatform = watch("ecommerce_platform");

  useEffect(() => {
    if (action?.payload?.name) {
      setValue("name", action?.payload?.name);
    }
    if (action?.payload?.segment) {
      setValue("segment", action?.payload?.segment);
    }
    if (action?.payload?.ecommerce_platform) {
      setValue("ecommerce_platform", action?.payload?.ecommerce_platform);
    }
  }, [action?.payload, setValue]);

  function submitCustomControlForm(data: FormValues) {
    rowActionsPostHandler(
      action?.method,
      action?.url?.replace("/api", ""),
      {
        ...action?.payload,
        ...data,
        ecommerce_platform:
          data?.ecommerce_platform?.toLowerCase() === "other"
            ? data?.other_platform
            : data?.ecommerce_platform,
      },
      action as EditUserAction & { onSuccess?: string; isBulk?: boolean }
    );
  }

  return (
    <>
      <header className="pb-5 text-center">
        <h5>{t("updateUserInfo")}</h5>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitCustomControlForm)}
          noValidate
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("userNameLabel")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaUser
                      className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder={t("userNamePlaceholder")}
                      className="ltr:pl-10 rtl:pr-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("segmentLabel")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaUser
                      className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground"
                      size={18}
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full ltr:pl-10 rtl:pr-10">
                        <SelectValue placeholder={t("segmentPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(
                          action?.payload?.segment_options || {}
                        ).map((key) => (
                          <SelectItem key={key} value={key}>
                            {action?.payload?.segment_options?.[key]}
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
            name="ecommerce_platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("ecommercePlatformLabel")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaUser
                      className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground"
                      size={18}
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full ltr:pl-10 rtl:pr-10">
                        <SelectValue
                          placeholder={t("ecommercePlatformPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(
                          action?.payload?.ecommerce_platform_options || {}
                        ).map((key) => (
                          <SelectItem key={key} value={key}>
                            {action?.payload?.ecommerce_platform_options?.[key]}
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

          {(ecommercePlatform?.toLowerCase() === "other" ||
            ecommercePlatform === "Other") && (
            <FormField
              control={form.control}
              name="other_platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("otherEcommercePlatformLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FaUser
                        className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        type="text"
                        placeholder={t("otherEcommercePlatformPlaceholder")}
                        className="ltr:pl-10 rtl:pr-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            variant="modal"
            size="md"
            className="w-full!"
            type="submit"
            disabled={rowActionPostLoading}
          >
            {rowActionPostLoading ? "Loading..." : t("updateUserInfo")}
          </Button>
        </form>
      </Form>
    </>
  );
}
