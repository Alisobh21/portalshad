"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axiosPrivate from "@/axios/axios";
import { Controller } from "react-hook-form";

/* UI */
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

/* Icons */
import { BsFillBoxSeamFill } from "react-icons/bs";
import { MdClose, MdCreateNewFolder } from "react-icons/md";

/* Components */
import HeaderForm from "@/components/HeaderForm";
import { ErrorToast } from "@/components/Toasts";

/* ---------------- Types ---------------- */

interface Warehouse {
  identifier: string;
  name: string;
}

interface RootState {
  app: {
    warehouses: boolean;
    warehousesList: Warehouse[];
    loadingWarehousesList: boolean;
  };
}

interface ProductFormValues {
  productName: string;
  sku: string;
  price: number;
  barcode?: string;
  warehouse: string;
}

/* ---------------- Component ---------------- */

export default function ProductForm() {
  const t = useTranslations("CreateProduct");
  const tGeneral = useTranslations("General");
  const router = useRouter();

  const { warehouses, warehousesList } = useSelector(
    (state: RootState) => state.app
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<ProductFormValues>();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  /* ---------------- Image Handlers ---------------- */

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    const validFiles: File[] = [];
    const oversizedFiles: string[] = [];

    Array.from(files).forEach((file) => {
      // منع التكرار حسب الاسم والحجم
      const isDuplicate = selectedImages.some(
        (img) => img.name === file.name && img.size === file.size
      );
      if (isDuplicate) return;

      if (file.size > maxSize) {
        oversizedFiles.push(file.name);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (oversizedFiles.length) {
      toast.error(
        `${tGeneral("imageTooLarge")}: ${oversizedFiles.join(" | ")}`
      );
    }

    if (validFiles.length) {
      setSelectedImages((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Submit ---------------- */

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("product_name", data.productName);
      formData.append("sku", data.sku);
      formData.append("price", String(data.price));
      formData.append("weight", "1");
      formData.append("on_hand", "0");
      formData.append("warehouse_id", data.warehouse);
      formData.append("barcode", data.barcode || "");

      selectedImages.forEach((file) => {
        formData.append("images[]", file);
      });

      const res = await axiosPrivate.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(t("successMsg"));
        router.push("/products");
      } else {
        toast(<ErrorToast msg={t("errorMsg")} />);
      }
    } catch (error) {
      console.error(error);
      toast(<ErrorToast msg={t("errorMsg")} />);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="w-full p-5 lg:p-7">
      <HeaderForm
        Icon={BsFillBoxSeamFill}
        title={t("title")}
        desc={t("desc")}
        link="/products"
        linkDes={t("backToProducts")}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-9"
      >
        {/* Product Name */}
        <div className="md:col-span-2 relative">
          {watch("productName") && (
            <Label className="absolute -top-5 font-light">
              {t("productName")}
            </Label>
          )}
          <Input
            placeholder={t("productName")}
            className="w-full"
            {...register("productName", {
              required: t("requiredProductName"),
              minLength: { value: 2, message: t("minLengthProductName") },
              maxLength: { value: 50, message: t("maxLengthProductName") },
              pattern: {
                value: /^[\p{L}\d\s'-]+$/u,
                message: t("patternProductName"),
              },
            })}
          />
          {errors.productName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.productName.message}
            </p>
          )}
        </div>

        {/* SKU */}
        <div className="relative">
          {watch("sku") && (
            <Label className="absolute -top-5 font-light">{t("sku")}</Label>
          )}
          <Input
            placeholder={t("sku")}
            {...register("sku", {
              required: t("requiredSku"),
              minLength: { value: 3, message: t("minLengthSku") },
              maxLength: { value: 20, message: t("maxLengthSku") },
              pattern: { value: /^[^\s]+$/, message: t("patternSku") },
            })}
          />
          {errors.sku && (
            <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="relative">
          {watch("price") !== undefined && !isNaN(watch("price")) && (
            <Label className="absolute -top-5 font-light">{t("price")}</Label>
          )}
          <Input
            type="number"
            placeholder={t("price")}
            {...register("price", {
              required: t("requiredPrice"),
              valueAsNumber: true,
              min: { value: 0, message: t("minPrice") },
              max: { value: 1000000, message: t("maxPrice") },
              validate: (value) => !isNaN(value) || t("invalidPrice"),
            })}
          />
          {errors.price && (
            <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Barcode */}
        <div className="relative">
          {watch("barcode") && (
            <Label className="absolute -top-5 font-light">{t("barcode")}</Label>
          )}
          <Input placeholder={t("autoBarcode")} {...register("barcode")} />
        </div>

        {/* Warehouse */}
        <div className="relative">
          <Controller
            name="warehouse"
            control={control}
            rules={{ required: t("requiredWarehouse") }}
            render={({ field }) => (
              <>
                {field.value && (
                  <Label className="absolute -top-5 font-light">
                    {t("warehouse")}
                  </Label>
                )}
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("warehouse")} />
                  </SelectTrigger>
                  <SelectContent>
                    {warehousesList.map((w) => (
                      <SelectItem key={w.identifier} value={w.identifier}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          />
          {errors.warehouse && (
            <p className="text-sm text-red-600 mt-1">
              {errors.warehouse.message}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label
            className="flex cursor-pointer justify-center rounded-md border border-dashed border-gray-300  px-3 py-6 text-sm transition hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-blue-600");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-blue-600");
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files);
              e.currentTarget.classList.remove("border-blue-600");
            }}
          >
            <span className="flex items-center space-x-2 gap-2">
              <svg className="h-6 w-6 stroke-gray-400" viewBox="0 0 256 256">
                <path
                  d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                />
                <path
                  d="M80,128a80,80,0,1,1,144,48"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                />
                <polyline
                  points="118.1 161.9 152 128 185.9 161.9"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                />
                <line
                  x1="152"
                  y1="208"
                  x2="152"
                  y2="128"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                />
              </svg>
              <span className="text-xs font-medium ">
                {t("images")} —{" "}
                <span className=" underline text-primary-400">
                  {tGeneral("browse")}
                </span>{" "}
                {tGeneral("drop")}
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="h-full flex flex-col gap-2">
                  <div
                    className="relative group !bg-cover !bg-center h-full aspect-[2/1] w-full"
                    style={{ background: `url(${preview})` }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                  <p className="rounded-lg bg-content2 py-1 px-3 text-center text-xs truncate">
                    {selectedImages[index]?.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <Button type="submit" disabled={!warehouses} className="btn-dark">
            <MdCreateNewFolder className="me-2" />
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
