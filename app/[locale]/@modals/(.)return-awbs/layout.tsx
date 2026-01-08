import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ReturnAWBsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ReturnAWBsLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shippingAWBs" });

  return {
    title: {
      default: `${t("returnAWBS.title")} | ${siteConfig.name}`,
      template: `%s - ${siteConfig.name}`,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function ReturnAWBsLayout({
  children,
}: ReturnAWBsLayoutProps) {
  return (
    <>
      <section className="py-[10px]">
        <Card className="p-[30px] dark:bg-default-50/80 mb-4">
          <CardContent className="p-0">
            <div className="relative z-[20]">
              <PageHeader />
            </div>
          </CardContent>
        </Card>
        {children}
      </section>
    </>
  );
}
