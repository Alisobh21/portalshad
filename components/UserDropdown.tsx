"use client";

import type { JSX } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FiSettings } from "react-icons/fi";
import { RiUser4Fill } from "react-icons/ri";

import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LogoutBtn from "./logoutBtn";
import type { RootState } from "@/store/store";

export default function UserDropdown(): JSX.Element {
  const { user } = useSelector((state: RootState) => state.auth);
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();

  const displayName =
    typeof user?.name === "string" && user.name.trim().length > 0
      ? user.name
      : "...";
  const displayEmail =
    typeof user?.email === "string" && user.email.trim().length > 0
      ? user.email
      : "...";

  const changeLocale = (lng: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/${lng}${pathname.substring(3)}`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2">
          <Avatar className="size-8">
            <AvatarFallback>
              <RiUser4Fill size={17} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ms-2">
            <span className="text-sm font-medium leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              {displayEmail}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 space-y-3">
        <div className="px-1 pt-2">
          <Tabs value={locale} onValueChange={changeLocale}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="ar" className="flex items-center gap-2">
                <Image src="/flag.png" width={20} height={20} alt="Arabic" />
                العربية
              </TabsTrigger>
              <TabsTrigger value="en" className="flex items-center gap-2">
                <Image
                  src="/united-states.png"
                  width={20}
                  height={20}
                  alt="English"
                />
                English
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator />

        <div className="flex flex-col gap-1 px-1 pb-2">
          <Link
            href="#"
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted"
          >
            <FiSettings />
            <span className="text-sm">{t("settings")}</span>
          </Link>

          <LogoutBtn />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
