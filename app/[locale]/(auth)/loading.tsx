import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <>
      <section className="lg:py-5 w-full lg:p-">
        <div className={`max-w-[550px] mx-auto`}>
          <div className="w-full mb-[25px] space-y-5">
            <div className="space-y-3 mb-5">
              <Skeleton className="rounded-lg w-[70%]">
                <div className="h-5 rounded-lg" />
              </Skeleton>
              <Skeleton className="rounded-lg w-[90%]">
                <div className="h-5 rounded-lg" />
              </Skeleton>
            </div>

            <div className="space-y-2">
              <Skeleton className="rounded-lg w-[90%]">
                <div className="h-2 rounded-lg" />
              </Skeleton>
              <Skeleton className="rounded-lg w-[60%]">
                <div className="h-2 rounded-lg" />
              </Skeleton>
            </div>

            <div className="rounded-lg border-[2px] border-content3 dark:border-content2 p-1 gap-2 flex">
              <Skeleton className="rounded-lg w-[50%]">
                <div className="h-10 rounded-lg" />
              </Skeleton>
              <Skeleton className="rounded-lg w-[50%]">
                <div className="h-10 rounded-lg" />
              </Skeleton>
            </div>
          </div>

          <div className="flex flex-col gap-3 pb-3 mt-3">
            <div className="space-y-3">
              <Skeleton className="rounded-lg w-[150px]">
                <div className="h-3 rounded-lg" />
              </Skeleton>
              <Skeleton className="rounded-lg w-full">
                <div className="h-11 rounded-lg" />
              </Skeleton>
            </div>
            <div className="space-y-3">
              <Skeleton className="rounded-lg w-[150px]">
                <div className="h-3 rounded-lg" />
              </Skeleton>
              <Skeleton className="rounded-lg w-full">
                <div className="h-11 rounded-lg" />
              </Skeleton>
            </div>
            <div className="pt-3">
              <Skeleton className="rounded-lg w-full">
                <div className="h-11 rounded-lg" />
              </Skeleton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default loading;
