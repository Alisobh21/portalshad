import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
import AllOrders from "./AllOrders";
import { Card } from "@/components/ui/card";

interface OrdersStatusPageProps {
  params: Promise<{ status: string }>;
}

export default async function OrdersStatusPage({
  params,
}: OrdersStatusPageProps) {
  const t = await getTranslations("Orders");
  const resolvedParams = await params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("orders")} />
      <TableCard className="overflow-visible static">
        <Card className="p-4">
          <AllOrders status={resolvedParams.status} />
        </Card>
      </TableCard>
    </Suspense>
  );
}
