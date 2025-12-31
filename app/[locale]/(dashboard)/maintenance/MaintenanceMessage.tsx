"use client";

import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import AppLogo from "@/icons/AppLogo";
import CountDownEl from "./CountDownEl";
import { siteConfig } from "@/config/site";

/* ================= Types ================= */

interface MaintenanceMessageProps {
  heading: string;
  message: string;
  copyrights: string;
}

/* ================= Component ================= */

const MaintenanceMessage: FC<MaintenanceMessageProps> = ({
  heading,
  message,
  copyrights,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/${newLocale}${pathname.substring(3)}`;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <AppLogo height={"40px"} width={"80px"} />
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Tabs value={locale} onValueChange={changeLocale}>
            <TabsList className="flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600/50">
              <TabsTrigger
                value="ar"
                className="flex items-center gap-2 p-2 rounded-sm transition data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700"
              >
                <Image
                  src="/flag.png"
                  width={20}
                  height={20}
                  alt="Arabic"
                  className="rounded-sm"
                />
              </TabsTrigger>
              <TabsTrigger
                value="en"
                className="flex items-center gap-2 p-2 rounded-sm transition data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700"
              >
                <Image
                  src="/united-states.png"
                  width={20}
                  height={20}
                  alt="English"
                  className="rounded-sm"
                />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-5">
        <div className="w-full flex flex-col lg:flex-row gap-5 items-center">
          <div className="shrink-0">
            <Image
              src="/robot.svg"
              width={400}
              height={400}
              className="max-w-full object-fit"
              alt="Robot"
            />
          </div>

          <div className="flex flex-col gap-4 justify-center lg:justify-end items-center lg:items-end">
            <h3 className="text-3xl font-bold pt-5 text-center lg:text-start">
              {heading}
            </h3>
            <p className="text-muted-foreground text-center lg:text-start">
              {message}
            </p>
            {process.env.NEXT_PUBLIC_RETURN_TIME && <CountDownEl />}
          </div>
        </div>
      </div>

      <p className="text-center text-[13px] opacity-70">
        &copy; {new Date().getFullYear()} {siteConfig.name}. {copyrights}
      </p>
    </>
  );
};

export default MaintenanceMessage;
