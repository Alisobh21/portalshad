"use client";

import type { JSX } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound(): JSX.Element {
  const t = useTranslations("NotFound");

  return (
    <div className="flex space-y-5 flex-col items-center justify-center h-screen text-center px-6">
      <div className="relative w-full">
        <Image
          src="/monster.svg"
          alt="Monster illustration"
          width={600}
          height={400}
          className="max-w-full block mx-auto w-[600px]"
          priority
        />
      </div>
      <div className="relative z-99 flex flex-col items-center justify-center space-y-2">
        <p className="text-[25px] lg:text-[30px] mt-5">{t("page_not_found")}</p>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {t("maybe_lost")}
        </p>
        <div className="w-auto">
          <Button asChild className="btn-primary">
            <Link href="/">{t("go_home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
