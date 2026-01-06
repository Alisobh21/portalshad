import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import PageSkeleton from "@/components/PageSkeleton";
import CreateShippingAWBForm from "./CreateShippingAWBForm";
import ShippingAwbSummary from "./ShippingAwbSummary";

export default async function CreateShippingAWBPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <CurrentPageFetcher page={t("createShippingAwb")} />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-7">
            <CreateShippingAWBForm />
          </div>
          <div className="xl:col-span-5">
            <ShippingAwbSummary />
          </div>
        </div>
      </Suspense>
    </>
  );
}
