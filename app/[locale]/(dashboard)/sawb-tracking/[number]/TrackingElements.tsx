"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MdOutlineTimelapse } from "react-icons/md";
import { FaCalendarWeek } from "react-icons/fa6";
import { FaGlobeAmericas } from "react-icons/fa";
import { PiCursorTextFill } from "react-icons/pi";
import axiosPrivate from "@/axios/axios";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CopyButton } from "@/components/ui/shadcn-io/copy-button";

interface TrackingStatus {
  code: string;
  time: string;
  location: string;
  description: string;
  ar_description?: string;
}

interface TrackingInfo {
  success: boolean;
  tracking_number: string;
  carrier_logo: string;
  local_status: string;
  trackingStatuses: TrackingStatus[];
}

interface TrackingElementsProps {
  trackingNumber: string;
}

export default function TrackingElements({
  trackingNumber,
}: TrackingElementsProps) {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [getTrackingLoading, setGetTrackingLoading] = useState<boolean>(true);
  const [getTrackingError, setGetTrackingError] = useState<boolean>(false);
  const t = useTranslations("TrackingPage");
  const locale = useLocale();

  useEffect(() => {
    async function getTrackingInfo() {
      setGetTrackingLoading(true);
      try {
        const response = await axiosPrivate.get<TrackingInfo>(
          `/sawb-tracking/${trackingNumber}`
        );
        if (response?.data?.success) {
          setTrackingInfo(response.data);
          setGetTrackingError(false);
        } else {
          setTrackingInfo(null);
          setGetTrackingError(true);
        }
      } catch (err) {
        setTrackingInfo(null);
        setGetTrackingError(true);
        console.error(err);
      } finally {
        setGetTrackingLoading(false);
      }
    }

    if (trackingNumber) {
      getTrackingInfo();
    }
  }, [trackingNumber]);

  return (
    <>
      {getTrackingLoading && (
        <div className="flex items-center justify-center flex-col gap-4">
          <Spinner className="size-8" />
          <div className="space-y-2 text-center">
            <p className="font-bold text-lg">{t("loadingTrackingStatus")}</p>
            <p className="text-muted-foreground">{t("pleaseWait")}</p>
          </div>
        </div>
      )}

      {trackingInfo && !getTrackingLoading && !getTrackingError && (
        <div className="flex flex-col w-full items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="flex flex-col w-full gap-3">
            {trackingInfo.carrier_logo && (
              <Image
                src={trackingInfo.carrier_logo}
                alt="Carrier Logo"
                width={200}
                height={100}
                className="object-contain w-full max-w-[150px] h-auto"
              />
            )}
            <div className="flex flex-col">
              <p className="text-[15px] text-muted-foreground">
                {t("trackingNumber")}
              </p>
              <h1 className="flex items-center gap-1 text-3xl lg:text-5xl font-bold leading-none font-mono">
                {trackingInfo.tracking_number}

                <CopyButton
                  content={trackingInfo.tracking_number}
                  variant="ghost"
                  size="md"
                  //   onCopy={() => console.log("Tracking number copied!")}
                />
              </h1>
            </div>
            <Badge variant="secondary" className="px-4 py-1 w-fit">
              <div className="text-[15px]">{trackingInfo.local_status}</div>
            </Badge>

            <div className="pt-10">
              {trackingInfo.trackingStatuses?.map((item, index) => (
                <div className="relative max-w-lg" key={index}>
                  <div className="absolute top-0 ltr:left-[-6px] rtl:right-[-6px]">
                    <div className="rounded-full border-background border-4 bg-foreground w-[30px] h-[30px] flex items-center justify-center">
                      <span className="text-background font-bold text-[12px]">
                        <MdOutlineTimelapse className="shrink-0" size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="ltr:border-l-2 rtl:border-r-2 pb-5 space-y-3 border-dashed dark:border-white/50 border-foreground ltr:pl-6 rtl:pr-6 ltr:ml-2 rtl:mr-2">
                    <h3 className="font-medium text-[17px] leading-none pt-1">
                      {item.code}
                    </h3>
                    <ul className="grid grid-cols-1 gap-1 text-[14px] list-inside">
                      <li className="px-3 flex items-center py-2 rounded-lg bg-accent/70 gap-2">
                        <FaCalendarWeek className="shrink-0" size={16} />
                        <span className="text-muted-foreground">
                          {item.time}
                        </span>
                      </li>
                      <li className="px-3 flex items-center py-2 rounded-lg bg-accent/70 gap-2">
                        <FaGlobeAmericas className="shrink-0" size={16} />
                        <span className="text-muted-foreground">
                          {item.location !== ""
                            ? item.location
                            : t("noLocationFound")}
                        </span>
                      </li>
                      <li className="px-3 flex items-center py-2 rounded-lg bg-accent/70 gap-2">
                        <PiCursorTextFill className="shrink-0" size={16} />
                        <span className="text-muted-foreground">
                          {locale === "en"
                            ? item.description
                            : item.ar_description || item.description}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {getTrackingError && !getTrackingLoading && (
        <div className="flex flex-col w-full items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col">
              <p className="text-[15px] text-muted-foreground">
                {t("trackingNumber")}
              </p>
              <h1 className="text-3xl lg:text-6xl font-bold leading-none font-mono">
                {trackingNumber}
              </h1>
            </div>

            <Alert variant="destructive">
              <AlertTitle>{t("trackingNumberNotFound")}</AlertTitle>
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}
