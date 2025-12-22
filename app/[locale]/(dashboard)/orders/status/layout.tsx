import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: {
    default: `Orders | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

import type { ReactElement, ReactNode } from "react";

type OrdersLayoutProps = {
  children: ReactNode;
};

export default function OrdersLayout({
  children,
}: OrdersLayoutProps): ReactElement {
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
