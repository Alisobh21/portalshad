"use client";

import type { JSX } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

export default function MainLoader(): JSX.Element {
  const { mainFetchingLoaderMsg } = useSelector(
    (state: RootState) => state.app
  );

  const message =
    typeof mainFetchingLoaderMsg === "string" && mainFetchingLoaderMsg.trim()
      ? mainFetchingLoaderMsg
      : "Loading";

  return (
    <div className="fixed w-dvw h-dvh bg-[#ffffff]/90 dark:bg-[#000000]/90 top-0 start-0 flex items-center justify-center">
      <div className="max-w-lg flex flex-col items-center justify-center gap-2">
        <h5>{message}</h5>
        <p>Please Wait....</p>
      </div>
    </div>
  );
}
