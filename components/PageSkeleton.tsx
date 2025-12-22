"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <section className="py-[10px] flex flex-col gap-4 h-full">
      {/* Top Card */}
      <Card className="p-[30px] dark:bg-default-50/80 flex-shrink-0">
        <CardContent className="relative space-y-4 z-[20]">
          <div className="flex items-center gap-[1px]">
            <Skeleton className="rounded-s-lg w-[60px] h-8" />
            <Skeleton className="rounded-e-lg w-[60px] h-8" />
          </div>
          <Skeleton className="rounded-lg w-[260px] h-7" />
        </CardContent>
      </Card>

      {/* Grid Cards */}
      <div className="flex-grow h-full grid grid-rows-1 xl:grid-rows-2 gap-4">
        {/* Hidden row for xl */}
        <div className="row hidden xl:grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <Card key={i} className="p-[30px] dark:bg-default-50/80">
              <CardContent className="w-full space-y-2">
                <Skeleton className="rounded-lg w-[60px] h-3" />
                <Skeleton className="rounded-lg w-[260px] h-5" />

                <div className="w-full py-6 space-y-3">
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[70%] h-2" />
                </div>

                <Skeleton className="rounded-lg w-[160px] h-10" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visible row */}
        <div className="row grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <Card key={i} className="p-[30px] dark:bg-default-50/80">
              <CardContent className="w-full space-y-2">
                <Skeleton className="rounded-lg w-[60px] h-3" />
                <Skeleton className="rounded-lg w-[260px] h-5" />

                <div className="w-full py-6 space-y-3">
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[90%] h-2" />
                  <Skeleton className="rounded-lg w-[70%] h-2" />
                </div>

                <Skeleton className="rounded-lg w-[160px] h-10" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
