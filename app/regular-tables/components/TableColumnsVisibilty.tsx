"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { RiEyeCloseFill } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import useTableUtils from "../hooks/useTableUtils";
import type { RootState } from "../provider/store";

type TableColumn = {
  name: string;
  omit?: boolean;
};

const TableColumnsVisibility: React.FC = () => {
  const t = useTranslations("General");
  const { handleVisibleColumns } = useTableUtils();

  const columns = useSelector(
    (state: RootState) => state.regularTablesSlice.columns
  ) as TableColumn[] | undefined;

  if (!columns?.length) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="normal"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <RiEyeCloseFill size={18} />
          {t("columns")}
          <FiChevronDown size={16} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-3">
        <div className="flex flex-col gap-2">
          {columns.map((col, index) => (
            <label
              key={index}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={!col.omit}
                onCheckedChange={(checked) =>
                  handleVisibleColumns(col.name, Boolean(checked))
                }
              />
              <span>{col.name}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableColumnsVisibility;
