// Type for a generic object with any properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

/**
 * Flattens nested object data
 * @param data - Array of objects to flatten
 * @returns Array of flattened objects
 */
export const flattenData = (data: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(data)) return [];
  return data.map((item: any) => {
    const flattenedItem: Record<string, unknown> = {};
    const flatten = (obj: any, parentKey = "") => {
      for (let key in obj) {
        const propName = parentKey
          ? `${parentKey}.${key}`.split(".").at(-1)
          : key;
        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          parentKey !== "shipments"
        ) {
          flatten(obj[key], propName);
        } else {
          flattenedItem[propName] = obj[key];
        }
      }
    };
    flatten(item);
    return flattenedItem;
  });
};

/**
 * Formats a timestamp to DD/MM/YYYY format
 * @param timestamp - Date timestamp (string, number, or Date)
 * @returns Formatted date string
 */
export function formatDateNoTime(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Maps order status to Arabic string
 * @param status - Order status code
 * @returns Arabic status string
 */
export function mapStatusToString(status: string): string | undefined {
  if (status === "canceled") {
    return "تم إلغائه";
  } else if (status === "fulfilled") {
    return "تم تحضيره";
  } else if (status === "outstanding") {
    return "معلّق";
    // return 'قيد المعالجة'
  } else if (status === "inPreparation") {
    return "قيد التحضير";
  } else if (status === "pending") {
    return "معلّق";
  } else if (status === "orders") {
    return "جميع الطلبات";
  }
  return undefined;
}

/**
 * Calculates minimum width for a table column based on content and title
 * @param content - Cell content string
 * @param title - Column title string
 * @returns Minimum width in pixels as string
 */
export const calculateMinWidth = (
  content: string | undefined,
  title: string | undefined
): string => {
  const charWidth = 8;
  const padding = 34;
  const headPadding = 60;
  const cellContent = (content?.length || 0) * charWidth + padding;
  const headContent = (title?.length || 0) * charWidth + headPadding;
  return `${Math.max(cellContent, headContent) + 30}px`;
};

/**
 * Finds the row with the longest value for a given field
 * @param data - Array of data objects
 * @param field - Field name to check
 * @returns The longest value for the field
 */
export const rowWithLongestField = (
  data: AnyObject[] | undefined,
  field: string
): string => {
  return (
    data?.reduce((longest: string, current: AnyObject) => {
      return (current[field]?.length || 0) > (longest?.length || 0)
        ? current[field]
        : longest;
    }, "") || ""
  );
};
