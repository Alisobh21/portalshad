"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AppLogo from "@/icons/AppLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

        <LanguageSwitcher />
      </div>
    </div>
  );
}
