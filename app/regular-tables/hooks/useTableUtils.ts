"use client";

import { useDispatch, useSelector } from "react-redux";
import { _setTableColumns } from "../provider/slices/mainSlice";
import type { RootState, AppDispatch } from "../provider/store";

interface UseTableUtilsReturn {
  handleVisibleColumns: (col: string, checked: boolean) => void;
}

export default function useTableUtils(): UseTableUtilsReturn {
  const dispatch = useDispatch<AppDispatch>();
  const { columns } = useSelector(
    (state: RootState) => state.regularTablesSlice
  );

  function handleVisibleColumns(col: string, checked: boolean): void {
    if (checked) {
      dispatch(
        _setTableColumns(
          columns?.map((column) => {
            if (column?.name === col) {
              return { ...column, omit: false };
            }
            return column;
          })
        )
      );
    } else {
      dispatch(
        _setTableColumns(
          columns?.map((column) =>
            column?.name === col ? { ...column, omit: true } : column
          )
        )
      );
    }
  }

  return { handleVisibleColumns };
}
