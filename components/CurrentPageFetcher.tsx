"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { usePathname } from "@/i18n/navigation";
import { _getCurrentPage } from "@/store/slices/appSlice";
import type { AppDispatch } from "@/store/store";

interface CurrentPageFetcherProps {
  page: string | null;
}

export default function CurrentPageFetcher({
  page,
}: CurrentPageFetcherProps): null {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(_getCurrentPage(page));
  }, [dispatch, page, pathname]);

  return null;
}
