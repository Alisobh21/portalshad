import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import OrderPage from "./orderPage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const t = await getTranslations("Orders");
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CurrentPageFetcher page={t("details")} />
      <TableCard className="overflow-visible static">
        <OrderPage params={resolvedParams} />
      </TableCard>
    </Suspense>
  );
};

export default page;
