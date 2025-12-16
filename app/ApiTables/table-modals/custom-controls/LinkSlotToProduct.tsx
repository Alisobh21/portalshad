"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { HiBackspace } from "react-icons/hi2";
import { TbPencilCheck } from "react-icons/tb";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/axios/axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSearch } from "react-icons/fi";
import { CgSpinnerTwo } from "react-icons/cg";
import { MdOutlineFlipToBack } from "react-icons/md";

interface Product {
  id: number;
  name: string;
  quantity: number;
  unlimited_quantity: boolean;
}

interface LinkSlotToProductProps {
  action: {
    method: string;
    url: {
      api: string;
    };
    payload: Record<string, unknown>;
  };
  closeModal: () => void;
}

const formSchema = z.object({
  productId: z.string().nonempty("Please choose at least one product"),
  product_quantity: z.string().nonempty("Please enter a valid quantity"),
});

export default function LinkSlotToProduct({
  action,
  closeModal,
}: LinkSlotToProductProps) {
  const { rowActionPostLoading } = useSelector(
    (state: any) => state?.rowActions
  );
  const [searchProductsLoading, setSearchProductsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [pickedProduct, setPickedProduct] = useState<Product | null>(null);
  const { rowActionsPostHandler } = useUtilsProvider();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      product_quantity: "",
    },
  });

  async function searchProducts(
    searchValue: string,
    controller: AbortController
  ) {
    setSearchProductsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/v1/product/filter",
        {
          search: searchValue,
        },
        {
          signal: controller.signal,
        }
      );
      if (response?.data?.success) {
        setProductsList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchProductsLoading(false);
    }
  }

  function onSubmit(values: { productId: string; product_quantity: string }) {
    rowActionsPostHandler(
      action?.method,
      action?.url?.api?.replace("/api", ""),
      {
        ...action?.payload,
        ...values,
        productId: Number(values?.productId),
        product_quantity: Number(values?.product_quantity),
      },
      action as any
    );
  }

  useEffect(() => {
    const controller = new AbortController();
    if (searchValue?.length > 2) {
      searchProducts(searchValue, controller);
    }
    return () => {
      controller.abort();
    };
  }, [searchValue]);

  return (
    <>
      <header className="pb-5 text-center">
        <h5 className="font-bold text-xl">Link product to available slot</h5>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Product</Label>
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full mb-0">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 w-full">
                        <Input
                          icon={<FiSearch />}
                          placeholder="Search products..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="w-full max-w-full bg-muted-foreground/5"
                        />
                      </div>
                      {searchProductsLoading ? (
                        <div className="p-2 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <CgSpinnerTwo className="animate-spin" /> Loading...
                        </div>
                      ) : productsList?.length === 0 ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          {searchValue?.length > 0
                            ? "No products found"
                            : "Start search products"}
                        </div>
                      ) : (
                        productsList?.map((item) => (
                          <SelectItem key={item?.id} value={String(item?.id)}>
                            {item?.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="product_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Choose Quantity...`}
                    onChange={field.onChange}
                    value={field.value}
                  />
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
              <TbPencilCheck className="mr-2 h-4 w-4" />
              Save Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={closeModal}
            >
              <MdOutlineFlipToBack className="mr-2 h-4 w-4" />
              Dismiss
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
