"use client";

import { ReactNode } from "react";
import { useSelector } from "react-redux";
import BreadCrumb from "./Breadcrumb";
import type { RootState } from "@/store/store";

interface CurrentPage {
  title: string;
  subtitle?: string;
  subheading?: string;
  customContent?: ReactNode;
}

interface PageHeaderProps {
  hideBreadcrumb?: boolean;
}

export default function PageHeader({ hideBreadcrumb }: PageHeaderProps) {
  const currentPage = useSelector(
    (state: RootState) =>
      state.app.currentPage as CurrentPage | string | null | undefined
  );

  if (!currentPage) return null;

  const title =
    typeof currentPage === "string" ? currentPage : currentPage.title ?? "";
  const subtitle =
    typeof currentPage === "string" ? undefined : currentPage.subtitle;
  const subheading =
    typeof currentPage === "string" ? undefined : currentPage.subheading;
  const customContent =
    typeof currentPage === "string" ? undefined : currentPage.customContent;

  return (
    <div className="max-h-4 flex flex-col gap-2 justify-center">
      <div>{!hideBreadcrumb && <BreadCrumb currentPage={title} />}</div>

      {subtitle && <p className="font-bold">{subtitle}</p>}

      <h1 className="font-bold">{title}</h1>

      {subheading && <p className="text-muted">{subheading}</p>}

      {customContent && customContent}
    </div>
  );
}
