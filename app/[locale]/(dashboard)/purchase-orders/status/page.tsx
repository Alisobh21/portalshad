import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import PageSkeleton from "@/components/PageSkeleton";
import { Link } from "@/i18n/navigation";
import { TbCopyCheckFilled } from "react-icons/tb";
import { MdPendingActions, MdCancel } from "react-icons/md";
import { IoLockClosedSharp } from "react-icons/io5";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";

interface PurchaseStatusCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  key: string;
  url: string;
}

export default async function PurchaseStatuses() {
  const t = await getTranslations("PurchaseOrders");

  const cards: PurchaseStatusCard[] = [
    {
      title: t("tabAll"),
      description: t("title"),
      icon: <TbCopyCheckFilled className="w-6 h-6 text-foreground" />,
      key: "all-po",
      url: "/purchase-orders/status/all-po",
    },
    {
      title: t("closed"),
      description: t("closedDescription"),
      icon: <IoLockClosedSharp className="w-6 h-6 text-foreground" />,
      key: "closed",
      url: "/purchase-orders/status/closed",
    },
    {
      title: t("tabPending"),
      description: t("pendingDescription"),
      icon: <MdPendingActions className="w-6 h-6 text-foreground" />,
      key: "pending",
      url: "/purchase-orders/status/pending",
    },
    {
      title: t("canceled"),
      description: t("canceledDescription"),
      icon: <MdCancel className="w-6 h-6 text-foreground" />,
      key: "canceled",
      url: "/purchase-orders/status/canceled",
    },
  ];

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={t("purchaseOrders")} />
      <section className="flex flex-col gap-4 mt-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Card
              key={card.key}
              className="relative dark:bg-default-50/70 lg:py-10"
            >
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="mb-4 text-3xl absolute top-3 end-3">
                  {card.icon}
                </div>
                <CardTitle className="text-xl lg:text-2xl font-semibold mb-2">
                  {card.title}
                </CardTitle>
                <p className="text-muted-foreground mb-3">{card.description}</p>
                <Link href={card.url}>
                  <Button size="default" variant="normal">
                    {t("view")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Suspense>
  );
}
