import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
import { Card } from "@/components/ui/card";
import AllProducts from "./AllProducts";

export default async function ProductssPage() {
  const t = await getTranslations("Sidebar");

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("products")} />
      <TableCard className="overflow-visible static">
        <Card className="p-4">
          <AllProducts />
        </Card>
      </TableCard>
    </Suspense>
  );
}
