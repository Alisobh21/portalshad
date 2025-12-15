import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";

const page = async () => {
  const t = await getTranslations("Inventory");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CurrentPageFetcher page={t("mangeUser")} />
    </Suspense>
  );
};

export default page;
