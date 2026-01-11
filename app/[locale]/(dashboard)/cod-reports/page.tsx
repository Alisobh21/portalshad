import { Card } from "@/components/ui/card";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import { getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import AllReports from "./AllReports";

export default async function CodReportsPage(): Promise<ReactElement> {
  const t = await getTranslations("Reports");
  return (
    <>
      <CurrentPageFetcher
        page={{
          title: t("title"),
          subheading: t("subtitle"),
        }}
      />
      <Card className="p-2 lg:p-5 mb-5 dark:bg-default-50/70 overflow-visible static">
        <AllReports />
      </Card>
    </>
  );
}
