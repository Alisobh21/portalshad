import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import ShippingAwbsTable from "./ShippingAwbsTable";

export default async function ShippingAWBsReportPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <div className="p-4">
      <CurrentPageFetcher page={t("reportHeading")} />
      <ShippingAwbsTable />
    </div>
  );
}
