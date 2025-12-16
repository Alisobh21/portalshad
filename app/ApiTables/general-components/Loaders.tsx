"use client";

import React from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IntegrationLoader() {
    return (
        <Card>
            <div className="absolute top-0 end-0 px-1">
                <Skeleton className="h-[25px] w-[4rem] rounded-[0.4rem]" />
            </div>

            <div className="flex flex-col items-center mt-3">
                <Skeleton className="h-[40px] w-[100px] mb-[1rem]" />
                <Skeleton className="h-[10px] w-[150px] mb-[1rem]" />
                <Skeleton className="h-[30px] w-[200px]" />
            </div>
        </Card>
    );
}

export function TableLoader({ count }: any) {
    return (
        <div className="w-full P-4 bg-neutral-100 dark:bg-neutral-700">
            <div className="mb-0 flex  flex-col gap-1 p-2">
                {Array.from({ length: count }, (_, index) => (
                    <Skeleton key={index} className="h-[50px] dark:bg-neutral-800 bg-neutral-200 w-full rounded-md" />
                ))}
            </div>
        </div>
    );
}

export function FullPageTableLoader({ count }: any) {
    return (
        <>
            <div className="w-full mb-5">
                <div className="mb-4 w-[200px]">
                    <Skeleton className="h-[40px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-2">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2 d-none d-lg-block">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2 d-none d-lg-block">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2 d-none d-lg-block">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                    <div className="space-y-2 d-none d-lg-block">
                        <Skeleton className="h-[8px] w-[50%]" />
                        <Skeleton className="h-[40px]" />
                    </div>
                </div>
            </div>

            <div className="p-2 rounded-md border border-dashed">
                <div className="w-full">
                    <div className="mb-0">
                        <Skeleton className="h-[55px]" />
                    </div>
                </div>
                <div className="w-full pt-0">
                    <div className="mb-0 py-2">
                        {Array.from({ length: count }, (_, index) => (
                            <Skeleton key={index} className="h-[50px]" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export function DashboardCardLoader() {
    return (
        <div className="w-full P-4">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-[15px] w-[15rem]" />
                <Skeleton className="h-[15px] w-[3rem]" />
            </div>
            <div className="mb-0">
                {Array.from({ length: 12 }, (_, index) => (
                    <Skeleton key={index} className="h-[30px] mb-[0.1rem]" />
                ))}
            </div>
        </div>
    );
}
