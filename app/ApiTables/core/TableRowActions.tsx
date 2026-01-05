"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import {
  CopyTextRowActionElement,
  ExternalRedirectRowActionElement,
  GeneralRowActionElement,
  RedirectRowActionElement,
  ToggleRowActionElement,
} from "../general-components/RowActionsElements";
import {
  getIntersectedRowActions,
  objectToArrayValue,
} from "../table-utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { _getSelectedRowActions } from "../table-providers/slices/rowActionsSlice";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import UserMaskLogin from "./custom-row-actions/UserMaskLogin";

function TableRowActions({ row, col }: { row: any; col: any }) {
  const { selectedRows } = useSelector((state: any) => state?.tableColumns);
  const { actionsInRegularCells } = useSelector(
    (state: any) => state?.rowActions
  );
  const dispatch = useDispatch();

  const rowActions = useMemo(() => {
    if (actionsInRegularCells) {
      const filteredColActions = row?.actions[col?.name];
      return objectToArrayValue(filteredColActions);
    } else {
      return objectToArrayValue(row?.actions);
    }
  }, [row, actionsInRegularCells, col]);

  useEffect(() => {
    if (selectedRows?.length > 0) {
      dispatch(
        _getSelectedRowActions(
          objectToArrayValue(
            getIntersectedRowActions(
              selectedRows?.map((row: any) => row?.actions)
            )
          )
        )
      );
    } else {
      dispatch(_getSelectedRowActions([]));
    }
  }, [selectedRows]);

  return (
    <>
      {rowActions?.filter((action) => action)?.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <PiDotsThreeOutlineVerticalBold className="!w-3 !h-3" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="inline-flex min-w-[160px] p-2">
            <div className="flex flex-col gap-2 w-full">
              {rowActions
                ?.filter((action) => action)
                ?.map((action: any) => (
                  <div key={action?.action_key} className="w-full">
                    {action?.action_type === "toggle" ? (
                      <ToggleRowActionElement action={action} />
                    ) : action?.action_type === "redirect" ? (
                      <RedirectRowActionElement action={action} />
                    ) : action?.action_type === "external_redirect" ? (
                      <ExternalRedirectRowActionElement action={action} />
                    ) : action?.action_type === "copy" ? (
                      <CopyTextRowActionElement action={action} />
                    ) : action?.action_type === "mask_login" ? (
                      <UserMaskLogin action={action} />
                    ) : (
                      <GeneralRowActionElement action={action} />
                    )}
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <span className="badge bg-secondary">غير مفعل</span>
      )}
    </>
  );
}

export default TableRowActions;
