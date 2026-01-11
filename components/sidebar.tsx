"use client";

import type { JSX } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBoxes,
  FaUserCog,
  FaCartArrowDown,
  FaUsersCog,
} from "react-icons/fa";
import { RiBarChartBoxAiFill, RiInboxFill } from "react-icons/ri";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { TbReceiptFilled } from "react-icons/tb";
import {
  HiReceiptRefund,
  HiDocumentText,
  HiDocumentReport,
} from "react-icons/hi";
import { MdPendingActions } from "react-icons/md";
import { GoSidebarExpand } from "react-icons/go";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLogo from "@/icons/AppLogo";
import { _expandSidebar, _toggleSidebar } from "@/store/slices/appSlice";
import type { RootState } from "@/store/store";
import { FaHouseChimneyWindow } from "react-icons/fa6";

type SidebarVariant = "desktop" | "mobile";

type SidebarLink = {
  title: string;
  key: string;
  url: string;
  icon: JSX.Element;
  children?: { title: string; key: string; url: string }[];
};

function SidebarInner({ variant }: { variant: SidebarVariant }) {
  const t = useTranslations("Sidebar");
  const tAwbs = useTranslations("shippingAWBs");
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const { expandSidebar } = useSelector((state: RootState) => state.app);

  const roles = Array.isArray(user?.roles)
    ? (user.roles as { name?: string }[])
    : [];
  const isAdmin = roles.some((role) => role?.name === "admin");
  const isMaskLogin = Boolean(
    (user as { maskLogin?: boolean } | null)?.maskLogin
  );
  const adminRoutes = useMemo(
    () => ["users", "cod-reports", "pending-orders"],
    []
  );

  const segments =
    pathname
      ?.split("/")
      ?.filter((segment) => segment !== "" && segment !== locale) ?? [];

  const activeRoute = segments.at(0);
  const activeSubRoute = segments.at(-1);

  const sidebarLinks: SidebarLink[] = useMemo(
    () => [
      {
        title: t("home"),
        key: "home",
        url: "/",
        icon: <FaHouseChimneyWindow size={20} className="dark:opacity-60" />,
      },
      {
        title: t("users"),
        key: "users",
        url: "/users",
        icon: <FaUsersCog size={20} className="dark:opacity-60" />,
      },
      {
        title: "COD Reporting Tool",
        key: "cod-reports",
        url: "/cod-reports",
        icon: <HiDocumentReport size={20} className="dark:opacity-60" />,
      },
      {
        title: t("pendingOrders"),
        key: "pending-orders",
        url: "/pending-orders",
        icon: <MdPendingActions size={20} className="dark:opacity-60" />,
      },
      {
        title: t("orders"),
        key: "orders",
        url: "/orders",
        icon: <RiBarChartBoxAiFill size={20} className="dark:opacity-60" />,
        children: [
          { title: t("orders"), key: "all", url: "/status/all" },
          {
            title: t("createOrder"),
            key: "create-order",
            url: "/create-order",
          },
        ],
      },
      {
        title: t("shipments"),
        key: "shipments",
        url: "/shipments",
        icon: <FaBoxes size={20} className="dark:opacity-60" />,
      },
      {
        title: t("products"),
        key: "products",
        url: "/products",
        icon: <RiInboxFill size={20} className="dark:opacity-60" />,
        children: [
          { title: t("products"), key: "products", url: "/" },
          { title: t("addProduct"), key: "add-product", url: "/add-product" },
        ],
      },
      {
        title: t("purchaseOrders"),
        key: "purchase-orders",
        url: "/purchase-orders",
        icon: (
          <FaCartArrowDown
            size={20}
            className="dark:opacity-60 dark:text-white"
          />
        ),
        children: [
          { title: t("purchaseOrders"), key: "all-po", url: "/status/all-po" },
          {
            title: t("createPurchaseOrder"),
            key: "create-purchase-order",
            url: "/create-purchase-order",
          },
        ],
      },
      {
        title: tAwbs("title"),
        key: "shipping-awbs",
        icon: <TbReceiptFilled size={20} className="dark:opacity-60" />,
        url: "/shipping-awbs",
        children: [
          { title: tAwbs("reportHeading"), key: "report", url: "/report" },
          { title: tAwbs("createShippingAwb"), key: "create", url: "/create" },
        ],
      },
      {
        title: t("returnAwbs"),
        key: "return-awbs",
        icon: <HiReceiptRefund size={20} className="dark:opacity-60" />,
        url: "/return-awbs/return-report",
      },
    ],
    [t, tAwbs]
  );

  const activeClass =
    "from-[#ea7831] to-[#c64813] text-white bg-gradient-to-l hover:text-white";
  const activeChildClass = "text-[#ffffff]";

  return (
    <Card className="flex dark:bg-default-50/70 px-1 py-1 w-full h-full flex-col gap-1 items-center justify-start overflow-auto">
      {variant === "mobile" && (
        <>
          <div className="py-2 px-3 justify-start flex w-full">
            <Link className="flex justify-start items-center gap-1" href="/">
              <AppLogo height={"35px"} width={"70px"} />
            </Link>
          </div>

          <Separator className="my-2 w-full" />
        </>
      )}

      <span className="text-muted-foreground me-auto ps-4 py-3 text-[13px]">
        {t("menu")}
      </span>

      {sidebarLinks
        .filter((link) => (isAdmin ? true : !adminRoutes.includes(link.key)))
        .map((link) => {
          const isRestricted =
            isAdmin && !adminRoutes.includes(link.key) ? true : false;
          if (!link.children) {
            return (
              <Link
                key={link.key}
                href={isRestricted ? "#" : link.url} // لو restricted نخلي الرابط مش شغال
                onClick={(e) => {
                  if (isRestricted) {
                    e.preventDefault(); // يمنع التنقل
                    toast.error("You are not allowed to visit this route");
                    return;
                  }
                  if (variant === "mobile") dispatch(_toggleSidebar());
                }}
                className={`flex items-center gap-2 w-full rounded-lg transition-[background] duration-300 ease-in opacity-90
                ${expandSidebar ? "flex-row px-3 py-2" : "flex-col py-2 px-1"}
                ${
                  isRestricted
                    ? "opacity-60 pointer-events-none cursor-not-allowed text-muted-foreground"
                    : ""
                }
                ${
                  (!activeRoute && link.key === "home") ||
                  activeRoute === link.key
                    ? `${activeClass}`
                    : ""
                }
              `}
              >
                {link.icon}
                <span
                  className={`${
                    expandSidebar ? "text-[14px]" : "text-center text-[12px]"
                  } ${
                    (!activeRoute && link.key === "home") ||
                    activeRoute === link.key
                      ? activeChildClass
                      : ""
                  }`}
                >
                  {link.title}
                </span>
              </Link>
            );
          }

          return (
            <DropdownMenu key={link.key}>
              <DropdownMenuTrigger
                asChild
                className="border-none focus:ring-0! focus:ring-offset-0!"
              >
                <Button
                  variant="ghost"
                  className={`w-full text-wrap px-3 h-auto ${
                    expandSidebar
                      ? "justify-start px-3 py-2"
                      : "flex-col py-2 px-1"
                  } items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-default-100 transition-[background] duration-300 ease-in opacity-90 ${
                    activeRoute === link.key ? activeClass : ""
                  } ${isRestricted ? "opacity-60 pointer-events-none" : ""}`}
                  onClick={(e) => {
                    if (isRestricted) {
                      // e.preventDefault();
                      toast.error("You don't have access to this module");
                    }
                  }}
                  disabled={isRestricted}
                >
                  <div
                    className={`flex items-center gap-2 w-full text-wrap ${
                      expandSidebar ? "flex-row" : "flex-col"
                    }`}
                  >
                    {link.icon}
                    <span
                      className={`text-nowrap ${
                        activeRoute === link.key ? activeChildClass : ""
                      } ${
                        expandSidebar
                          ? "text-[14px]"
                          : "text-center text-[12px]"
                      } pointer-events-none`}
                    >
                      {link.title}
                    </span>
                    {expandSidebar && (
                      <IoChevronForward
                        className={`ms-auto rtl:rotate-180 ${
                          activeRoute === link.key ? "text-white" : ""
                        }`}
                        size={14}
                      />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="right"
                sideOffset={12}
                className="min-w-[180px] rounded-2xl border border-neutral-200 bg-white/90 p-2 text-right shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90"
              >
                {link.children?.map((childLink) => (
                  <DropdownMenuItem
                    key={childLink.key}
                    className={`text-nowrap ${
                      activeSubRoute === childLink.key
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                    onClick={() => {
                      if (variant === "mobile") dispatch(_toggleSidebar());
                      router.push(`${link.url}/${childLink.url}`);
                    }}
                  >
                    {childLink.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
          return null;
        })}

      {isMaskLogin && (
        <>
          <Separator className="my-2" />
          <span className="text-muted-foreground me-auto ps-4 py-3 text-[13px]">
            {t("others")}
          </span>

          <Link
            href="/users"
            onClick={() => {
              if (variant === "mobile") dispatch(_toggleSidebar());
            }}
            className={`flex ${
              expandSidebar ? "flex-row px-3 py-2" : "flex-col py-2"
            } items-center gap-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-default-100 transition-[background] duration-300 ease-in opacity-90 ${
              activeRoute === "users"
                ? `${activeClass} pointer-events-none`
                : ""
            }`}
          >
            <FaUserCog size={20} className="dark:opacity-60" />
            <span
              className={`${
                expandSidebar ? "text-[14px]" : "text-center text-[12px]"
              } ${activeRoute === "users" ? activeChildClass : ""}`}
            >
              {t("allUsers")}
            </span>
          </Link>

          <Link
            href="/cod-reports"
            onClick={() => {
              if (variant === "mobile") dispatch(_toggleSidebar());
            }}
            className={`flex ${
              expandSidebar ? "flex-row px-3 py-2" : "flex-col py-2"
            } items-center gap-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-default-100 transition-[background] duration-300 ease-in ${
              activeRoute === "cod-reports"
                ? `${activeClass} pointer-events-none`
                : ""
            }`}
          >
            <HiDocumentText size={20} className="dark:opacity-60" />
            <span
              className={`${
                expandSidebar ? "text-[14px]" : "text-center text-[12px]"
              } ${activeRoute === "cod-reports" ? activeChildClass : ""}`}
            >
              COD Reporting Tool
            </span>
          </Link>

          <Link
            href="/pending-orders"
            onClick={() => {
              if (variant === "mobile") dispatch(_toggleSidebar());
            }}
            className={`flex ${
              expandSidebar ? "flex-row px-3 py-2" : "flex-col py-2"
            } items-center gap-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-default-100 transition-[background] duration-300 ease-in ${
              activeRoute === "pending-orders"
                ? `${activeClass} pointer-events-none`
                : ""
            }`}
          >
            <MdPendingActions size={20} className="dark:opacity-60" />
            <span
              className={`${
                expandSidebar ? "text-[14px]" : "text-center text-[12px]"
              } ${activeRoute === "pending-orders" ? activeChildClass : ""}`}
            >
              {t("pendingOrders")}
            </span>
          </Link>
        </>
      )}
    </Card>
  );
}

export default function Sidebar({ variant }: { variant: SidebarVariant }) {
  const { showSidebar, expandSidebar } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  return (
    <>
      {variant === "desktop" && (
        <div
          className={`p-2 transition duration-300 ease-in-out sm:flex h-[calc(100%-75px)] justify-center ${
            expandSidebar ? "w-[210px]" : "w-[110px] z-[9999]"
          } fixed top-[75px] hidden`}
        >
          <div
            className="sm:flex w-[12px] h-[30px] items-center justify-start bg-white cursor-pointer dark:bg-neutral-900/80  rounded-e-full rounded-s-none border-s-none absolute top-[50%] end-[-4px] border-e border-content3 z-99 hidden"
            onClick={() => dispatch(_expandSidebar())}
          >
            {expandSidebar ? (
              <IoChevronBack className="rtl:rotate-180 " />
            ) : (
              <IoChevronForward className="rtl:rotate-180 " />
            )}
          </div>
          <SidebarInner variant="desktop" />
        </div>
      )}

      {variant === "mobile" && showSidebar && (
        <>
          <div
            className="bg-background/10 fixed sm:hidden top-0 backdrop-blur-[30px] start-0 end-0 bottom-0 z-998 cursor-pointer"
            onClick={() => dispatch(_toggleSidebar())}
          />

          <div className="p-2 sm:hidden flex h-[calc(100%-10px)] justify-center w-[250px] fixed top-[5px] z-999 start-0">
            <div className="block sm:hidden absolute cursor-pointer dark:bg-default-50 rounded-e-full rounded-s-none border-s-none top-[15px] end-[15px] z-99">
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => dispatch(_toggleSidebar())}
              >
                <GoSidebarExpand size={18} className="rtl:rotate-180" />
              </Button>
            </div>
            <SidebarInner variant="mobile" />
          </div>
        </>
      )}
    </>
  );
}
