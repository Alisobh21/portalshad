"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function SuccessSubmit() {
  const t = useTranslations("shippingAWBs");

  return (
    <>
      <div className="p-5 flex flex-col gap-3 items-center justify-center">
        <Player
          autoplay
          loop={true}
          src="/firework.json"
          style={{
            width: "5rem",
            height: "5rem",
            margin: "1rem auto",
          }}
        />

        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-lg text-center font-bold">
            {t("createAWBSuccess")}
          </h3>
          <p className="text-muted-foreground text-sm">{t("redirecting")}</p>
        </div>
      </div>
    </>
  );
}
