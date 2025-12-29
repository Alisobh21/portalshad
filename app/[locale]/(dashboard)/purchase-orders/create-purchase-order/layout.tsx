import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import PageSkeleton from "@/components/PageSkeleton";
import type { ReactElement, ReactNode } from "react";
import { Suspense } from "react";
export const metadata = {
  title: {
    default: `Purchase Orders | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

type PurchaseOrdersShowLayoutProps = {
  children: ReactNode;
};

export default function PurchaseOrdersShowLayout({
  children,
}: PurchaseOrdersShowLayoutProps) {
  //   return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
  return (
    <section className="py-[10px]">
      <Card className="mb-4">
        <CardContent className="p-[30px] relative z-[20] backdrop-blur-sm">
          <PageHeader />
        </CardContent>
      </Card>

      {children}
    </section>
  );
}
