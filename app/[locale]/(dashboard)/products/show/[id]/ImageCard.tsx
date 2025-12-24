"use client";

import React from "react";
import Image from "next/image"; // استخدام ShadCN يعتمد على Next/Image
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState } from "@/store/store";
interface ImageCardProps {
  params?: any;
}

interface ProductImage {
  src: string;
}

interface Product {
  images?: ProductImage[];
}

const ImageCard: React.FC<ImageCardProps> = () => {
  const { oneProduct } = useSelector((state: RootState) => state.products) as {
    oneProduct: Product;
  };
  console.log(oneProduct?.images);
  const t = useTranslations("AllProducts");

  return (
    <div className="flex gap-4 w-full px-4">
      <div className="p-6 lg:p-10 w-full">
        <header className="mb-8 flex justify-between">
          <div className="flex items-center mb-1 gap-2">
            <MdOutlinePhotoSizeSelectActual size={25} />
            <h1 className="text-2xl font-semibold">{t("images")}</h1>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
          {oneProduct?.images?.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-40 rounded shadow overflow-hidden"
            >
              <Image
                src={img.src}
                alt={`${img.src} image`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
