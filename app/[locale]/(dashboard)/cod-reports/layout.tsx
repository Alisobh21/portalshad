import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import type { ReactElement, ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `Cod reporting | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

interface CodReportsLayoutProps {
  children: ReactNode;
}

export default function CodReportsLayout({
  children,
}: CodReportsLayoutProps): ReactElement {
  return (
    <section className="py-[10px]">
      <Card className="mb-4 dark:bg-default-50/80 backdrop-blur-sm">
        <CardContent className="relative z-20">
          <PageHeader />
        </CardContent>
      </Card>
      {children}
    </section>
  );
}
