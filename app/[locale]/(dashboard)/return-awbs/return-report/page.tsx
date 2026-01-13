import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import ReturnAwbsTable from "./ReturnAwbsTable";

export default async function ReturnAWBsReportPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <div className="">
      <CurrentPageFetcher page={t("returnAWBS.reportHeading")} />
      <ReturnAwbsTable />
    </div>
  );
}
