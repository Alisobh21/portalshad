"use client";

/**
 * This module contains the main modal components for API tables functionality
 */

import React from "react";
import Popup from "@/components/Popup";
import {
  DatalistModal,
  DatalistObjModal,
  HTMLParsedModal,
} from "./ColumnsStaticModals";
import { ConfirmationModal, ViewRowData } from "./RowActionsModals";
import { useDispatch, useSelector } from "react-redux";
import {
  _getClickedRowAction,
  _getClickedRowActionResponse,
  _getCustomControlRequest,
} from "../table-providers/slices/rowActionsSlice";
import { _getSelectedBulkAction } from "../table-providers/slices/bulkActionsSlice";
import { _setRowSelectedModal } from "../table-providers/slices/tableColumnsSlice";
import LinkProductWithHubSlot from "./custom-controls/LinkProductWithHubSlot";
import LinkSlotToProduct from "./custom-controls/LinkSlotToProduct";
import ModifyTote from "./custom-controls/ModifyTote";
import AssignOrderToPicker from "./custom-controls/AssignOrderToPicker";
import EditUser from "./custom-controls/EditUser";

/**
 * Main component for managing all modal dialogs in the API tables system
 *
 * Features:
 * - Handles row action modals for displaying data and confirmations
 * - Manages static column data display in various formats
 * - Controls custom action modals for specific table operations
 * - Integrates with Redux for state management
 * - Provides consistent modal closing behavior
 */
function ApiTablesModals() {
  const { selectedBulkAction } = useSelector(
    (state: any) => state?.bulkActions
  );
  const { rowSelectedModal } = useSelector((state: any) => state?.tableColumns);
  const { clickedRowAction, clickedRowActionResponse, customControlAction } =
    useSelector((state: any) => state?.rowActions);
  const dispatch = useDispatch();

  /**
   * Handles closing of action modals by resetting related Redux states
   */
  function handleCloseModal() {
    dispatch(_getClickedRowActionResponse(null));
    dispatch(_getSelectedBulkAction(null));
    dispatch(_getClickedRowAction(null));
    dispatch(_getCustomControlRequest(null));
  }

  /**
   * Handles closing of static data display modals
   */
  function handleCloseStaticModals() {
    dispatch(_setRowSelectedModal(null));
  }

  return (
    <>
      {/* Row Actions Modal - Displays action results */}
      <Popup
        status={clickedRowActionResponse}
        closeModal={handleCloseModal}
        isVisible={!!clickedRowActionResponse}
      >
        {clickedRowAction?.onSuccess === "DisplayOnModal" && (
          <ViewRowData data={clickedRowActionResponse} />
        )}
      </Popup>

      {/* Confirmation Modal - For row and bulk actions */}
      <Popup
        status={
          clickedRowAction?.need_confirmation ||
          selectedBulkAction?.need_confirmation
        }
        closeModal={handleCloseModal}
        containerClass="max-w-xl"
        isVisible={
          !!clickedRowAction?.need_confirmation ||
          !!selectedBulkAction?.need_confirmation
        }
      >
        <ConfirmationModal
          closeModal={handleCloseModal}
          confirmationFor={
            clickedRowAction ? "rowAction" : selectedBulkAction && "bulkAction"
          }
        />
      </Popup>

      {/* Static Columns Modal - Displays column data in various formats */}
      <Popup
        status={rowSelectedModal}
        containerClass="max-w-lg"
        closeModal={handleCloseStaticModals}
        isVisible={!!rowSelectedModal}
      >
        {Array.isArray(rowSelectedModal?.value?.value) ? (
          <DatalistModal closeModal={handleCloseStaticModals} />
        ) : rowSelectedModal?.value?.value &&
          Array.isArray(Object.keys(rowSelectedModal?.value?.value)) ? (
          <DatalistObjModal closeModal={handleCloseStaticModals} />
        ) : (
          <HTMLParsedModal />
        )}
      </Popup>

      {/* Custom Control Modal - For specific table operations */}
      <Popup
        status={customControlAction}
        closeModal={handleCloseModal}
        containerClass={`max-w-2xl`}
        isVisible={!!customControlAction}
      >
        {customControlAction?.url?.api?.includes(
          "link-product-to-available-slot"
        ) && (
          <LinkProductWithHubSlot
            action={customControlAction}
            closeModal={handleCloseModal}
          />
        )}
        {customControlAction?.url?.api?.includes(
          "link-available-slot-to-product"
        ) && (
          <LinkSlotToProduct
            action={customControlAction}
            closeModal={handleCloseModal}
          />
        )}
        {customControlAction?.url?.api?.includes("update-tote") && (
          <ModifyTote
            action={customControlAction}
            closeModal={handleCloseModal}
          />
        )}
        {customControlAction?.url?.api?.includes("assign-picker-to-order") && (
          <AssignOrderToPicker
            action={customControlAction}
            closeModal={handleCloseModal}
          />
        )}
        {customControlAction?.url?.includes("updateCustomer") && (
          <EditUser
            action={customControlAction}
            closeModal={handleCloseModal}
          />
        )}
      </Popup>
    </>
  );
}

export default ApiTablesModals;
