"use client";
import { formatDashedName } from "@/helpers/utils";
import { useRouter } from "@/i18n/navigation";
import { _getCurrentPage } from "@/store/slices/appSlice";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocale } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadCrumbProps {
  currentPage: string;
}
export default function BreadCrumb({ currentPage }: BreadCrumbProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const pathSegments = pathWithoutLocale.split("/").filter(Boolean);
  const dispatch = useDispatch();
  const router = useRouter();

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    dispatch(_getCurrentPage(currentPage));
  }, [currentPage, dispatch]);

  return (
    <Breadcrumb>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const pathTo = `/${pathSegments.slice(0, index + 1).join("/")}`;

        return (
          <BreadcrumbItem key={segment}>
            {isLast ? (
              <BreadcrumbPage className="inline-flex items-center rounded-sm border bg-muted  px-2 py-1 text-sm text-foreground cursor-not-allowed">
                {formatDashedName(formatSegment(segment))}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href={pathTo}
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(pathTo);
                }}
              >
                {formatDashedName(formatSegment(segment))}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
