import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
//all purchase orders
import { Card } from "@/components/ui/card";
import AllPurchase from "./AllPurchase";

interface PurchaseOrdersStatusPageProps {
  params: Promise<{ status: string }>;
}

export default async function PurchaseOrdersStatusPage({
  params,
}: PurchaseOrdersStatusPageProps) {
  const t = await getTranslations("PurchaseOrders");
  const resolvedParams = await params;
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("title")} />
      <TableCard className="overflow-visible static">
        <Card className="p-4">
          <AllPurchase status={resolvedParams.status} />
        </Card>
      </TableCard>
    </Suspense>
  );
}
