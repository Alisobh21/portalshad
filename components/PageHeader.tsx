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
    <div className="flex flex-col gap-2 justify-center">
      <div>{!hideBreadcrumb && <BreadCrumb currentPage={title} />}</div>

      <h1 className="font-black">{title}</h1>
      {subtitle && <p className="">{subtitle}</p>}
      {subheading && (
        <p className="text-gray-500 dark:text-gray-400">{subheading}</p>
      )}
      {customContent && customContent}
    </div>
  );
}
