"use client";

import { FC, ReactElement } from "react";
import { useTranslations } from "next-intl";
import Countdown from "react-countdown";

/* ================= Types ================= */

interface CountdownRendererProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

interface TimeUnit {
  label: string;
  value: number;
}

/* ================= Component ================= */

const CountDownEl: FC = () => {
  const t = useTranslations("Maintenance");

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRendererProps): ReactElement | null => {
    if (completed) {
      return null;
    }

    const timeUnits: TimeUnit[] = [
      { label: t("hour"), value: hours },
      { label: t("minute"), value: minutes },
      { label: t("second"), value: seconds },
    ];

    return (
      <div className="flex lg:me-auto gap-2 pt-3">
        {timeUnits.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-2 items-center">
            <div
              className="rounded-2xl text-[30px] bg-content3/50 dark:bg-content2/50 text-consolas w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] lg:text-[50px] flex items-center justify-center"
              suppressHydrationWarning={true}
            >
              {String(value).padStart(2, "0")}
            </div>
            <span className="text-[13px] lg:text-[14px]">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!process.env.NEXT_PUBLIC_RETURN_TIME) return null;

  return (
    <Countdown
      date={new Date(process.env.NEXT_PUBLIC_RETURN_TIME)}
      renderer={renderer}
    />
  );
};

export default CountDownEl;
