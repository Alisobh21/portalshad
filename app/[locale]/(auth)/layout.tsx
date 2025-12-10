import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/card";
import AuthHeader from "./AuthHeader";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `Login | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const t = await getTranslations("Login");
  const locale = await getLocale();

  return (
    <>
      <div className="h-screen w-full relative items-stretch grid grid-cols-1 xl:grid-cols-2 p-2 gap-3">
        {/* Left panel */}
        <div className="h-full flex p-3 lg:p-5 rounded-[30px] bg-neutral-500/10 gap-5 flex-col dark:bg-neutral-800/70 items-center justify-between relative">
          <AuthHeader />
          {children}
          <p className="text-center text-[13px] opacity-70">
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {t("copyright")}
          </p>
        </div>

        {/* Right panel */}
        <div
          className="rounded-lg xl:rounded-[30px] p-5 bg-cover bg-center h-full items-end justify-center relative overflow-hidden hidden xl:flex"
          style={{
            backgroundImage: `url('/login_bg_1.png')`,
          }}
        >
          {/* Meteor background elements */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className={`meteor-${i + 1}`}></div>
          ))}

          <Card className="px-[30px] py-[50px] text-white text-center backdrop-blur-[20px] bg-dark/30 border-none">
            <div className="max-w-2xl mx-auto space-y-3">
              {locale === "en" ? (
                <h1 className="font-normal ">{t("welcomeCard")}</h1>
              ) : (
                <h1 className="font-bold ">{t("welcomeCard")}</h1>
              )}
              <p>{t("poweredBy")}</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
