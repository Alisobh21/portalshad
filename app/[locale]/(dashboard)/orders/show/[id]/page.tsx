import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import OrderPage from "./orderPage";
import { Skeleton } from "@/components/ui/skeleton";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const t = await getTranslations("Orders");
  const resolvedParams = await params;

  return (
    <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
      <CurrentPageFetcher page={t("details")} />
      <TableCard className="overflow-visible static">
        <OrderPage params={resolvedParams} />
      </TableCard>
    </Suspense>
  );
};

export default page;
