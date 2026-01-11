import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import PageSkeleton from "@/components/PageSkeleton";
import CreateShippingAWBForm from "./CreateShippingAWBForm";

export default async function CreateShippingAWBPage() {
  const t = await getTranslations("shippingAWBs");

  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <CurrentPageFetcher page={t("createShippingAwb")} />
            <CreateShippingAWBForm />
      </Suspense>
    </>
  );
}
