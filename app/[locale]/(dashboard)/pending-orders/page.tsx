import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import PendingOrdersTable from "./PendingOrdersTable";

export default async function PendingOrdersPage() {
  const t = await getTranslations("Orders");
  return (
    <div>
      <CurrentPageFetcher page={t("pendingOrders")} />
      <PendingOrdersTable />
    </div>
  );
}
