import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";

const page = async () => {
  const t = await getTranslations("CreateOrder");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CurrentPageFetcher page={t("Create")} />
      <TableCard className="p-5 dark:bg-default-50/70 overflow-visible static">
        {/* <UsersTable /> */}
      </TableCard>
    </Suspense>
  );
};

export default page;
