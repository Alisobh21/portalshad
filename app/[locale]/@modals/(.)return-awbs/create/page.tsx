import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import PageSkeleton from "@/components/PageSkeleton";
import CreateReturnAWBForm from "./CreateReturnAWBForm";

export default async function CreateReturnAWBPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <CurrentPageFetcher page={t("returnAWBS.createShippingAwb")} />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-7">
            <CreateReturnAWBForm />
          </div>
        </div>
      </Suspense>
    </>
  );
}
