"use client";

import type { JSX, ReactNode } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { ToastContainer, cssTransition } from "react-toastify";

import AuthFetcher from "@/components/AuthFetcher";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import MainLoader from "@/components/MainLaoder";
import FetchInitData from "@/components/FetchInitData";
import { _getAppNavigator } from "@/store/slices/appSlice";
import { _resetAwbValues } from "@/store/slices/awbsSlice";
import type { AppDispatch, RootState } from "@/store/store";

const bounce = cssTransition({
  enter: "animate__animated animate__fadeInUp",
  exit: "animate__animated animate__fadeOutUp",
});

type ConditionalLayoutProps = {
  children: ReactNode;
};

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps): JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { mainFetchingLoader, expandSidebar } = useSelector(
    (state: RootState) => state.app
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (
      !pathname?.includes("/search-addresses") &&
      !pathname?.includes("/addresses") &&
      !pathname?.includes("/shipping-awbs/create") &&
      !pathname?.includes("/return-awbs/create")
    ) {
      dispatch(_resetAwbValues());
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    const toggleSidebarOnMobile = () => {
      if (typeof window === "undefined") return;
      const ua = window.navigator.userAgent;
      const isMobile =
        /Mobi|Android|iPhone|iPad/i.test(ua) || window.outerWidth < 768;
      if (isMobile) {
        dispatch(_getAppNavigator("mobile"));
      }
    };

    toggleSidebarOnMobile();
    window.addEventListener("resize", toggleSidebarOnMobile);
    return () => window.removeEventListener("resize", toggleSidebarOnMobile);
  }, [dispatch]);

  const excludedRoutes = [
    "/login",
    "/register",
    "/reset",
    "/sawb-tracking/",
    "/maintenance",
  ];

  const inactiveRoutes = ["/inactive"];

  const toastifyProps = {
    position: "top-center" as const,
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: locale === "ar",
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored" as const,
    transition: bounce,
  };

  const routeWithoutLocale = pathname?.replace(`/${locale}`, "") || "";

  if (excludedRoutes.some((route) => routeWithoutLocale.includes(route))) {
    return (
      <>
        {children}
        <ToastContainer {...toastifyProps} />
      </>
    );
  }

  if (inactiveRoutes.some((route) => routeWithoutLocale.includes(route))) {
    return (
      <>
        <div className="relative">
          <AuthFetcher />
          <div className="absolute top-0 left-0 w-full">
            <Navbar />
          </div>
          {children}
        </div>
        {mainFetchingLoader && <MainLoader />}
        <ToastContainer {...toastifyProps} />
      </>
    );
  }

  return (
    <div className="relative">
      <AuthFetcher />
      <FetchInitData />
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <main className="relative flex h-screen overflow-visible">
        <Sidebar variant="desktop" />
        <Sidebar variant="mobile" />
        <div
          className={`pb-3 ps-2 pt-[75px] transition duration-300 ease-in-out pe-3 ${
            !expandSidebar
              ? "sm:max-w-[calc(100%-100px)] w-full"
              : "sm:max-w-[calc(100%-210px)] w-full"
          } overflow-visible ms-auto`}
        >
          {children}
        </div>
      </main>
      {mainFetchingLoader && <MainLoader />}
      <ToastContainer {...toastifyProps} />
    </div>
  );
}
