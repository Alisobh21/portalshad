import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import lsSecure from "@/helpers/Secure";
import { AxiosError, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL;
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

export const axiosTable = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // ln: (() => {
    //   if (typeof document !== "undefined") {
    //     const match = document.cookie.match(
    //       new RegExp("(^| )NEXT_LOCALE=([^;]+)")
    //     );
    //     return match ? decodeURIComponent(match[2]) : undefined;
    //   }
    //   return undefined;
    // })(),
    ln: Cookies.get("NEXT_LOCALE"),
  },
});

axiosTable.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && lsSecure) {
      const token = lsSecure.get("auth_token");
      console.log("token_", token);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ln: Cookies.get("NEXT_LOCALE"),
  },
});

export const axiosInternal = axios.create({
  baseURL: APP_URL,
  headers: {
    "Content-Type": "application/json",
    ln: Cookies.get("NEXT_LOCALE"),
  },
});

export const internalAxios = axios.create({
  baseURL: APP_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    ln: Cookies.get("NEXT_LOCALE"),
  },
});

async function updateUser() {
  try {
    const response = await axiosPrivate("/account");
    if (response?.data?.success) {
      const internalRes = await axiosInternal.post("/api/set-auth", {
        user: response?.data?.data,
      });
      if (internalRes?.data?.success) {
        window.location.reload();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

axiosPrivate.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && lsSecure) {
      const token = lsSecure.get("auth_token");
      console.log("token_", token);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.request.use(
  (config) => {
    if (config.url) {
      config.url = config.url;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosTable.interceptors.request.use(
  (config) => {
    if (config.url) {
      config.url = config.url;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const msg = response.data?.message;
    const successRes = response.data?.success;
    const validationErrors = response.data?.errors;

    if (successRes && msg) {
      if (response.config.method?.toLowerCase() !== "get") {
        toast.success(msg, {
          position: response.config.url?.includes("login")
            ? "bottom-right"
            : "top-center",
        });
      }
    } else if (!successRes) {
      if (!validationErrors) {
        toast.error("Something went wrong!");
      } else if (typeof validationErrors !== "string") {
        Object.keys(validationErrors).forEach((key) => {
          const errorMsg = Array.isArray(validationErrors[key])
            ? validationErrors[key].join(", ")
            : "Something went wrong!";
          toast.error(errorMsg);
        });
      }
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    if (!error.response) {
      return Promise.reject({ message: "Network Error" });
    }

    const { status, data } = error.response;

    if (
      status === 401 ||
      (status === 403 &&
        data?.message === "Please, Login first to one of customer accounts")
    ) {
      try {
        toast.error("🔒 Unauthorized: You need to log in.");
        await axiosInternal.post("/api/logout");
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
      }
    } else if (status === 422) {
      const errorData = data?.data as Record<string, string[]> | undefined;
      if (!errorData || Object.keys(errorData).length === 0) {
        toast.error(data?.message || "Validation error");
      } else {
        Object.keys(errorData)
          .map((key) => errorData[key])
          .flat()
          .forEach((errMsg: string) => toast.error(errMsg));
      }
    } else if (status === 400) {
      toast.error(data?.errors?.[0] || data?.message || "Bad Request");
    } else if (status === 403) {
      updateUser();
    } else {
      toast.error(
        `⚠️ Unexpected Error (${status}): ${data?.message || "Unknown error."}`
      );
    }

    return Promise.reject(error);
  }
);

export const axiosPublic = axios.create({
  baseURL: API_URL,
});

export const axiosCsrf = axios.create({
  baseURL: PUBLIC_URL,
});

axiosInternal.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && lsSecure) {
    const token = lsSecure.get("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosPrivate;
