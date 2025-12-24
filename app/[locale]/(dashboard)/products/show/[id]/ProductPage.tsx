"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import axiosPrivate from "@/axios/axios";
import {
  _addinventoryOneProduct,
  _addOneProduct,
} from "@/store/slices/productsSlice";

import ProductDetails from "./ProductDetails";
// import { Inventory } from "./Inventory";
// import ImageCard from "./ImageCard";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ImageCard from "./ImageCard";

/* ================= TYPES ================= */

interface Params {
  id: string;
}

interface Product {
  id: number;
  images?: string[] | null;
}

interface RootState {
  products: {
    oneProduct: Product | null;
    inventoryOneProduct: any;
  };
}

interface Props {
  params: Params;
}

/* ================= COMPONENT ================= */

const ProductPage: React.FC<Props> = ({ params }) => {
  const t = useTranslations("General");

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { oneProduct } = useSelector((state: RootState) => state.products);

  /* ================= FETCH ================= */
  //   UHJvZHVjdEluZm86MzA5MTQ1MTI3
  // UHJvZHVjdEluZm86MzA5MTQ1MTI3-V2FyZWhvdXNlOjE0ODA1
  const fetchProduct = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/products/${encodeURIComponent(params?.id)}`
      );

      if (response?.data?.success) {
        dispatch(_addOneProduct(response?.data?.data?.product));
        dispatch(
          _addinventoryOneProduct(response?.data?.data?.inventoryChanges)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

  /* ================= UI ================= */

  if (loading) {
    return (
      <Card className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("loadingDetails")}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Product Details */}
      <div className="flex lg:flex-col md:flex-col sm:flex-row">
        <ProductDetails fetchProduct={fetchProduct} id={params.id} />
      </div>

      {/* Inventory + Images */}
      <div className="w-full flex flex-col gap-4 mt-4">
        {/* <Inventory /> */}

        {oneProduct?.images && (
          <Card>
            <ImageCard />
          </Card>
        )}
      </div>
    </>
  );
};

export default ProductPage;
