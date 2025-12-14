"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface LanguageSwitcherProps {
  showText?: boolean; // 👈 المتغير
  size?: "sm" | "md";
  className?: string;
}

export default function LanguageSwitcher({
  showText = false, // 👈 لو مبعوتش = مخفي
  size = "md",
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/${newLocale}${pathname.substring(3)}`;
    }
  };

  const imageSize = size === "sm" ? 18 : 22;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <Tabs value={locale} onValueChange={changeLocale} className={className}>
      <TabsList className="flex items-center gap-1 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600/50">
        {/* Arabic */}
        <TabsTrigger
          value="ar"
          className="flex items-center gap-2 px-2 py-1 rounded-md transition
                     data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700"
        >
          <Image
            src="/flag.png"
            width={imageSize}
            height={imageSize}
            alt="Arabic"
            className="rounded-sm"
          />
          {showText && (
            <span className={`${textSize} font-medium`}>العربية</span>
          )}
        </TabsTrigger>

        {/* English */}
        <TabsTrigger
          value="en"
          className="flex items-center gap-2 px-2 py-1 rounded-md transition
                     data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700"
        >
          <Image
            src="/united-states.png"
            width={imageSize}
            height={imageSize}
            alt="English"
            className="rounded-sm"
          />
          {showText && (
            <span className={`${textSize} font-medium`}>English</span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
