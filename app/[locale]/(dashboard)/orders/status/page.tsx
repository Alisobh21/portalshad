import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import PageSkeleton from "@/components/PageSkeleton";
import { Link } from "@/i18n/navigation";
import { GrSettingsOption } from "react-icons/gr";
import { TbCopyCheckFilled } from "react-icons/tb";
import { MdFreeCancellation, MdPendingActions } from "react-icons/md";
import CurrentPageFetcher from "@/components/CurrentPageFetcher";

interface OrderStatusCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  key: string;
  url: string;
}

export default async function OrderStatuses() {
  const t = await getTranslations("Homepage");
  const tOrders = await getTranslations("Orders");

  const cards: OrderStatusCard[] = [
    {
      title: t("inPreparationOrdersHeading"),
      description: t("inPreparationOrdersSubheading"),
      icon: <GrSettingsOption className="w-6 h-6 text-foreground" />,
      key: "inPreparation",
      url: "/orders/status/inPreparation",
    },
    {
      title: t("fulfilledOrdersHeading"),
      description: t("fulfilledOrdersSunheading"),
      icon: <TbCopyCheckFilled className="w-6 h-6 text-foreground" />,
      key: "fulfilled",
      url: "/orders/status/fulfilled",
    },
    {
      title: t("outstandigOrdersHeading"),
      description: t("outstandingOrdersSubheading"),
      icon: <MdPendingActions className="w-6 h-6 text-foreground" />,
      key: "outstanding",
      url: "/orders/status/outstanding",
    },
    {
      title: t("canceledOrdersHeading"),
      description: t("canceledOrdersSubheading"),
      icon: <MdFreeCancellation className="w-6 h-6 text-foreground" />,
      key: "canceled",
      url: "/orders/status/canceled",
    },
  ];

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPageFetcher page={tOrders("orders")} />
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
                    {t("viewOrders")}
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
