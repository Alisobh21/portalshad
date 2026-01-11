import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ReportPage from "./ReportPage";
import { Button } from "@/components/ui/button";

interface CodReportSinglePageProps {
  params: Promise<{ id: string }>;
}

export default async function CodReportSinglePage({
  params,
}: CodReportSinglePageProps) {
  const t = await getTranslations("Reports");
  const resolvedParams = await params;

  return (
    <>
      <CurrentPageFetcher
        page={{
          title: t("showReport"),
          customContent: (
            <Button
              asChild
              variant="normal"
              size="sm"
              className="mt-4 max-w-[200px]"
            >
              <Link prefetch={false} href="/cod-reports">
                {t("backReports")}
              </Link>
            </Button>
          ),
        }}
      />
      <ReportPage params={resolvedParams} />
    </>
  );
}
