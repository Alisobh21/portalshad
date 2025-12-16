import { internalAxios } from "@/axios/axios";
import { toast } from "sonner";

/**
 * Interface for API response data structure
 */
interface ResponseData {
  success?: boolean;
  errors?: string[] | string | Record<string, string[]>;
  message?: string;
  data?: {
    success?: boolean;
    errors?: string[] | string | Record<string, string[]>;
    message?: string;
  };
}

/**
 * Interface for API error response structure
 */
interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      error?: string | string[];
    };
  };
  code?: string;
  message?: string;
}

/**
 * Handles API response errors and success cases
 *
 * @param response - The API response data
 * @param message - Optional success message to display
 * @param successCallback - Optional callback function to execute on success
 * @param errorCallback - Optional callback function to execute on error
 *
 * Features:
 * - Handles successful responses with optional success message and callback
 * - Processes different error formats (arrays, strings, objects)
 * - Displays appropriate toast notifications for each case
 * - Executes relevant callbacks based on response status
 */
export function handleResponseErrors(
  response: ResponseData,
  message: string | undefined,
  successCallback: (() => void) | undefined,
  errorCallback: (() => void) | undefined
): void {
  // Handle successful response
  if (response?.data?.success) {
    successCallback?.();
    message && toast.success(message || "");
  }

  // Handle message-only response
  if (
    !response?.data?.success &&
    !response?.data?.errors &&
    response?.data?.message
  ) {
    toast.error(response?.data?.message);
  }

  // Handle validation errors
  if (!response?.data?.success && response?.data?.errors) {
    // Handle array errors
    if (
      Array.isArray(response?.data?.errors) &&
      response?.data?.errors?.length > 0
    ) {
      response?.data?.errors?.map((item: string) => toast.error(item));

      // Handle string errors
    } else if (
      !Array.isArray(response?.data?.errors) &&
      typeof response?.data?.errors === "string" &&
      response?.data?.errors?.length > 0
    ) {
      toast.error(response?.data?.errors as string);

      // Handle object errors
    } else {
      Object.keys(response?.data?.errors as Record<string, string[]>)?.map(
        (key) =>
          Array.isArray(
            (response?.data?.errors as Record<string, string[]>)[key]
          ) &&
          toast.error(
            (response?.data?.errors as Record<string, string[]>)[key]?.join(",")
          )
      );
    }

    errorCallback?.();
  } else if (!response?.data?.success && !response?.data?.errors) {
    errorCallback?.();
  }
}

/**
 * Handles network-level errors from API requests
 *
 * @param err - The error response object
 *
 * Features:
 * - Handles authentication errors (401) with automatic logout
 * - Processes cancelled requests
 * - Displays error messages from different error formats
 * - Provides fallback error message
 */
export async function handleNetworkErrors(err: ErrorResponse): Promise<void> {
  console.log(err);

  // Handle authentication errors
  if (err?.response?.status === 401) {
    try {
      const res = await internalAxios.delete("/api/delete-auth");
      console.log(res);
      if (res?.data?.success) {
        window.location.href = "/login";
        localStorage.removeItem("FCM_ERRIM");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handle cancelled requests
  if (err?.code === "ERR_CANCELED") return;

  // Handle string errors
  if (
    err?.response?.data?.error &&
    err?.response?.data?.error?.length > 0 &&
    typeof err?.response?.data?.error === "string"
  ) {
    toast.error(err?.response?.data?.error);

    // Handle array errors
  } else if (
    err?.response?.data?.error &&
    err?.response?.data?.error?.length > 0 &&
    typeof err?.response?.data?.error === "object"
  ) {
    toast.error((err?.response?.data?.error as string[])?.join(","));

    // Handle generic errors
  } else {
    toast.error(err?.message || "Something went wrong!");
  }
}
