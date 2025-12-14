"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-5 text-center">
      <div className="relative w-full">
        <h1 className="text-[140px] font-light leading-[100px] text-gray-900 xl:text-[200px] xl:leading-[140px] dark:text-white">
          Error
        </h1>

        <p
          className="absolute left-1/2 top-full bg-gradient-to-t from-black/10 via-transparent to-transparent bg-clip-text text-[140px] font-light leading-[100px] text-transparent opacity-30 xl:text-[200px] xl:leading-[150px] dark:from-white/10"
          style={{
            transform: "translateX(-50%) rotateX(180deg)",
          }}
        >
          Error
        </p>
      </div>

      <p className="mb-[20px] mt-[40px] text-[27px]">Something went wrong.</p>

      <Button onClick={reset} className="btn-primary">
        Try again
      </Button>
    </div>
  );
}
