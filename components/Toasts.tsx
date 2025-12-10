"use client";

import * as React from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { IoCloseOutline } from "react-icons/io5";

interface ToastProps {
  msg: string;
}

// Error Toast
export function ErrorToast({ msg }: ToastProps) {
  return (
    <Alert
      variant="destructive"
      className="w-full mb-2 backdrop-blur-[20px] dark:bg-red-100/50"
    >
      <div className="flex items-start justify-between w-full">
        <AlertTitle>{msg}</AlertTitle>
        <IoCloseOutline className="h-4 w-4 cursor-pointer" />
      </div>
    </Alert>
  );
}

// Success Toast
export function SuccessToast({ msg }: ToastProps) {
  return (
    <Alert
      variant="default"
      className="w-full mb-2 backdrop-blur-[20px] dark:bg-green-100/50"
    >
      <div className="flex items-start justify-between w-full">
        <AlertTitle className="dark:text-green-600">{msg}</AlertTitle>
        <IoCloseOutline className="h-4 w-4 cursor-pointer" />
      </div>
    </Alert>
  );
}

// Info Toast
export function InfoToast({ msg }: ToastProps) {
  return (
    <Alert
      variant="default"
      className="w-full mb-2 backdrop-blur-[20px] dark:bg-blue-100/50"
    >
      <div className="flex items-start justify-between w-full">
        <AlertTitle className="dark:text-blue-600">{msg}</AlertTitle>
        <IoCloseOutline className="h-4 w-4 cursor-pointer" />
      </div>
    </Alert>
  );
}
