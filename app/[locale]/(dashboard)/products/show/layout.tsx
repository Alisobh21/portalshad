import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import type { ReactElement, ReactNode } from "react";

export const metadata = {
  title: {
    default: `Products | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

type ProductsLayoutProps = {
  children: ReactNode;
};

export default function ProductsLayout({
  children,
}: ProductsLayoutProps): ReactElement {
  return (
    <section className="py-[10px]">
      <Card className="mb-4">
        <CardContent className="px-[30px] relative z-[20] backdrop-blur-sm">
          <PageHeader hideBreadcrumb={true} />
        </CardContent>
      </Card>
      {children}
    </section>
  );
}
