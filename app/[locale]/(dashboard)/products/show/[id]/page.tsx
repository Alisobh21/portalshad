import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
import { Card } from "@/components/ui/card";
import ProductPage from "./ProductPage";
import { Skeleton } from "@/components/ui/skeleton";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("AllProducts");
  const resolvedParams = await params;
  return (
    <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
      <CurrentPageFetcher page={t("details")} />
      <TableCard className="overflow-visible static">
        <ProductPage params={resolvedParams} />
      </TableCard>
    </Suspense>
  );
}
