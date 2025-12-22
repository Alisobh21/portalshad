"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { _setFilterText } from "../provider/slices/mainSlice";

import type { RootState } from "../provider/store";

const RegularTablesSearch: React.FC = () => {
  const dispatch = useDispatch();
  const t = useTranslations("General");

  const filterText = useSelector(
    (state: RootState) => state.regularTablesSlice.filterText
  );

  return (
    <div className="relative w-full sm:w-auto">
      <FiSearch
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        type="text"
        value={filterText}
        onChange={(e) => dispatch(_setFilterText(e.target.value))}
        placeholder={t("searchPlaceholder")}
        className="pl-10"
      />
    </div>
  );
};

export default RegularTablesSearch;
