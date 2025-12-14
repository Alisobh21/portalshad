"use client";

import type { JSX } from "react";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaDoorOpen } from "react-icons/fa6";

import axiosPrivate from "@/axios/axios";
import { Button } from "@/components/ui/button";
import lsSecure from "@/helpers/Secure";

type LoadingState = null | "loading" | "redirect";

export default function LogoutBtn(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("Navbar");
  const [logoutLoading, setLogoutLoading] = useState<LoadingState>(null);

  async function handleLogout() {
    setLogoutLoading("loading");

    try {
      const response = await axiosPrivate.post("/logout");
      if (response?.data?.success) {
        const res = await axios.post("/api/logout", undefined, {
          withCredentials: true,
        });

        if (res?.data?.success && lsSecure) {
          lsSecure.remove("auth_token");
        }

        setLogoutLoading("redirect");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setLogoutLoading(null);
    }
  }

  const isLoading = logoutLoading === "loading";

  return (
    <Button
      disabled={Boolean(logoutLoading)}
      onClick={handleLogout}
      className="w-full flex justify-start gap-2"
      aria-busy={isLoading}
    >
      <FaDoorOpen />
      <span className="text-[14px]">
        {logoutLoading === "redirect" ? "Redirecting..." : t("logout")}
      </span>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-auto" /> : null}
    </Button>
  );
}
