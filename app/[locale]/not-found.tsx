"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";

export default function NotFoundPage(): JSX.Element {
  const t = useTranslations("NotFound");

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5 px-6 text-center">
      <div className="relative w-full">
        <Image
          src="/monster.svg"
          alt="Monster"
          width={600}
          height={400}
          className="mx-auto max-w-full"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-2">
        <p className="mt-5 text-[25px] lg:text-[30px]">{t("page_not_found")}</p>

        <p className="text-lg text-muted-foreground">{t("maybe_lost")}</p>

        <Button asChild>
          <Link href="/">{t("go_home")}</Link>
        </Button>
      </div>
    </div>
  );
}
