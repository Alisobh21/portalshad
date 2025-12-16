"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ReactNode, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { RootState } from "@/store/store";

import { GrSettingsOption } from "react-icons/gr";
import { TbCopyCheckFilled } from "react-icons/tb";
import { MdFreeCancellation, MdPendingActions } from "react-icons/md";
import TableWeek from "./Tableweek";

interface WelcomeCardItem {
  title: string;
  description: string;
  icon: ReactNode;
  key: string;
  url: string;
  src: string;
  height: string;
  width: string;
}

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function WelcomeCard(): ReactElement {
  const t = useTranslations("Homepage");
  const { user } = useSelector((state: RootState) => state.auth);

  const cards: WelcomeCardItem[] = [
    {
      title: t("inPreparationOrdersHeading"),
      description: t("inPreparationOrdersSubheading"),
      icon: <GrSettingsOption className="w-6 h-6" />,
      key: "inPreparation",
      url: "/orders/status/inPreparation",
      src: "/OrderPlaced.json",
      height: "150px",
      width: "150px",
    },

    {
      title: t("fulfilledOrdersHeading"),
      description: t("fulfilledOrdersSunheading"),
      icon: <TbCopyCheckFilled className="w-6 h-6" />,
      key: "fulfilled",
      url: "/orders/status/fulfilled",
      src: "/Receiveorder.json",
      height: "150px",
      width: "150px",
    },
    {
      title: t("outstandigOrdersHeading"),
      description: t("outstandingOrdersSubheading"),
      icon: <MdPendingActions className="w-6 h-6" />,
      key: "outstanding",
      url: "/orders/status/outstanding",
      src: "/Alert.json",
      height: "80px",
      width: "80px",
    },
    {
      title: t("canceledOrdersHeading"),
      description: t("canceledOrdersSubheading"),
      icon: <MdFreeCancellation className="w-6 h-6" />,
      key: "canceled",
      url: "/orders/status/canceled",
      src: "/canceled.json",
      height: "100px",
      width: "100px",
    },
  ];

  return (
    <>
      {/* Welcome Header */}
      <Card className="mb-2 backdrop-blur-sm bg-white/90 dark:bg-neutral-900/80 flex flex-col items-center text-center">
        <CardContent className="p-[30px] flex flex-col items-center text-center">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-2 w-full">
            <div>
              <p className="text-[20px]">{t("welcomeHeading2")}</p>
              <h1 className="font-bold text-[25px]">
                {String(user?.name ?? "")}
              </h1>
              <p className="text-muted-foreground mb-3">
                {t("welcomeSubheading")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards + Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 items-start">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Card
              key={card.key}
              className="relative backdrop-blur-sm bg-white/90  h-full  dark:bg-neutral-900/80"
            >
              <CardContent className="p-5 lg:py-10 flex flex-col h-full items-center text-center gap-3">
                <div className="absolute top-3 end-3 text-3xl">{card.icon}</div>

                <h3 className="text-lg lg:text-xl font-semibold mb-2">
                  {card.title}
                </h3>

                <Player
                  autoplay
                  loop
                  src={card.src}
                  style={{
                    height: card.height,
                    width: card.width,
                  }}
                />

                <p className="text-muted-foreground text-sm lg:text-base mb-3 mt-auto">
                  {card.description}
                </p>

                <Button
                  asChild
                  size="default"
                  className="max-w-[40%] mt-auto"
                  variant="normal"
                >
                  <Link href={card.url}>{t("viewOrders")}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex-1">
          <TableWeek />
        </div>
      </div>
    </>
  );
}
