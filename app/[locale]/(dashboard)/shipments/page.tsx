import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
import { Card } from "@/components/ui/card";
import PullShipments from "./PullShipments";
import ShippingLabelsTable from "./ShippingLabelsTable";

export default async function ShipmentsPage() {
  const t = await getTranslations("Sidebar");

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("shipments")} />
      <PullShipments />
      <Card className="p-4 mt-2">
        <ShippingLabelsTable />
      </Card>
    </Suspense>
  );
}
