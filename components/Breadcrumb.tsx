"use client";

import { Fragment, useEffect, type ReactElement } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";

import { formatDashedName } from "@/helpers/utils";
import { useRouter } from "@/i18n/navigation";
import { _getCurrentPage } from "@/store/slices/appSlice";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ChevronLeft } from "lucide-react";

/* =======================
   Props
======================= */

interface BreadCrumbProps {
  currentPage?: string;
}

/* =======================
   Component
======================= */

export default function BreadCrumb({
  currentPage,
}: BreadCrumbProps): ReactElement {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const pathSegments = pathWithoutLocale.split("/").filter(Boolean);

  const formatSegment = (segment: string): string =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Don't dispatch currentPage here as it will overwrite the object structure
  // The CurrentPageFetcher component handles setting the page state

  return (
    <Breadcrumb
      className="
        inline-flex rounded-sm bg-neutral-100 px-3 py-1 text-sm
        text-foreground shadow-sm ring-1 ring-neutral-200
        dark:bg-gray-100/10 dark:ring-transparent
      "
    >
      <BreadcrumbList className="flex items-center gap-1">
        {pathSegments.map((segment, index) => {
          const isFirst = index === 0;
          const isLast = index === pathSegments.length - 1;
          const pathTo = `/${pathSegments.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={pathTo}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="cursor-default">
                    {formatDashedName(formatSegment(segment))}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={pathTo}
                    className={
                      isFirst
                        ? "cursor-not-allowed text-foreground"
                        : "text-foreground"
                    }
                    onClick={(e) => {
                      e.preventDefault();

                      if (!isFirst && !isLast) {
                        router.push(pathTo);
                      }
                    }}
                  >
                    {formatDashedName(formatSegment(segment))}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronLeft className="h-3 w-3 dark:text-white" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
