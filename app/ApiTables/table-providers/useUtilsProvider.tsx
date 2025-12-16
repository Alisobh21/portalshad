"use client";

import { useDispatch, useSelector } from "react-redux";
import { _getTableData, _triggerTableReload } from "./slices/tableCoreSlice";
import {
  _bulkActionPostLoading,
  _bulkActionPostResponse,
  _getSelectedBulkAction,
} from "./slices/bulkActionsSlice";
import { axiosTable } from "@/axios/axios";
import {
  handleNetworkErrors,
  handleResponseErrors,
} from "../table-utils/errorHandling";
import { _setMainLoader } from "@/store/slices/appSlice";
import {
  _getClickedRowAction,
  _getClickedRowActionId,
  _getClickedRowActionResponse,
  _getCustomControlRequest,
  _setRowActionPostLoading,
} from "./slices/rowActionsSlice";
import {
  _setSelectedRows,
  _setToggledClearRow,
} from "./slices/tableColumnsSlice";
import { downloadURL } from "../table-utils/utils";
import { downloadBlob, downloadPDF } from "@/helpers/utils";
import { store } from "@/store/store";

interface RootState {
  tableCore: {
    tableData: any[];
  };
  tableColumns: {
    toggledClearRows: boolean;
  };
}

interface Action {
  onSuccess?: string;
  onBulkSuccess?: string;
  isBulk?: boolean;
  action_key?: string;
}

interface LoaderInfo {
  msg?: string;
  icon?: string | null;
}

interface ResponseData {
  data?: {
    row?: any;
    url?: string;
    filename?: string;
  };
  items?: any[];
  message?: string;
}

export default function useUtilsProvider() {
  const dispatch = useDispatch();
  const { tableData } = useSelector((state: RootState) => state.tableCore);
  const { toggledClearRows } = useSelector(
    (state: RootState) => state.tableColumns
  );

  function triggerTableReload(): void {
    dispatch(_triggerTableReload());
  }

  function handleBulkActionReponse(
    action: Action,
    response?: ResponseData
  ): void {
    if (action?.onSuccess === "deleteRow" || action.onSuccess === "reload") {
      triggerTableReload();
      dispatch(_getSelectedBulkAction(null));
    }
  }

  async function bulkActionsPostHandler(
    method: string,
    url: string,
    payload: any,
    loaderInfo: LoaderInfo,
    action: Action
  ): Promise<void> {
    dispatch(_bulkActionPostLoading(true));
    loaderInfo &&
      store.dispatch(
        _setMainLoader({
          status: true,
          msg: loaderInfo?.msg,
          icon: loaderInfo?.icon,
        })
      );

    console.log("_action", action);

    try {
      const response = await axiosTable({
        method,
        url,
        data: { ...payload },
        ...(action?.action_key === "export-excel-blob" && {
          responseType: "blob",
        }),
      });

      if (action?.action_key === "export-excel-blob") {
        downloadBlob(response?.data);
        dispatch(_getSelectedBulkAction(null));
      } else {
        handleResponseErrors(
          response,
          response?.data?.message,
          function () {
            dispatch(_bulkActionPostResponse(response?.data));
            handleBulkActionReponse(action, response);
          },
          undefined
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(_bulkActionPostLoading(false));
      dispatch(_getSelectedBulkAction(null));
      loaderInfo &&
        store.dispatch(_setMainLoader({ status: false, msg: "", icon: null }));
    }
  }

  function resetClickedRowAction(): void {
    dispatch(_getClickedRowAction(null));
    dispatch(_getClickedRowActionResponse(null));
    dispatch(_getCustomControlRequest(null));
    dispatch(_setToggledClearRow(!toggledClearRows));
    dispatch(_setSelectedRows([]));
  }

  function handleCommonCases(type: string, response: ResponseData): void {
    if (type === "deleteRow" || type === "reload") {
      triggerTableReload();
      resetClickedRowAction();
    } else if (type === "refetchData") {
      dispatch(
        _getTableData(
          tableData?.map((item) => {
            const matchingItem = response?.items?.find(
              ({ id }: { id: string }) => id === item?.id
            );
            return matchingItem ? matchingItem : item;
          })
        )
      );
      resetClickedRowAction();
    } else if (type === "refetchRow") {
      dispatch(
        _getTableData(
          tableData?.map((item) => {
            if (item?.id !== response?.data?.row?.id) {
              return item;
            } else {
              return response?.data?.row;
            }
          })
        )
      );

      resetClickedRowAction();
    } else if (type === "downloadData") {
      downloadURL(response?.data?.url ?? "", response?.data?.filename ?? "");
      resetClickedRowAction();
    } else if (type === "download_pdf") {
      downloadPDF(response?.data?.url ?? "", response?.data?.filename ?? "");
      resetClickedRowAction();
    }
  }

  function handleRowActionRepsonse(
    action: Action,
    response: ResponseData
  ): void {
    if (action?.isBulk) {
      handleCommonCases(action?.onBulkSuccess || "", response);
    } else {
      handleCommonCases(action?.onSuccess || "", response);
    }
  }

  async function rowActionsPostHandler(
    method: string,
    url: string,
    payload: any,
    action: Action,
    customHeader?: Record<string, string>
  ): Promise<void> {
    dispatch(_setRowActionPostLoading(true));
    dispatch(_getClickedRowAction(action));

    try {
      const response = await axiosTable({
        method,
        url,
        data: { ...payload },
        ...(customHeader && {
          headers: { ...customHeader },
        }),
        ...((action?.action_key === "export-excel-blob" ||
          action?.action_key === "export_failed_excel") && {
          responseType: "blob",
        }),
      });

      if (
        action?.action_key === "export-excel-blob" ||
        action?.action_key === "export_failed_excel"
      ) {
        downloadBlob(response?.data);
        resetClickedRowAction();
      } else {
        handleResponseErrors(
          response,
          response?.data?.message,
          function () {
            if (action?.onSuccess !== "OpenModalForm") {
              dispatch(_getClickedRowActionResponse(response?.data));
            } else if (action?.onSuccess === "OpenModalForm") {
              dispatch(_getCustomControlRequest(response?.data));
              dispatch(_getCustomControlRequest(response?.data));
            }
            handleRowActionRepsonse(action, response?.data);
          },
          undefined
        );
      }
    } catch (err) {
      console.log(err);
      resetClickedRowAction();
      handleNetworkErrors(err as any);
    } finally {
      dispatch(_setRowActionPostLoading(false));
      dispatch(_getClickedRowActionId(null));
    }
  }

  return {
    triggerTableReload,
    bulkActionsPostHandler,
    rowActionsPostHandler,
    resetClickedRowAction,
  };
}
