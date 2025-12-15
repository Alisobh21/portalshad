import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `Users | ${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <section className="py-[10px]">
      <Card className="mb-4">
        <CardContent className="p-[30px] relative z-[20] backdrop-blur-sm bg-white/80 dark:bg-background/80">
          <PageHeader />
        </CardContent>
      </Card>

      {children}
    </section>
  );
}
