import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import type { ReactElement, ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `Shipments | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

type ShipmentsLayoutProps = {
  children: ReactNode;
};

export default function ShipmentsLayout({
  children,
}: ShipmentsLayoutProps): ReactElement {
  return (
    <section className="py-[10px]">
      <Card className="mb-4">
        <CardContent className="px-[30px] relative z-[20] backdrop-blur-sm">
          <PageHeader />
        </CardContent>
      </Card>

      {children}
    </section>
  );
}
