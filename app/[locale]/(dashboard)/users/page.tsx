import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import TableCard from "@/components/TableCard";
import UsersTable from "./UsersTable";

const page = async () => {
  const t = await getTranslations("Inventory");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CurrentPageFetcher page={t("mangeUser")} />
      <UsersTable />
    </Suspense>
  );
};

export default page;
