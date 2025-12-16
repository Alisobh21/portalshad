import type { AxiosRequestConfig } from "axios";
import { axiosPrivate } from "@/axios/axios";
import {
  handleNetworkErrors,
  handleResponseErrors,
} from "@/helpers/errorHandling";

type FetcherParams = {
  reqOptions?: AxiosRequestConfig;
  message?: string;
  initialFunc?: () => void;
  successCallback?: (data: any) => void;
  errCallback?: (data: any) => void;
  networkErrorCallback?: (err: any) => void;
  finalCallback?: () => void;
  signal?: any;
};

function useAxiosFetcher() {
  async function triggerAxiosFetcher({
    reqOptions,
    message,
    initialFunc,
    successCallback,
    errCallback,
    networkErrorCallback,
    finalCallback,
    signal,
  }: FetcherParams): Promise<void> {
    initialFunc?.();

    try {
      const response = await axiosPrivate({
        ...reqOptions,
        method: reqOptions?.method || "POST",
        signal,
      });

      handleResponseErrors(
        response,
        response?.data?.message || message,
        () => successCallback?.(response?.data),
        () => errCallback?.(response?.data)
      );
    } catch (err) {
      handleNetworkErrors(err as any);
      networkErrorCallback?.(err);
    } finally {
      finalCallback?.();
    }
  }

  return { triggerAxiosFetcher };
}

export default useAxiosFetcher;
