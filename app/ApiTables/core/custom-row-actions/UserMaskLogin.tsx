"use client";

import axiosPrivate, { axiosInternal } from "@/axios/axios";
import { scrollUpOnePixel } from "@/helpers/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface MaskLoginRoute {
  route?: string;
  method?: string;
}

interface ActionButton {
  label?: string;
}

interface Action {
  mask_login_route?: MaskLoginRoute;
  button?: ActionButton;
}

interface UserMaskLoginProps {
  action: Action;
}

export default function UserMaskLogin({ action }: UserMaskLoginProps) {
  const URL = action?.mask_login_route?.route?.replace(/^\/api/, "");
  const method = action?.mask_login_route?.method;
  const [loginLoading, setLoginLoading] = useState(false);

  async function handleMaskLogin() {
    setLoginLoading(true);
    try {
      const response = await axiosPrivate({
        url: URL,
        method: method,
      });

      if (response?.data?.success) {
        const res = await axiosInternal.post(
          "/api/set-auth",
          { user: response?.data?.data },
          { withCredentials: true }
        );
        if (res?.data?.success) {
          window.location.href = "/";
        }
      }

      console.log();
    } catch (err) {
      console.log(err);
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={loginLoading}
      onClick={handleMaskLogin}
      onMouseUp={() => {
        scrollUpOnePixel();
      }}
    >
      {loginLoading ? (
        <>
          <Spinner className="mr-2" />
          Loading...
        </>
      ) : (
        action?.button?.label
      )}
    </Button>
  );
}
