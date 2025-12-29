import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import PurchasedForm from "./PurchasedForm";
import PageSkeleton from "@/components/PageSkeleton";

const page = async () => {
  const t = await getTranslations("PurchaseOrders");
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("titlecreate")} />
      <TableCard className="overflow-visible static">
        <PurchasedForm />
      </TableCard>
    </Suspense>
  );
};

export default page;
