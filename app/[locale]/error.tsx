"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("Error");

  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100dvh-90px)] text-center p-5 flex flex-col items-center h-full justify-center">
      <div className="relative w-full">
        <h1 className="text-[140px] xl:leading-[140px] leading-[100px] xl:text-[200px] font-light text-gray-900 dark:text-white">
          {t("error")}
        </h1>
        <p
          className="text-[140px] xl:leading-[150px] leading-[100px] absolute left-[50%] top-[100%] xl:text-[200px] font-light dark:from-[#ffffff] from[#000000] from-10% dark:via-[#000000] via-[transparent] via-30% dark:to-[#000000] to-[transparent] to-90% bg-clip-text text-transparent bg-gradient-to-t opacity-30"
          style={{
            transform: "translateX(-50%) rotateX(180deg)",
          }}
        >
          {t("error")}
        </p>
      </div>
      <p className="mt-[40px] mb-[20px] text-[27px]">{t("something_wrong")}</p>
      <Button variant="primary" onClick={reset}>
        {t("try_again")}
      </Button>
    </div>
  );
}
