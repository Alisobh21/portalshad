"use client";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { _getAuthUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";

export default function AuthFetcher(): null {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios("/api/profile", { withCredentials: true });
        if (response?.data) {
          dispatch(_getAuthUser(response.data.user));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [dispatch]);

  return null;
}
