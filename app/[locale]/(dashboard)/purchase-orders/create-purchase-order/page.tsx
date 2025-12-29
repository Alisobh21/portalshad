import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
// import CreateForm from "./CreateForm";
import PageSkeleton from "@/components/PageSkeleton";

const page = async () => {
  const t = await getTranslations("PurchaseOrders");
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("titlecreate")} />
      <TableCard className="overflow-visible static">
        {/* <PurchaseOrderPage params={resolvedParams} /> */}
      </TableCard>
    </Suspense>
  );
};

export default page;
