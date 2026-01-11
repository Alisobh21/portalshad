"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslations } from "next-intl";
import axiosPrivate from "@/axios/axios";
import { toast } from "react-toastify";

/* shadcn */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* icons */
import { BsFillBoxSeamFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { MdClose, MdCreateNewFolder } from "react-icons/md";

/* components */
import { Label } from "@radix-ui/react-label";

/* ---------------- Types ---------------- */

interface Dimensions {
  weight?: string;
  height?: string;
  width?: string;
  length?: string;
}

interface WarehouseProduct {
  warehouse_id: string;
  price: number;
  on_hand: number;
  backorder: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  active: boolean;
  dimensions?: Dimensions;
  warehouse_products: WarehouseProduct[];
}

interface RootState {
  products: {
    oneProduct: Product | null;
  };
  app: {
    warehouses: {
      id: string;
      identifier: string;
    }[];
  };
}

interface FormValues {
  name: string;
  price: number;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}

interface Props {
  fetchProduct: () => Promise<void>;
  id: string;
}

/* ---------------- Component ---------------- */

const ProductDetails: React.FC<Props> = ({ fetchProduct, id }) => {
  const { oneProduct } = useSelector((state: RootState) => state.products);
  const { warehouses } = useSelector((state: RootState) => state.app);

  const t = useTranslations("AllProducts");
  const tGeneral = useTranslations("General");

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  /* ---------------- Images ---------------- */
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const maxSize = 1 * 1024 * 1024;
    const oversized: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        oversized.push(file.name);
        return;
      }

      setSelectedImages((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });

    if (oversized.length) {
      toast.error(`${tGeneral("imageTooLarge")}: ${oversized.join(" | ")}`);
    }
  };
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Sync existing data ---------------- */

  useEffect(() => {
    if (!oneProduct?.dimensions) return;
    if (!oneProduct?.dimensions?.weight) {
      setValue("weight", Number(oneProduct?.dimensions?.weight));
    }
    if (!oneProduct?.dimensions?.height) {
      setValue("height", Number(oneProduct?.dimensions?.height));
    }
    if (!oneProduct?.dimensions?.width) {
      setValue("width", Number(oneProduct?.dimensions?.width));
    }
    if (!oneProduct?.dimensions?.length) {
      setValue("length", Number(oneProduct?.dimensions?.length));
    }
  }, [oneProduct, setValue]);

  /* ---------------- Submit ---------------- */

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!oneProduct) return;

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", String(data.price));
      formData.append("weight", String(data.weight ?? ""));
      formData.append("height", String(data.height ?? ""));
      formData.append("width", String(data.width ?? ""));
      formData.append("length", String(data.length ?? ""));

      formData.append("sku", oneProduct?.sku);
      formData.append(
        "warehouse_id",
        oneProduct.warehouse_products[0]?.warehouse_id
      );
      formData.append("barcode", oneProduct.barcode ?? "");
      formData.append("product_id", id);
      formData.append("barcode", oneProduct?.barcode ?? "");

      selectedImages.forEach((file) => formData.append("images[]", file));

      const res = await axiosPrivate.post("/products/update", formData);

      if (res?.data?.success) {
        fetchProduct();
        setEditMode(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Render ---------------- */

  if (!oneProduct) return null;

  return (
    <Card className="w-full relative">
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 lg:p-7">
        {/* Header */}
        <header className="mb-8 flex justify-between">
          <div className="flex items-center gap-2">
            <BsFillBoxSeamFill size={22} />
            <h1 className="text-2xl font-semibold">{t("details")}</h1>
          </div>

          {editMode ? (
            <Button
              variant="normal"
              className="absolute top-[4px] end-[4px]"
              size="icon"
              type="button"
              onClick={() => setEditMode(false)}
            >
              <IoClose />
            </Button>
          ) : (
            <Button
              variant="normal"
              size="icon"
              className="absolute top-[4px] end-[4px]"
              type="button"
              onClick={() => setEditMode(true)}
            >
              <BiEditAlt />
            </Button>
          )}
        </header>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-sm">
            {!editMode && (
              <div className="flex gap-2">
                <b>{t("active")}:</b>{" "}
                <span>
                  {oneProduct?.active ? tGeneral("yes") : tGeneral("no")}
                </span>
              </div>
            )}

            {/* Name */}
            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("name")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    defaultValue={oneProduct?.name}
                    {...register("name", {
                      required: t("nameRequired"),
                      minLength: {
                        value: 2,
                        message: t("nameMin"),
                      },
                      maxLength: {
                        value: 50,
                        message: t("nameMax"),
                      },
                      pattern: {
                        value: /^[\p{L}\d\s'-]+$/u,
                        message: t("namePattern"),
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.name
              )}
            </div>

            {!editMode && (
              <div className="flex gap-2">
                <span className="font-semibold">{t("storageCode")} : </span>
                <span className=" ">{oneProduct?.sku}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("price")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    type="number"
                    defaultValue={oneProduct.warehouse_products[0]?.price}
                    {...register("price", {
                      required: t("priceRequired"),
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: t("priceMin"),
                      },
                      validate: (value) => !isNaN(value) || t("numberValid"),
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs">
                      {errors.price.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.warehouse_products?.at(0)?.price
              )}
            </div>

            {!editMode && (
              <div className="flex gap-2">
                <span className="font-semibold">{t("barcode")}: </span>
                <span className=" ">{oneProduct?.barcode}</span>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("weight")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    type="number"
                    defaultValue={oneProduct?.dimensions?.weight}
                    {...register("weight", {
                      // required: t('weightRequired'),
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: t("weightMin"),
                      },
                      max: {
                        value: 50,
                        message: t("weightMax"),
                      },
                      validate: (value) => !isNaN(value) || t("numberValid"),
                    })}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-xs">
                      {errors.weight.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.dimensions?.weight
              )}
            </div>

            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("height")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    type="number"
                    defaultValue={oneProduct?.dimensions?.height}
                    {...register("height", {
                      // required: t('heightRequired'),
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: t("heightMin"),
                      },
                      //   max: {
                      //     value: 50,
                      //     message: t("heightMax"),
                      //   },
                      validate: (value) => !isNaN(value) || t("numberValid"),
                    })}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-xs">
                      {errors.height.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.dimensions?.height
              )}
            </div>

            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("width")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    type="number"
                    defaultValue={oneProduct?.dimensions?.width}
                    {...register("width", {
                      // required: t('widthRequired'),
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: t("widthMin"),
                      },
                      //   max: {
                      //     value: 50,
                      //     message: t("widthMax"),
                      //   },
                      validate: (value) => !isNaN(value) || t("numberValid"),
                    })}
                  />
                  {errors.width && (
                    <p className="text-red-500 text-xs">
                      {errors.width.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.dimensions?.width
              )}
            </div>

            <div className="flex gap-2 items-center">
              <span
                className={`font-semibold whitespace-nowrap ${
                  editMode ? "min-w-[122px]" : ""
                }`}
              >
                {t("length")} :
              </span>
              {editMode ? (
                <>
                  <Input
                    type="number"
                    defaultValue={oneProduct?.dimensions?.length}
                    {...register("length", {
                      // required: t('lengthRequired'),
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: t("lengthMin"),
                      },
                      //   max: {
                      //     value: 50,
                      //     message: t("lengthMax"),
                      //   },
                      validate: (value) => !isNaN(value) || t("numberValid"),
                    })}
                  />
                  {errors.length && (
                    <p className="text-red-500 text-xs">
                      {errors.length.message}
                    </p>
                  )}
                </>
              ) : (
                oneProduct?.dimensions?.length
              )}
            </div>
          </div>

          {!editMode && (
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full m-auto mx-6">
                {oneProduct?.warehouse_products?.map((warehouse, index) => {
                  const warehouse_name = warehouses?.find(
                    (w) => w?.id === warehouse?.warehouse_id
                  )?.identifier;
                  return (
                    <div
                      className="flex gap-3 text-sm flex-col rounded-xl p-4 lg:p-5 bg-neutral-100/50 dark:bg-neutral-700/40"
                      key={index}
                    >
                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {t("warehouse")} :{" "}
                        </span>
                        <span className=" ">
                          {warehouse_name
                            ? warehouse_name
                            : warehouse?.warehouse_id}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {" "}
                          {t("availableToOrder")} :{" "}
                        </span>
                        <span className=" ">
                          {warehouse?.on_hand > 0
                            ? tGeneral("yes")
                            : tGeneral("no")}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {t("totalQuantity")} :{" "}
                        </span>
                        <span className=" ">{warehouse.on_hand}</span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {t("requiredQuantity")} :{" "}
                        </span>
                        <span className=" ">{warehouse.backorder}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Images */}
          {editMode && (
            <div className="lg:col-span-9">
              <label className="flex justify-center cursor-pointer border border-dashed rounded-md p-6">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                {t("images")}
              </label>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="relative">
                      <div
                        className="aspect-[2/1] bg-cover bg-center rounded"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        {editMode && (
          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              <MdCreateNewFolder className="me-2" />
              {loading ? t("updating") : t("update")}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default ProductDetails;
