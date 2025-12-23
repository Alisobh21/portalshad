import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PageSkeleton from "@/components/PageSkeleton";
import { Card } from "@/components/ui/card";
import ProductForm from "./ProductFrom";

export default async function page() {
  const t = await getTranslations("CreateProduct");
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("createProduct")} />
      <TableCard className="overflow-visible static">
        <Card className="p-4">
          <ProductForm />
        </Card>
      </TableCard>
    </Suspense>
  );
}
