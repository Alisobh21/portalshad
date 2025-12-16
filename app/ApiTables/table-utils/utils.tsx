/**
 * Utility functions for table operations and data manipulation
 */

import React from "react";
import {
  BarcodeCell,
  BooleanCell,
  DataListCell,
  HTMLCell,
  LinkCell,
  TextCell,
} from "../general-components/ColumnCellTypes";
import TableRowActions from "../core/TableRowActions";
import lsSecure from "@/helpers/Secure";
import { toast } from "sonner";

/**
 * Copies text to clipboard and shows optional toast notification
 * @param value - Text to copy
 * @param noToast - Whether to suppress toast notification
 * @param msg - Custom toast message
 */
export const copyToClipboard = (
  value: string,
  noToast?: boolean,
  msg?: string
): void => {
  navigator.clipboard
    .writeText(value)
    .then(function () {
      console.log("");
    })
    .catch(function (err) {
      console.error("Failed to copy text: ", err);
    });
  if (!noToast) {
    toast.success(msg || "تم النسخ");
  }
};

/**
 * Truncates string from start if longer than specified length
 * @param fullStr - String to truncate
 * @param strLen - Maximum length before truncation
 * @param separator - Truncation indicator (default "...")
 */
export function truncateStart(
  fullStr: string,
  strLen: number,
  separator?: string
): string {
  if (fullStr?.length <= strLen) return fullStr;
  separator = separator || "...";
  let charsToShow = strLen,
    frontChars = Math.ceil(charsToShow);
  return fullStr?.substr(0, frontChars) + separator;
}

/**
 * Updates objects in large array with matching objects from small array based on ID
 * @param largeArr - Array to update
 * @param smallArr - Array containing update objects
 */
export function replaceObjects(largeArr: any[], smallArr: any[]): void {
  if (largeArr && smallArr) {
    return smallArr.forEach((smallObj: any) => {
      const index = largeArr?.findIndex(
        (largeObj: any) => largeObj?.id === smallObj?.id
      );
      if (index !== -1) {
        largeArr[index] = { ...largeArr[index], ...smallObj };
      }
    });
  }
}

/**
 * Toggles column visibility and updates localStorage
 * @param value - Visibility state
 * @param name - Column name
 * @param visibleCols - Currently visible columns
 * @param LSKey - localStorage key
 * @param callback - Function to call with updated columns
 */
export function toggleColumnVisibility(
  value: boolean,
  name: string,
  visibleCols: string[],
  LSKey: string,
  callback: (cols: string[]) => void
): void {
  let columns = [...visibleCols];
  if (value === true) {
    columns = [...visibleCols, name];
  } else {
    columns = columns.filter((col) => col !== name);
  }
  callback(columns);
  lsSecure.set(LSKey, JSON.stringify(columns));
}

/**
 * Formats date as DD/MM/YYYY
 * @param timestamp - Date timestamp
 */
export function formatDateNoTime(timestamp: string | number): string {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Converts object values to array
 * @param obj - Source object
 */
export function objectToArrayValue<T>(obj: Record<string, T>): T[] {
  return obj ? Object.keys(obj).map((key) => obj[key]) : [];
}

/**
 * Converts object keys to array
 * @param obj - Source object
 */
export function objectToArrayKey(obj: Record<string, any>): string[] {
  return obj ? Object.keys(obj).map((key) => key) : [];
}

/**
 * Converts object to array of key-value pairs
 * @param obj - Source object
 */
export function objectToArrayKeyVal(
  obj: Record<string, any>
): Array<{ key: any; value: string }> {
  return obj
    ? Object.keys(obj).map((key) => ({
        key: obj[key],
        value: key,
      }))
    : [];
}

/**
 * Downloads file from URL
 * @param url - File URL
 * @param name - Download filename
 */
export function downloadURL(url: string, name: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}`;
  document.body.appendChild(link);
  link.setAttribute("target", "_blank");
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

interface ActionObject {
  action_key: string;
  [key: string]: any;
}

/**
 * Gets intersection of row actions across multiple objects
 * @param arrayOfObjects - Array of objects containing actions
 */
export function getIntersectedRowActions(
  arrayOfObjects: Record<string, ActionObject>[]
): Record<string, ActionObject> {
  if (arrayOfObjects.length === 0) return {};

  // Initialize the result object with the keys from the first object
  const result: Record<string, ActionObject> = {};

  // Iterate over each key in the first object
  for (const key in arrayOfObjects[0]) {
    const actionKey = arrayOfObjects[0][key].action_key;

    // Check if this action_key exists in every object in the array
    const isCommon = arrayOfObjects.every(
      (obj) => obj[key] && obj[key].action_key === actionKey
    );

    // If it exists in all objects, add it to the result
    if (isCommon) {
      result[key] = arrayOfObjects[0][key];
    }
  }

  return result;
}

/**
 * Validates phone number starts with 5
 * @param number - Phone number to validate
 */
export function validatePhoneNumber(number: string): string | undefined {
  if (Number(number[0]) !== 5) {
    return "رقم الجوال يجب أن يبدأ بالرقم 5";
  }
}

/**
 * Prevents typing beyond character limit in input fields
 * @param chars - Maximum characters allowed
 */
export function preventTyping(chars: number): void {
  const inputEls = document.querySelectorAll(".limited-chars");

  function limitChars(event: Event, inputEl: HTMLInputElement): void {
    const inputValue = inputEl.value.trim();
    const labelEl = inputEl.nextElementSibling
      ?.nextElementSibling as HTMLElement;

    if (event instanceof KeyboardEvent) {
      let key = event.keyCode;
      if (key === 32) {
        event.preventDefault();
      }
    }

    if (!/^\d*$/.test(inputValue)) {
      // If the input contains non-digit characters, remove them
      inputEl.value = inputValue.replace(/\D/g, "");
    }

    if (inputValue.length === chars) {
      labelEl.classList.add("d-block");
    }

    if (inputValue.length >= chars) {
      event.preventDefault();
    } else if (inputValue.length === chars) {
      labelEl.classList.add("d-block");
    } else {
      labelEl.classList.remove("d-block");
    }
  }

  inputEls.forEach(function (inputEl) {
    const typedInputEl = inputEl as HTMLInputElement;
    typedInputEl.addEventListener("input", function (event) {
      limitChars(event, typedInputEl);
    });
    typedInputEl.addEventListener("keypress", function (event) {
      limitChars(event, typedInputEl);
    });
    typedInputEl.addEventListener("paste", function (event) {
      limitChars(event, typedInputEl);
    });
    typedInputEl.addEventListener("keyup", function (event) {
      limitChars(event, typedInputEl);
    });
  });
}

interface InputObject {
  value: string;
  operator?: string;
  [key: string]: any;
}

/**
 * Transforms object by merging operator fields into base fields
 * @param input - Object to transform
 */
export function transformObject(
  input: Record<string, InputObject>
): Record<string, InputObject> {
  const result: Record<string, InputObject> = { ...input };

  // Iterate over the keys in the input object
  Object.keys(input).forEach((key) => {
    if (key.endsWith("_operator")) {
      // Extract the base key without '_operator'
      const baseKey = key.replace("_operator", "");

      // Check if the base key exists in the result object
      if (result[baseKey]) {
        // Add the operator value to the base key object
        result[baseKey].operator = input[key].value;

        // Optionally, remove the '_operator' key if no longer needed
        delete result[key];
      }
    }
  });

  return result;
}

/**
 * Filters out operator keys from object
 * @param input - Object to filter
 */
export function filterOutOperatorKeys(
  input: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  // Iterate over the keys in the input object
  Object.keys(input).forEach((key) => {
    // Exclude keys that contain '_operator'
    if (!key.includes("_operator")) {
      result[key] = input[key];
    }
  });

  return result;
}

interface Filter {
  filter_name: string;
  label: string;
  type: string;
  props?: {
    select_options?: Record<string, string>;
    operators?: string[];
  };
}

interface FilterValue {
  fieldValue: string;
  operator?: string;
}

/**
 * Restructures selected filters into standardized format
 * @param data - Filter data
 * @param dirtyFields - Modified fields
 * @param structureFilters - Filter structure definitions
 */
export function restructureSelectedFilters(
  data: Record<string, FilterValue | string>,
  dirtyFields: Record<string, any>,
  structureFilters: Filter[]
): Array<{
  key: string;
  value: string;
  label?: string;
  type?: string;
  valueLable?: string;
  operator?: string;
  props?: any;
}> {
  const submittedData = objectToArrayKey(dirtyFields);
  const filteredObject = Object.fromEntries(
    Object.entries(data)?.filter(([key, value]) => {
      if (typeof value === "string") {
        const typedValue = value as string;
        return (
          submittedData?.includes(key) &&
          typedValue?.trim() !== "" &&
          typedValue
        );
      }
      const typedValue = value as FilterValue;
      return (
        submittedData?.includes(key) &&
        typedValue?.fieldValue !== "" &&
        typedValue?.fieldValue
      );
    })
  );

  const renderedFilters = Object.keys(filteredObject)?.map((key) => {
    const targetFilter = structureFilters?.find(
      (filter) => filter?.filter_name === key
    );
    const value =
      typeof filteredObject[key] === "string"
        ? (filteredObject[key] as string)
        : (filteredObject[key] as FilterValue).fieldValue;

    return {
      key: key,
      value: value,
      label: targetFilter?.label,
      type: targetFilter?.type,
      valueLable: targetFilter?.props?.select_options
        ? targetFilter?.props?.select_options[value]
        : value,
      operator:
        targetFilter?.type === "date"
          ? targetFilter?.props?.operators?.[0]
          : (filteredObject[key] as FilterValue)?.operator,
      props: targetFilter?.props,
    };
  });

  return renderedFilters;
}

/**
 * Gets human readable label for operator
 * @param operator - Operator symbol
 */
export function getOperatorLabel(operator: string): string {
  if (operator === "=") {
    return "Exact Match";
  }
  if (operator === "like") {
    return "Like";
  }
  if (operator === ">=") {
    return "Equal Or Greater";
  }
  if (operator === "<=") {
    return "Less Or EQual";
  }
  return "";
}

/**
 * Handles cases where no column action element exists
 * @param action - Action type
 */
export function handleNoColumnActionElement(
  action: string
): React.ReactElement | string {
  if (action === "bank_account") {
    return <span className="badge bg-secondary">Not Available</span>;
  }
  return "-";
}

/**
 * Calculates minimum width for table column
 * @param content - Cell content
 * @param title - Column title
 * @param type - Column type
 */
export const calculateMinWidth = (
  content: string,
  title: string,
  type: string
): string => {
  const charWidth = 8;
  const padding = 34;
  const headPadding = 60;
  const cellContent = content?.length * charWidth + padding;
  const headContent = title?.length * charWidth + headPadding;
  return type === "link" ? "200px" : `${Math.max(cellContent, headContent)}px`;
};

/**
 * Finds row with longest value in specified field
 * @param data - Table data
 * @param field - Field to check
 */
export const rowWithLongestField = (data: any[], field: string): string => {
  return data?.reduce((longest: string, current: any) => {
    return current[field]?.length > longest?.length ? current[field] : longest;
  }, "");
};

/**
 * Calculates minimum column width based on content and title
 * @param content - Cell content
 * @param title - Column title
 */
export const calculateColMinWidth = (
  content: string,
  title: string
): string => {
  const charWidth = 8;
  const padding = 34;
  const headPadding = 60;
  const cellContent = content?.length * charWidth + padding;
  const headContent = title?.length * charWidth + headPadding;

  return Math.max(cellContent, headContent) <= 500
    ? `${Math.max(cellContent, headContent) + 20}px`
    : "500px";
};

/**
 * Finds table row with longest value in specified field
 * @param data - Table data
 * @param field - Field to check
 */
export const tableRowWithLongestField = (
  data: any[],
  field: string
): string => {
  return data?.reduce((longest: string, current: any) => {
    return current[field]?.length > longest?.length ? current[field] : longest;
  }, "");
};

interface Column {
  label: string;
  sortable: boolean;
  showable: boolean;
  data_src: string;
  type: string;
}

interface Row {
  id: string | number;
  actions?: Record<string, any>;
  [key: string]: any;
}

/**
 * Formats table columns with cell rendering and width calculations
 * @param cols - Column definitions
 * @param tbData - Table data
 */
export function formatTableColumns(
  cols: Column[],
  tbData: Row[]
): Array<{
  name: string;
  sortable: boolean;
  colIdentifier: string;
  data_src: string;
  type: string;
  minWidth: string;
  selector: (row: Row) => any;
  cell: (row: Row) => React.ReactElement;
}> {
  return cols
    ?.filter((col) => col?.showable)
    ?.map((col) => {
      return {
        name: col?.label,
        sortable: col?.sortable,
        colIdentifier: col?.data_src,
        data_src: col?.data_src,
        type: col?.type,
        minWidth:
          col?.type !== "link" && col?.type !== "barcode"
            ? calculateColMinWidth(
                tableRowWithLongestField(tbData, col?.data_src),
                col?.label
              )
            : "250px",
        selector: (row: Row) => row[col?.data_src],
        cell: (row: Row) => {
          return (
            <div
              data-row={JSON.stringify(row)}
              className="text-sm tabel-col-cell w-full"
            >
              {row[col?.data_src] === null ? (
                <p className="mb-0">-</p>
              ) : (
                row[col?.data_src] !== null && (
                  <>
                    {col?.type === "text" ? (
                      <TextCell col={col} row={row} />
                    ) : col?.type === "text_truncate" ? (
                      <p className="mb-0 text-wrap">
                        {truncateStart(row[col?.data_src], 20, "...")}
                      </p>
                    ) : col?.type === "link" ? (
                      <LinkCell col={col} row={row} />
                    ) : col?.type === "boolean" ? (
                      <BooleanCell col={col} row={row} />
                    ) : col?.type === "html" ? (
                      <HTMLCell col={col} row={row} />
                    ) : col?.type === "datalist" || col?.type === "dataList" ? (
                      <DataListCell col={col} row={row} />
                    ) : col?.type === "barcode" ? (
                      <BarcodeCell col={col} row={row} />
                    ) : (
                      col?.type === "actions" &&
                      row?.actions &&
                      Object.keys(row?.actions)?.length > 0 && (
                        <TableRowActions row={row} col={col} />
                      )
                    )}
                  </>
                )
              )}
            </div>
          );
        },
      };
    });
}
