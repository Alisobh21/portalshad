import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PurchasePage from "./PurchasePage";
import { Skeleton } from "@/components/ui/skeleton";

interface PurchaseOrderShowPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PurchaseOrderShowPageProps) => {
  const t = await getTranslations("PurchaseOrders");
  const resolvedParams = await params;

  return (
    <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
      <CurrentPageFetcher page={t("onePurchaseOrder")} />
      <TableCard className="overflow-visible static">
        <PurchasePage params={resolvedParams} />
      </TableCard>
    </Suspense>
  );
};

export default page;
