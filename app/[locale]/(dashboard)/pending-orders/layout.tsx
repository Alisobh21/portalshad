import BreadCrumb from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";

interface PendingOrdersLayoutProps {
  children: ReactNode;
}

export default async function PendingOrdersLayout({
  children,
}: PendingOrdersLayoutProps): Promise<ReactElement> {
  const t = await getTranslations("Orders");
  return (
    <section className="">
      <Card className="mb-4 dark:bg-default-50/80 backdrop-blur-sm">
        <CardContent className="relative z-20">
          <div className="mb-3">
            <BreadCrumb />
          </div>
          <h1 className="font-normal text-2xl">{t("pendingOrders")}</h1>
        </CardContent>
      </Card>
      {children}
    </section>
  );
}
