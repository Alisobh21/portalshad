"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axiosPrivate from "@/axios/axios";
import {
  addCountries,
  addShippingMethods,
  addSuppliers,
  addWarehouses,
  addWarehousesList,
  setLoadingCountriess,
  setLoadingSuppliers,
  setLoadingWarehouses,
  setLoadingWarehousesList,
  setLoadingloadingShippings,
} from "@/store/slices/appSlice";
import { fetchWarehousesDDL } from "@/store/slices/CountrySlice";
import {
  _getUserAddresses,
  _getUserCities,
} from "@/store/slices/geolocationSlice";
import type { AppDispatch, RootState } from "@/store/store";

type WarehouseListItem = { id: string; identifier: string; name: string };

export default function FetchInitData(): null {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const isAdmin =
      Array.isArray(user?.roles) &&
      user.roles.some((role: { name?: string }) => role?.name === "admin");

    if (!user || isAdmin) return;

    const run = async () => {
      try {
        dispatch(setLoadingCountriess(true));
        const response = await axiosPrivate("/ddl/countries");
        if (response.data?.success) {
          dispatch(addCountries(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        dispatch(setLoadingCountriess(false));
      }

      try {
        dispatch(setLoadingWarehousesList(true));
        const response = await axiosPrivate("/ddl/warehouses_list");
        if (response.data?.success) {
          const list: WarehouseListItem[] =
            Object.keys(response?.data?.data ?? {}).map((key) => ({
              id: key,
              identifier: key,
              name:
                (response?.data?.data as Record<string, string | undefined>)[
                  key
                ] ?? "",
            })) ?? [];
          dispatch(addWarehousesList(list as WarehouseListItem[]));
        }
      } catch (error) {
        console.error("Error fetching warehouses list:", error);
      } finally {
        dispatch(setLoadingWarehousesList(false));
      }

      try {
        dispatch(setLoadingWarehouses(true));
        const response = await axiosPrivate("/purchase-orders/create");
        if (response.data?.success) {
          dispatch(
            addWarehouses(response.data.account?.data?.warehouses ?? [])
          );
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      } finally {
        dispatch(setLoadingWarehouses(false));
      }

      try {
        dispatch(setLoadingloadingShippings(true));
        const response = await axiosPrivate("/ddl/shipping-methods");
        if (response.data?.success) {
          dispatch(addShippingMethods(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      } finally {
        dispatch(setLoadingloadingShippings(false));
      }

      try {
        dispatch(setLoadingSuppliers(true));
        const response = await axiosPrivate("/purchase-orders/create");
        if (response.data?.success) {
          dispatch(addSuppliers(response.data.vendors?.data?.edges ?? []));
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        dispatch(setLoadingSuppliers(false));
      }

      dispatch(fetchWarehousesDDL());
      dispatch(_getUserCities([]));
      dispatch(_getUserAddresses([]));
    };

    run();
  }, [user, dispatch]);

  return null;
}
