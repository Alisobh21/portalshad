import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import lsSecure from "@/helpers/Secure";
import { ErrorToast, SuccessToast } from "@/components/Toasts";
import { AxiosError, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL;
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, any>;
}

const axiosPrivate = axios.create({
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

axiosPrivate.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const msg = response?.data?.message; // ✅ TypeScript يفهمه تمام
    const success = response?.data?.success;
    const validationErrors = response?.data?.errors;

    if (success && msg) {
      if (response?.config?.method === "POST") {
        toast(<SuccessToast msg={msg} />);
      }
    }
    return response;
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
