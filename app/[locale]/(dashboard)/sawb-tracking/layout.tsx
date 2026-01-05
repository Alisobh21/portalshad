import { siteConfig } from "@/config/site";
import AppLogo from "@/icons/AppLogo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `Tracking | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

interface TrackingPageLayoutProps {
  children: ReactNode;
}

export default async function TrackingPageLayout({
  children,
}: TrackingPageLayoutProps) {
  const t = await getTranslations("Login");

  return (
    <>
      <div className="grid grid-cols-1 h-screen xl:grid-cols-2">
        <div className="h-full p-5 lg:p-7 flex flex-col justify-between gap-4 overflow-y-auto">
          <div className="flex justify-between items-center gap-2">
            <AppLogo height="45px" width="90px" />
          </div>

          <div className="w-full py-5">{children}</div>

          <p className="text-[13px] opacity-70 pt-10">
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {t("copyright")}
          </p>
        </div>
        <div className="h-screen hidden xl:block bg-center bg-cover bg-[url('/tracking.png')]"></div>
      </div>
    </>
  );
}
