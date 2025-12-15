"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { ThemeSwitch } from "./ThemeSwitch";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { RiUser4Fill } from "react-icons/ri";

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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  ShoppingCart,
  PackagePlus,
  LogOut,
  User,
  Loader2,
  LucideSearch,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosPrivate from "@/axios/axios";
import { ErrorToast, SuccessToast } from "@/components/Toasts";
import LogoutBtn from "@/components/logoutBtn";
import AppLogo from "@/icons/AppLogo";
import { _toggleSidebar } from "@/store/slices/appSlice";
import { Card } from "@/components/ui/card";
import { HiMiniShoppingCart } from "react-icons/hi2";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AiFillProduct } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa6";

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

      <header className="fixed w-full px-2 pt-2 z-50 ">
        <Card className="bg-white/90 dark:bg-neutral-900/80 border-none backdrop-blur">
          <div className="flex h-4 items-center justify-between px-3">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden rounded-full bg-muted/50"
                onClick={() => dispatch(_toggleSidebar())}
              >
                <HiOutlineBars3BottomLeft size={20} />
              </Button>

              <AppLogo width="70px" height="30px" />
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              <ThemeSwitch />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="icon" className="cursor-pointer">
                    <HiMiniShoppingCart size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("createP")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="icon" className="cursor-pointer">
                    <AiFillProduct size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("add")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="icon" className="cursor-pointer">
                    <FaCartPlus size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("createO")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="icon"
                    onClick={() => setOpen(true)}
                    className="cursor-pointer"
                  >
                    <LucideSearch size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("searchIcon")}</TooltipContent>
              </Tooltip>

              <Separator
                orientation="vertical"
                className="mx-2 self-center min-h-6 min-w-[2px]"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-muted/20">
                    <Button
                      size="icon"
                      variant="icon"
                      className="rounded-full cursor-pointer"
                    >
                      <RiUser4Fill size={16} />
                    </Button>

                    <div className="text-sm font-medium">
                      {user?.maskLogin
                        ? `Mask Login - ${user?.name}`
                        : user?.name}
                      <div className="text-muted-foreground text-xs">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="w-56 mt-3 backdrop-blur-md"
                >
                  <DropdownMenuItem asChild>
                    <LanguageSwitcher showText />
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    {/* <LogOut size={16} className="mr-2" /> */}
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* MOBILE */}
            <div className="flex sm:hidden items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-muted/50"
                onClick={() => setOpen(true)}
              >
                <Search size={18} />
              </Button>

              <ThemeSwitch />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 bg-muted cursor-pointer">
                    <AvatarFallback>
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/${locale}/orders/create-order`)
                    }
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Create Order
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/${locale}/products/add-product`)
                    }
                  >
                    <PackagePlus size={16} className="mr-2" />
                    Add Product
                  </DropdownMenuItem>

                  <Separator />

                  <DropdownMenuItem className="text-red-500">
                    <LogOut size={16} className="mr-2" />
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
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
