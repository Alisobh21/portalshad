import axiosPrivate from "@/axios/axios";
import { attachKeyLabel } from "./utils";
import axios from "axios";

// Type definitions
interface StateResponse {
  states?: Array<Record<string, unknown>>;
}

interface CityResponse {
  cities?: Array<Record<string, unknown>>;
}

interface HubResponse {
  success: boolean;
  data: Array<Record<string, unknown>>;
}

interface ProductResponse {
  success: boolean;
  product: Record<string, unknown>;
}

interface ProfileData {
  [key: string]: unknown;
}

interface AddressPayload {
  [key: string]: unknown;
}

interface AddressResponse {
  success: boolean;
  data?: unknown;
}

interface CarriersResponse {
  success: boolean;
  data?: unknown;
}

// ... [ASYNC] - Get State By Country
export async function getStateByCountry(
  countryId: string | number,
  catchFunction: (data: Array<{ key: string | number; label: string }>) => void,
  locale: string
): Promise<void> {
  catchFunction([]);
  try {
    const response = await axiosPrivate(`/geolocation/state/${countryId}`);
    const data = response?.data as StateResponse;
    if (data?.states) {
      catchFunction(attachKeyLabel(data.states, "id", `name_${locale}`));
    }
  } catch (err) {
    console.error(err);
  }
}

// ... [ASYNC] - Get City By State
export async function getCitiesByState(
  stateId: string | number,
  catchFunction: (data: Array<{ key: string | number; label: string }>) => void,
  locale: string
): Promise<void> {
  catchFunction([]);
  try {
    const response = await axiosPrivate(`/geolocation/city/${stateId}`);
    const data = response?.data as CityResponse;
    if (data?.cities) {
      catchFunction(attachKeyLabel(data.cities, "id", `name_${locale}`));
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getCurrentHub(
  hubId: string | number,
  catchFunc?: (data: Record<string, unknown>) => void
): Promise<void> {
  try {
    const response = await axiosPrivate(`/v1/hub?hubId=${hubId}`);
    const data = response?.data as HubResponse;
    if (data?.success && data.data?.[0]) {
      catchFunc?.(data.data[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getServerCurrentProduct(
  productId: string | number
): Promise<Record<string, unknown> | undefined> {
  try {
    const response = await axiosPrivate(`/v1/product?productId=${productId}`);
    const data = response?.data as ProductResponse;
    return data?.product;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function getAllHubs(
  catchFunc?: (data: Array<Record<string, unknown>>) => void
): Promise<void> {
  try {
    const response = await axiosPrivate("/v1/hub");
    const data = response?.data as HubResponse;
    if (data?.success) {
      catchFunc?.(data.data);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getCurrentProduct(
  productId: string | number,
  catchFunc?: (data: Record<string, unknown>) => void
): Promise<void> {
  try {
    const response = await axiosPrivate(`/v1/product?productId=${productId}`);
    const data = response?.data as ProductResponse;
    if (data?.success) {
      catchFunc?.(data.product);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getProfileData(
  callback?: (data: ProfileData) => void
): Promise<void> {
  try {
    const response = await axios("/api/profile", { withCredentials: true });
    if (response?.data) {
      callback?.(response.data as ProfileData);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getActiveStores(
  callback?: (data: unknown) => void
): Promise<void> {
  try {
    const response = await axiosPrivate("/integrations/list-active-stores");
    if (response?.data) {
      callback?.(response.data);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getUserAddresses(
  userType: string,
  shippingType: string,
  callback?: (data: unknown) => void,
  direction?: boolean,
  order_id?: string | number
): Promise<void> {
  try {
    const directionParam = direction ? "&shipment_direction=return" : "";
    const orderIdParam = order_id ? `&order_id=${order_id}` : "";
    const url = `/filtered-addresses?for_type=${userType}&shipping_type=${shippingType}&limit=30&pairable=true&has_carriers=true${directionParam}${orderIdParam}`;

    const response = await axiosPrivate(url);
    callback?.(response?.data);
  } catch (err) {
    console.error(err);
  }
}

export async function getUserCities(
  callback?: (data: unknown) => void
): Promise<void> {
  try {
    const response = await axiosPrivate("/user-cities");
    if (response?.data?.success) {
      callback?.(response.data);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function insertAddress(
  payload: AddressPayload,
  loadingFunction?: () => void,
  successCallback?: (data: AddressResponse) => void,
  errorCallback?: () => void,
  settledCallback?: () => void
): Promise<void> {
  loadingFunction?.();
  try {
    const response = await axiosPrivate.post("/addresses/insert", {
      ...payload,
    });
    const data = response?.data as AddressResponse;
    if (data?.success) {
      successCallback?.(data);
    }
  } catch (err) {
    console.error(err);
    errorCallback?.();
  } finally {
    settledCallback?.();
  }
}

export async function getCarriers(
  callback?: (data: CarriersResponse) => void,
  loadingFunction?: () => void,
  errorCallback?: () => void,
  settledCallback?: () => void
): Promise<void> {
  loadingFunction?.();
  try {
    const response = await axiosPrivate("/carriers");
    const data = response?.data as CarriersResponse;
    if (data?.success) {
      callback?.(data);
    }
  } catch (err) {
    console.error(err);
    errorCallback?.();
  } finally {
    settledCallback?.();
  }
}
