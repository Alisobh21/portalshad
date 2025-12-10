"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AppLogo from "@/icons/AppLogo";

export default function AuthHeader() {
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/${newLocale}${pathname.substring(3)}`;
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <AppLogo height={"50px"} width={"90px"} />

      <div className="flex items-center gap-3">
        <ThemeSwitch />

        <Tabs value={locale} onValueChange={changeLocale}>
          <TabsList
            className="
             flex items-center gap-2 px-2 py-1 h-full
              rounded-md  bg-neutral-200 dark:bg-neutral-800
               border border-neutral-300  dark:border-neutral-600/50
            "
          >
            <TabsTrigger
              value="ar"
              className="
                data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700 border-none data-[state=active]:border-none
                rounded-md px-2 py-1 transition w-full
              "
            >
              <Image
                src="/flag.png"
                width={22}
                height={22}
                alt="Arabic"
                className="rounded-sm"
              />
            </TabsTrigger>

            <TabsTrigger
              value="en"
              className="
                data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700
                rounded-md px-2 py-1 transition data-[state=active]:border-none
              "
            >
              <Image
                src="/united-states.png"
                width={22}
                height={22}
                alt="English"
                className="rounded-sm"
              />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
