import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import ReturnAwbsTable from "./ReturnAwbsTable";

export default async function ReturnAWBsReportPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <div className="p-4">
      <CurrentPageFetcher page={t("returnAWBS.reportHeading")} />
      <ReturnAwbsTable />
    </div>
  );
}
