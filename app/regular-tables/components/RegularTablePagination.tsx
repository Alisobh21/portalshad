"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { TbChevronRight, TbChevronLeft } from "react-icons/tb";

/* ShadCN */
import { Button } from "@/components/ui/button";

interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor?: string | null;
}

interface RegularTablePaginationProps {
  pagination?: PaginationInfo | null;
  manageCursor: (cursor: string | null) => void;
}

const RegularTablePagination: React.FC<RegularTablePaginationProps> = ({
  pagination,
  manageCursor,
}) => {
  const t = useTranslations("General");
  const router = useRouter();
  const pagePathname = usePathname();

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  let hrefWithCursor = "";
  if (typeof window !== "undefined" && pagination?.hasNextPage) {
    const currentSearchParams = new URLSearchParams(window.location.search);
    if (pagination.endCursor) {
      currentSearchParams.set("cursor", pagination.endCursor);
    }
    hrefWithCursor = `${pagePathname}?${currentSearchParams.toString()}`;
  }

  if (!pagination) return null;

  return (
    <ul className="flex gap-2 mb-0 p-0">
      {/* Previous */}
      <li>
        <Button
          variant="outline"
          disabled={!pagination.hasPreviousPage}
          onClick={goBack}
          className="flex items-center gap-2"
        >
          <TbChevronLeft className="rtl:rotate-180" size={17} />
          {t("previous")}
        </Button>
      </li>

      {/* Next */}
      <li>
        <Button
          asChild
          variant="outline"
          disabled={!pagination.hasNextPage}
          className="flex items-center gap-2"
          onClick={() =>
            manageCursor(
              pagination.hasNextPage ? pagination.endCursor ?? null : null
            )
          }
        >
          <Link href={hrefWithCursor || "#"}>
            {t("next")}
            <TbChevronRight className="rtl:rotate-180" size={17} />
          </Link>
        </Button>
      </li>
    </ul>
  );
};

export default RegularTablePagination;
