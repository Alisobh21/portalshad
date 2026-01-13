import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shippingAWBs" });

  return {
    title: {
      default: `${t("title")} | ${siteConfig.name}`,
      template: `%s - ${siteConfig.name}`,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

interface ShippingAWBsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ShippingAWBsLayout({
  children,
}: ShippingAWBsLayoutProps): Promise<ReactElement> {
  return (
    <>
      <section className="py-[10px]">
        <Card className="dark:bg-default-50/80 mb-4 backdrop-blur-sm">
          <CardContent className="px-[30px] relative z-[20] backdrop-blur-sm">
            <PageHeader />
          </CardContent>
        </Card>
        {children}
      </section>
    </>
  );
}
