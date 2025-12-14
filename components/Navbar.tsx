"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Search,
  ShoppingCart,
  PackagePlus,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosPrivate from "@/axios/axios";
import { ErrorToast, SuccessToast } from "@/components/Toasts";
import LogoutBtn from "@/components/logoutBtn";
import AppLogo from "@/icons/AppLogo";
import { _toggleSidebar } from "@/store/slices/appSlice";

interface RootState {
  auth: {
    user: {
      name?: string;
      email?: string;
      maskLogin?: boolean;
    };
  };
}

interface SearchForm {
  order_number: string;
}

export default function Navbar() {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchForm>();

  const changeLocale = (lng: string) => {
    window.location.href = `/${lng}${pathname.substring(3)}`;
  };

  const searchWithOrderNo = async (data: SearchForm) => {
    setLoading(true);
    try {
      const res = await axiosPrivate(
        `/orders/order-id-by-order-number/${data.order_number}`
      );

      const orderId = res?.data?.orders?.data?.edges?.[0]?.node?.id;

      if (orderId) {
        toast(<SuccessToast msg={t("orderdirect")} />);
        router.push(`/${locale}/orders/show/${orderId}`);
        setOpen(false);
        reset();
      } else {
        toast(<ErrorToast msg={t("ordernotfound")} />);
      }
    } catch {
      toast(<ErrorToast msg="Something went wrong" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur border-b">
        <div className="container flex h-14 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => dispatch(_toggleSidebar())}
            >
              <Menu size={20} />
            </Button>

            <AppLogo width="70px" height="30px" />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
              <Search size={18} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => router.push(`/${locale}/orders/create-order`)}
            >
              <ShoppingCart size={18} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => router.push(`/${locale}/products/add-product`)}
            >
              <PackagePlus size={18} />
            </Button>

            {/* USER MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium">
                    {user?.maskLogin
                      ? `Mask Login - ${user?.name}`
                      : user?.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user?.email}
                  </div>
                </div>

                <Separator />

                <Tabs
                  defaultValue={locale}
                  onValueChange={changeLocale}
                  className="px-2 py-2"
                >
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Separator />

                <DropdownMenuItem className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  <LogoutBtn />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("searchIcon")}</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(searchWithOrderNo)}
            className="flex gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder={t("searchPlaceholder")}
                {...register("order_number", {
                  required: t("message"),
                })}
              />
              {errors.order_number && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.order_number.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
